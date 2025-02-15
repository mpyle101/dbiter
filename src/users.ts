import { db } from './db'

export const find_user = (last_name: string) => {
    let query = db.selectFrom('user')
    query = query.where('last_name', '=', last_name)

    return query.selectAll().executeTakeFirstOrThrow()
}