'use server'

import OpenAI from 'openai'
import { DateRange } from 'react-day-picker'

interface GenerateProps {
    names: string[],
    jobs: string[],
    dateRange: DateRange,
    days: string[],
    jobPercentages: Record<string,Record<string,number>>
}

const systemRole = "You are the manager of a business. You are in charge of designing schedules mapping each person's name to a job/task they are assigned on a given day."

function createPrompt(args: GenerateProps){

}

const openai = new OpenAI({
    apiKey: process.env.API_KEY!
})

export default async function generate(args: GenerateProps){



    const res = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
            {role: 'system', content: systemRole},
            {role: 'user', content: 'hello'}
        ]
    })

    console.log(res.choices[0].message)
}