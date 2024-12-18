'use server'

import { addDays, format, formatDate } from 'date-fns'
import OpenAI from 'openai'
import { DateRange } from 'react-day-picker'
import {ZodError, z} from 'zod'
import { createClient } from './supabase/server'
import { redirect, RedirectType } from 'next/navigation'
import { revalidatePath } from 'next/cache'

import { CreateEmailRequestOptions, CreateEmailResponse, Resend } from 'resend'
import EmailInvite from '@/components/dashboard-ui/EmailInvite'
import { NameEntry } from '@/components/shift-table-ui/NameLabelAdd'

const resend = new Resend(process.env.RESEND_KEY)

interface GeneratePropsWithEnabled {
    names: string[],
    jobs: string[],
    dateRange: DateRange,
    days: string[],

    advancedEnabled: true
    jobPercentages: Record<string,Record<string,number>>
}

interface GeneratePropsWithoutEnabled {
    names: string[],
    jobs: string[],
    dateRange: DateRange,
    days: string[],

    advancedEnabled: false
}

type GenerateProps = GeneratePropsWithEnabled | GeneratePropsWithoutEnabled

export interface GenerateResponse {
    day: string,
    assignments: Record<string,string>
}

const systemRole = "You are the manager of a business. You are in charge of designing schedules mapping each person's name to a job/task they are assigned on a given day."

const schema = {
    day: '[mm/dd]',
    assignments: {
        name: 'job'
    }
}
function createPrompt(args: GenerateProps){
    console.log(args.advancedEnabled)

    if(args.advancedEnabled){
        return `Generate a schedule. Randomly map the following names, ${args.names.join(', ')} to the following jobs, ${args.jobs.join(', ')} for each day. The schedule should be for ONLY these days in a week, ${args.days.join(', ')} between ${format(args.dateRange.from as Date,'LLL dd yyyy')} to ${format(args.dateRange.to as Date,'LLL dd yyyy')}. You are also given the following json object that maps each person's name to to an object mapping each job to the chance they have to getting assigned to that job in the whole schedule, ${JSON.stringify(args.jobPercentages)}, generate accordingly. Remember, Jobs can only be assigned once! They cannot be repeated for multiple persons! If no jobs left to assign to a person in a single day,assign one of the remaining jobs to the person, else, set that person's assigned job to a "-". Finally, return the schedule as a list of objects that have the following schema,${JSON.stringify(schema)} in plain raw json. If no jobs left to assign, set that person's assigned job to a "-". Only output JSON. NO EXTRANEOUS TEXT. Let each object will represent a day.`
    }

    return `Generate a schedule. Randomly map the following names, ${args.names.join(', ')} to the following jobs, ${args.jobs.join(', ')} for each day. The schedule should be for ONLY these days in a week, ${args.days.join(', ')} between ${format(args.dateRange.from as Date,'LLL dd yyyy')} to ${format(args.dateRange.to as Date,'LLL dd yyyy')}. Remember, Jobs can only be assigned once! They cannot be repeated for multiple persons! The order in which you assign jobs should also be random. Finally, return the schedule as a list of objects that have the following schema,${JSON.stringify(schema)} in plain raw json. No Extraneous text. Let each object will represent a day.`
}

const days = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday']
async function createShiftPrompt(startingDate: Date,names: string[],availabilities: any[],timeOffRequests: any[]){
    const supabase = await createClient()

    const mappedAvails: Record<string,any> = names.map((n,i) => availabilities[i])

    const trueMap: Map<string,any> = new Map()

    const endingDate = addDays(startingDate,6)

    for(let i = 0; i < names.length; i++){
        trueMap.set(names[i],mappedAvails[i])
    }

    let avails: string[] = [] // store each person's availability in a sentence

    for(let name of names){
        let str = `${name} is ONLY available on `

        for(let d of days.filter(d => trueMap.get(name)[d].enabled)){
            const currDay = trueMap.get(name)[d]

            str += `${d} from ${currDay.from} to ${currDay.to}, `
        }
        avails.push(str)
    }

    let timeOff: string[] = []

    console.log('TIME OFF',timeOffRequests)

    for(let t of timeOffRequests){
        const profileData = await supabase.from('profiles').select().eq('id',t.user_id)
        if(profileData.error) {console.error(profileData.error.message); continue}
        
        const profile = profileData.data[0]

        const name  = profile.first_name + ' ' + profile.last_name

        let timeOffStr = `${name} has time off from ${formatDate(t.from,'MMMM dd, yyyy')} to ${formatDate(t.to,'MMMM dd, yyyy')} ( in 24hr military time)`
        
        timeOff.push(timeOffStr)
    }

    const daysInOrder: string[] = []
    let d: Date = startingDate;
    let i = 0

    while(i < 7){
        daysInOrder.push(formatDate(d,'iiii'))

        d = addDays(d,1)
        i++
    }

    return ` Generate a schedule with the following names, ${names.join(', ')}. For context, this week's schedule starts with a ${formatDate(startingDate,'iiii')} and ends with ${formatDate(endingDate,'iiii')}, specifically ${formatDate(startingDate,'MMMM dd,yyyy')} to ${formatDate(endingDate,'MMMM dd,yyyy')}, respectively. The times of people's shifts is represented in military time. Factor in the following availabilities of each person: ${avails.join('')}. Schedule people for ONLY the days and times they are available, if you don't adhere to this, you will be punished. Secondly, IF I specify person has time off on any given day, do not schedule them for that day. Factor in the following approved time-off requests: ${timeOff.length > 0 ? timeOff.join(', ') : 'None'}.  Return the result ONLY in raw JSON format, in which each person's name is mapped to a list of the shifts they will work. Each index of said lists will represent the days of week a person is working, [${daysInOrder.join(',')}], 0-6 respectively, and the value at each index is an object of type, {leave: null, from: number, to: number}, where "from" is the time their shift starts and "to" is the time their shift ends, all in 24HR time military time as specified. The "leave" value just means the person has an approved time-off for that day, in which case, set schedule[name][i] to {leave: true, from: null, to: null} only if that person has time-off for that day. If it is not due to time-off, meaning they're simply not available for that day, set schedule[name][i] to {leave: false, from: 0, to: 0}. Every schedule[name] always has a length of 7 because there are 7 days in a week. Review the schdule, make the changes necessary so that the schedule matches the availsbilites and time-offs of each person before sending it. YOU ONLY OUTPUT raw json. Absolutely NO comments and NO extraneous text! `
}

const openai = new OpenAI({
    apiKey: process.env.API_KEY!
})

export default async function generate(args: GenerateProps): Promise<GenerateResponse> {

    const prompt = createPrompt(args)

    const res = await openai.chat.completions.create({
        model: 'gpt-4-turbo',
        response_format: {type: 'json_object'},
        messages: [
            {role: 'system', content: systemRole},
            {role: 'user', content: prompt}
        ]
    })

    console.log(typeof res.choices[0].message.content)

    const schedule: GenerateResponse = JSON.parse(res.choices[0].message.content!) as any

    console.log(schedule)


    return schedule as GenerateResponse
}

export async function signUp(prevState: any, data: FormData){
    const client = await createClient()

    const newUserSchema = z.object({
        firstName: z.string(),
        lastName: z.string(),
        password: z.string(),
        email: z.string().email(),
        confPassword: z.string()
    })

    let newUser = {
        firstName: data.get('fname'),
        lastName: data.get('lname'),
        email: data.get('email'),
        password: data.get('password'),
        confPassword: data.get('conf-password')
    }

    try {
        const user = newUserSchema.parse(newUser)

        
        if(user.password != user.confPassword){
            return {message: "Passwords don't match"}
        }

        const res = await client.auth.signUp({
            email: (newUser.email as string),
            password: (newUser.password as string)
        })

        await client.from('profiles').insert({
            id: res.data.user?.id,
            first_name: newUser.firstName,
            last_name: newUser.lastName,
            email: newUser.email
        })

        const newBusinesses = await client.from('business').insert({
            name: (data.get('business_name') as string) || `${newUser.firstName}'s Business`,
            owner_id: res.data.user?.id
        })
            
        
    } catch(e){
        console.error(e)
        return {
            businessId: null,
            error: e
        }
    }

    return {businessId: 'works',error: null}
}

export async function logIn(prevState: any, data: FormData){
    const client = await createClient()

    const returningUser = {
        email: data.get('email') as string,
        password: data.get('password') as string
    }

    const res = await client.auth.signInWithPassword({
        email: returningUser.email as string,
        password: returningUser.password as string
    })

    if(res.error){
        return {
            error: res.error.message,
            businessId: null
        }
    }

    if(res.data) redirect('/')

    console.log('LOG IN',res)

    return {error: null,businessId: null}
}

export async function signOut(){
    const client = await createClient()

    await client.auth.signOut()
    redirect('/')
}

interface Preset {
    names: string[]
    jobs: string[],
    date_range: DateRange,
    job_percentages: Record<string,Record<string,number>>,
    title: string
}
export async function savePreset(preset: Preset){
    const client = await createClient()

    const res = await client.from('presets').insert({
        names: preset.names,
        jobs: preset.jobs,
        date_range: preset.date_range,
        job_percentages: preset.job_percentages,
        title: preset.title
    })

    if(res.error){
        console.error(res.error)
    }

}

export async function deletePreset(id: string){
    const client = await createClient()

    await client.from('presets').delete().eq('id',id)

    revalidatePath('/dashboard/scheduler')
}

export async function sendEmail(prev: CreateEmailResponse,data: FormData){

    const client = await createClient()
    const user = await client.auth.getUser()

    const id = user.data.user?.id
    
    let myProfile: any;

    const profiles = await client.from('profiles').select().eq('id',id)
    if(profiles.data){
        myProfile = profiles.data![0]
    }

    const {first_name,last_name} = myProfile

    const email = data.get('email') as string
    const prefix = `${(first_name as string).substring(0,1)}${(last_name as string)}`

    const res = await resend.emails.send({
        from: `${prefix.toLowerCase()}@rosterprofessional.com`,
        to: [email],
        subject: 'Invite Recieved',
        react: EmailInvite({name: myProfile.first_name+' '+myProfile.last_name,businessName: data.get('bizName') as string,id: data.get('bizId') as string})
    })

    if(res.error) {
        console.error(res.error.message)
    
    } else {
        console.info(res.data)
    }

    return res

}

// TODO finish send-message action
export async function sendMessage(msg: FormData){

    const supabase = await createClient()

    const message = {
        author_id: msg.get('author-id') as string,
        business_id: msg.get('business-id') as string,
        content: msg.get('message-content') as string,
    }


    const msgSchema = z.object({
        author_id: z.string().uuid(),
        business_id: z.string().uuid(),
        content: z.string()
    })

    const parse = msgSchema.safeParse(message)

    if(parse.success){
        await supabase.from('messages').insert(parse.data)
    } else {
        console.error(parse.error.message)
    }

}

export async function requestTimeOff(prevState: any,formData: FormData){

    const supabase = await createClient()

    const request = {
        from: new Date(Number(formData.get('from'))),
        to: new Date(Number(formData.get('to'))),
        reason: formData.get('reason'),
        business_id: formData.get('business_id')
    }

    const timeOffRequest = z.object({
        from: z.date(),
        to: z.date(),
        reason: z.string(),
        business_id: z.string()
    })

    const check = timeOffRequest.safeParse(request)

    if(check.success){
        const res = await supabase.from('time_off_request').insert(request)

        return {
            message: `${format(request.from,'MMMM dd, yyyy')} to ${format(request.to,'MMMM dd, yyyy')}`
        }
    } else {
        console.error('INVALID TIME OFF REQUEST')
    }

    return {
        message: ''
    }
}

export interface ShiftWeek {
    sunday: {from: string, to: string},
    monday: {from: string, to: string},
    tuesday: {from: string, to: string},
    wednesday: {from: string, to: string},
    thursday: {from: string, to: string},
    friday: {from: string, to: string},
    saturday: {from: string, to: string}
}

interface ShiftSchedule {
    [name: string]: ({leave: false, from: string, to: string} | {leave: true, from: null, to: null})[]
}

type ShiftScheduleReturnType = {schedule: ShiftSchedule, generated: true} | {schedule: null, generated: false}

export async function generateShifts(prev: any,formData: FormData): Promise<ShiftScheduleReturnType>{
    const supabase = await createClient()

    const businessId = formData.get('businessId') as string
    const enteredNames = (formData.get('names') as string).trim().split(',')
    const startingDay = new Date(formData.get('startDate') as string)




    // Factor in the availability of each person
    const availabilities = await supabase.from('availability')
        .select()
        .eq('business_id',businessId).order('user_id') // get the corresponding availabilities in order of their user_ids (user's id)

    console.log(availabilities)
    if(availabilities.count == 0){
        return {generated: false, schedule: null}
    }
    const names = await supabase.from('profiles').select('first_name,last_name')
    .in('id',availabilities.data?.map(o => o.user_id) as any[]).order('id') // get the corresponding names in order of their ids (user's id)

    if(!names.data) return {generated: false, schedule: null}
    const namesInOrder = names.data?.filter(n => enteredNames.some(n2 => `${n.first_name} ${n.last_name}` == n2)) // filter to only names that were selected

    console.log(namesInOrder)

    // Factor in approved Time-off requests of each person
    const timeOffData = await supabase.from('time_off_request').select()
        .eq('business_id',businessId).eq('approved','APPROVED')

    const timeOffRequests = timeOffData.data

    // const names = (formData.get('names') as string).split(',')

    const prompt = await createShiftPrompt(startingDay,namesInOrder.map(n => `${n.first_name} ${n.last_name}`),availabilities.data as any[],timeOffRequests!)
    console.log('PROMPT: ',prompt)

    const shiftSystemRole = "You are the intelligent robot manager of a organization,  you are in charge of designing schedules for your organization to schedule for your workers to know when and how long they work. Assume times are in 24hr military time. You ONLY schedule people for days/times they are available. Verify you did it correctly based on my specifications before sending it to me. You always output JSON and ONLY JSON output. No extraneous text!"
    const res = await openai.chat.completions.create({
        model: 'gpt-4-turbo',
        response_format: {type: 'json_object'},
        messages: [
            {role: 'system', content: shiftSystemRole},
            {role: 'user', content: prompt}
        ]
    })

    const timeSheet = JSON.parse(res.choices[0].message.content as string)

    console.log(timeSheet)

    return {
        schedule: timeSheet as ShiftSchedule,
        generated: true
    }
}
export async function getThisSunday(){
    const today = new Date()

    let sunday = today

    while(sunday.getDay() != 0){
        console.log(sunday.getDay())
        sunday = addDays(sunday,-1)
    }

    return sunday;
}

// AIzaSyDVPUyMRirjbHJxoPhHmYvkDWIk8SnxNfU

export async function addTemp(n: NameEntry,businessId: string){

    const supabase = await createClient()

    const {availability} = n

    const res = await supabase.from('temp_availability').insert({
        name: n.name,
        business_id: businessId,
        ...availability
    })


    console.log(res)
}