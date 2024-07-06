'use server'

import { format } from 'date-fns'
import OpenAI from 'openai'
import { DateRange } from 'react-day-picker'

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
        return `Generate a schedule. Randomly map the following names, ${args.names.join(', ')} to the following jobs, ${args.jobs.join(', ')} for each day. The schedule should be for days, ${args.days.join(', ')} between ${format(args.dateRange.from as Date,'LLL dd yyyy')} to ${format(args.dateRange.to as Date,'LLL dd yyyy')}. You are also given the following json object that maps each person's name to to an object mapping each job to the chance they have to getting assigned to that job in the whole schedule, ${JSON.stringify(args.jobPercentages)}, generate accordingly. Remember, Jobs can only be assigned once! They cannot be repeated for multiple persons! Finally, return the schedule as a list of objects that have the following schema,${JSON.stringify(schema)} in plain raw json. NO EXTRANEOUS TEXT. Let each object will represent a day.`
    }

    return `Generate a schedule. Randomly map the following names, ${args.names.join(', ')} to the following jobs, ${args.jobs.join(', ')} for each day. The schedule should be for days, ${args.days.join(', ')} between ${format(args.dateRange.from as Date,'LLL dd yyyy')} to ${format(args.dateRange.to as Date,'LLL dd yyyy')}. Return the schedule as a list of objects that have the following schema,${JSON.stringify(schema)} in plain raw json. No extraneous text. Let each object will represent a day.`
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