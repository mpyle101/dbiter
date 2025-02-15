import { find_user } from './users'
import { find_workouts, find_records, find_batches } from './workouts'


const main = async () => {
    const user = await find_user('Pyle');
    for await (const rec of find_records(user.id, { limit: 10 })) {
        console.log(rec);
    }

    console.log('\n\n');
    const iter = find_batches(user.id, { limit: 10 });
    let { value, done } = await iter.next();
    for (const rec of value!) {
        console.log(rec);
    }

    console.log('\n\n');
    ({ value, done } = await iter.next());
    for (const rec of value!) {
        console.log(rec);
    }

    return 'done'
}

main().then(console.log)