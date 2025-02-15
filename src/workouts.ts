import { db } from './db'
import { RecordIterator, RecordBatchIterator } from './iterators'

export const find_workouts = (user_id: number, limit?: number, offset?: number) => {
    let query = db.selectFrom('workout');
    query = query.where('user_id', '=', user_id);

    query = limit ? query.limit(limit) : query.limit(50);
    query = offset ? query.offset(offset) : query.offset(0);

    return query.selectAll().execute()
}

export const find_records = (
    user_id: number,
    opts?: {
        limit?: number,
        offset?: number,
    }
) => new RecordIterator({
        user_id,
        limit: opts?.limit || 50,
        offset: opts?.offset || 0
    },
    find_internal
)

export const find_batches = (
    user_id: number,
    opts?: {
        limit?: number,
        offset?: number,
    }
) => new RecordBatchIterator({
        user_id,
        limit: opts?.limit || 50,
        offset: opts?.offset || 0
    },
    find_internal
)


type Params = {
    user_id: number
    limit: number
    offset: number
}

const find_internal = (params: Params) =>
    db.selectFrom('workout')
        .where('user_id', '=', params.user_id)
        .limit(params.limit)
        .offset(params.offset)
        .selectAll()
        .execute()
