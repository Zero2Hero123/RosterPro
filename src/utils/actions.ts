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

const openai = new OpenAI({
    apiKey: process.env.API_KEY!
})

export default async function generate(args: GenerateProps): Promise<GenerateResponse> {

    const prompt = createPrompt(args)
    console.log('PROMPT: ',prompt)

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
    const client = createClient()

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
    const client = createClient()

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
    const client = createClient()

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
    const client = createClient()

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
    const client = createClient()

    await client.from('presets').delete().eq('id',id)

    revalidatePath('/dashboard/scheduler')
}

export async function sendEmail(data: FormData){

    const client = createClient()
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