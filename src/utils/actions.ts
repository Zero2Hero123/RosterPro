'use server'

import { format } from 'date-fns'
import OpenAI from 'openai'
import { DateRange } from 'react-day-picker'
import {ZodError, z} from 'zod'
import { createClient } from './supabase/server'
import { redirect, RedirectType } from 'next/navigation'
import { revalidatePath } from 'next/cache'

import { Resend } from 'resend'
import EmailInvite from '@/components/dashboard-ui/EmailInvite'

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
        return `Generate a schedule. Randomly map the following names, ${args.names.join(', ')} to the following jobs, ${args.jobs.join(', ')} for each day. The schedule should be for ONLY these days in a week, ${args.days.join(', ')} between ${format(args.dateRange.from as Date,'LLL dd yyyy')} to ${format(args.dateRange.to as Date,'LLL dd yyyy')}. You are also given the following json object that maps each person's name to to an object mapping each job to the chance they have to getting assigned to that job in the whole schedule, ${JSON.stringify(args.jobPercentages)}, generate accordingly. Remember, Jobs can only be assigned once! They cannot be repeated for multiple persons! If no jobs left to assign to a person in a single day,assign one of the remaining jobs to the person, else, set that person's assigned job to a "-". Finally, return the schedule as a list of objects that have the following schema,${JSON.stringify(schema)} in plain raw json. If no jobs left to assign, set that person's assigned job to a "-". NO EXTRANEOUS TEXT. Let each object will represent a day.`
    }

    return `Generate a schedule. Randomly map the following names, ${args.names.join(', ')} to the following jobs, ${args.jobs.join(', ')} for each day. The schedule should be for ONLY these days in a week, ${args.days.join(', ')} between ${format(args.dateRange.from as Date,'LLL dd yyyy')} to ${format(args.dateRange.to as Date,'LLL dd yyyy')}. Remember, Jobs can only be assigned once! They cannot be repeated for multiple persons! The order in which you assign jobs should also be random. Finally, return the schedule as a list of objects that have the following schema,${JSON.stringify(schema)} in plain raw json. No Extraneous text. Let each object will represent a day.`
}

const days = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday']
function createShiftPrompt(names: string[],availabilities: any[]){

    const mappedAvails: Record<string,any> = names.map((n,i) => availabilities[i])

    const trueMap: Map<string,any> = new Map()

    for(let i = 0; i < names.length; i++){
        trueMap.set(names[i],mappedAvails[i])
    }

    let avails: string[] = [] // store each person's availability in a sentence

    for(let name of names){
        let str = `${name} is available on `

        for(let d of days.filter(d => trueMap.get(name)[d].enabled)){
            const currDay = trueMap.get(name)[d]

            str += `${d} from ${currDay.from} to ${currDay.to}, `
        }
        avails.push(str)
    }

    return `Generate a schedule with the following names, ${names.join(', ')}. Factor in the following availabilities of each person, ${avails.join('')}. Return the result in a JSON format, with which name mapped to a list of the shifts. Each index of the lists will represent sunday-saturday (0-7) and each index is an object of type {from: number, to: number}, where "from" is the time their shift starts and "to" is the time their shift ends. Every person's list always has a length of 7 because there are 7 days in a week. YOU ONLY OUTPUT JSON. No extraneous text!`
}

const openai = new OpenAI({
    apiKey: process.env.API_KEY!
})

export default async function generate(args: GenerateProps): Promise<GenerateResponse> {

    const prompt = createPrompt(args)

    const res = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            {role: 'system', content: systemRole},
            {role: 'user', content: prompt}
        ]
    })

    const schedule = JSON.parse(res.choices[0].message.content as string)

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

        await client.from('business').insert({
            name: (data.get('business_name') as string),
            owner_id: res.data.user?.id
        })

        if(res.data) {
            return {message: 'Success!'}
        }
            
        
    } catch(e){
        return {
            message: e
        }
    }

    return {message: ''}
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
            message: res.error.message
        }
    }

    if(res.data) redirect('/')

    console.log('LOG IN',res)

    return {message: ''}
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

export async function sendEmail(data: FormData){

    const client = await createClient()
    const user = await client.auth.getUser()

    const id = user.data.user?.id
    
    let myProfile: any;

    const profiles = await client.from('profiles').select().eq('id',id)
    if(profiles.data){
        myProfile = profiles.data![0]
    }

    const email = data.get('email') as string

    const res = await resend.emails.send({
        from: 'RosterPro <onboarding@resend.dev>',
        to: [email],
        subject: 'Invite Recieved',
        react: EmailInvite({name: myProfile.first_name+' '+myProfile.last_name,businessName: data.get('bizName') as string,id: data.get('bizId') as string})
    })

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
    [name: string]: {from: string, to: string}[]
}

type ShiftScheduleReturnType = {schedule: ShiftSchedule, generated: true} | {schedule: null, generated: false}

export async function generateShifts(prev: any,formData: FormData): Promise<ShiftScheduleReturnType>{
    const supabase = await createClient()

    const businessId = formData.get('businessId') as string
    const enteredNames = (formData.get('names') as string).trim().split(',')
    console.log(businessId)



    const availabilities = await supabase.from('availability')
        .select()
        .eq('business_id',businessId).order('user_id') // get the corresponding availabilities in order of their user_ids (user's id)
    
    if(availabilities.count == 0){
        return {generated: false, schedule: null}
    }

    const names = await supabase.from('profiles').select('first_name,last_name')
    .in('id',availabilities.data?.map(o => o.user_id) as any[]).order('id') // get the corresponding names in order of their ids (user's id)

    if(!names.data) return {generated: false, schedule: null}
    const namesInOrder = names.data?.filter(n => enteredNames.some(n2 => `${n.first_name} ${n.last_name}` == n2)) // filter to only names that were selected


    // console.log(namesInOrder)

    

    // const names = (formData.get('names') as string).split(',')

    const prompt = createShiftPrompt(namesInOrder.map(n => `${n.first_name} ${n.last_name}`),availabilities.data as any[])
    console.log('PROMPT: ',prompt)

    const shiftSystemRole = "You are the intelligent robot manager of a organization,  you are in charge of designing schedules for your organization to schedule for your workers to know when and how long they work. Assume times are in military time. You always output JSON and ONLY JSON output. No extraneous text."

    const res = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
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