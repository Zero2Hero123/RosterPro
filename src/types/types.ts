type Jobs = Record<string,number>

export type PercentagesMap = Record<string,Jobs>

export type Action = {
    prop: string,
    propType: 'name' | 'job',
    type: 'add' | 'remove'
    names: string[],
    jobs: string[]
}

export type SetAction = Omit<Action,'names' | 'jobs' | 'type'> & {
    percentValue: number,
    forName: string
    type: 'set-job'
}