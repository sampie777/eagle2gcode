export type CheckItem = {
    text: string,
    checked: boolean
}

export type CheckGroup = {
    title: string,
    items: CheckItem[]
}

export type Checklist = CheckGroup[]