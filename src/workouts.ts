import { db } from './db'
import { RecordIterator, RecordBatchIterator } from './iterators'

type Workout = {
    id: number;
    user_id: number;
    csv: string;
    seqno: number;
    workout_date: Date;
    created: Date;
}

type Options = {
    limit?: number;
    offset?: number;
    batched?: boolean;
}

type Params = {
    user_id: number
    limit: number
    offset: number
}

export function find(user_id: number, opts?: Options & { batched: true }): RecordBatchIterator<Workout, Params>;
export function find(user_id: number, opts?: Options): RecordIterator<Workout, Params>;
export function find(user_id: number, opts?: Options)
{
    const { batched = false } = opts ?? {};
    if (batched) {
        return new RecordBatchIterator({
                user_id,
                limit: opts?.limit || 50,
                offset: opts?.offset || 0
            },
            find_internal
        )
    } else {
        return new RecordIterator({
                user_id,
                limit: opts?.limit || 50,
                offset: opts?.offset || 0
            },
            find_internal
        )
    }
}

const find_internal = (params: Params) =>
    db.selectFrom('workout')
        .where('user_id', '=', params.user_id)
        .limit(params.limit)
        .offset(params.offset)
        .selectAll()
        .execute()

export const find_workouts = (user_id: number, limit?: number, offset?: number) => {
    let query = db.selectFrom('workout');
    query = query.where('user_id', '=', user_id);

    query = limit ? query.limit(limit) : query.limit(50);
    query = offset ? query.offset(offset) : query.offset(0);

    return query.selectAll().execute()
}
        