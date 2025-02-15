import { ColumnType, Generated, Selectable } from 'kysely'

export interface Database {
    user: UserTable
    workout: WorkoutTable
}

export interface UserTable {
    id: Generated<number>
    username: string
    password: string
    email: string
    first_name: string
    last_name: string
}

export interface WorkoutTable {
    id: Generated<number>
    user_id: number
    csv: string
    seqno: Generated<number>
    workout_date: ColumnType<Date>
    created: ColumnType<Date, string | undefined, never>
}

export type User = Selectable<UserTable>
export type Workout = Selectable<WorkoutTable>