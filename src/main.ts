import { find_user } from './users'
import { find_workouts, find } from './workouts'


const main = async () => {
    const user = await find_user('Pyle');

    // Iterator through all the records letting the iterator deal
    // with getting the next batch of records.
    for await (const rec of find(user.id, { limit: 10 })) {
        console.log(rec);
    }

    console.log('\n\n');

    // Get records in batches so you can walk through them in chunks
    // letting the iterator keep track of the offset.
    const iter = find(user.id, { limit: 10, batched: true });
    let { value, done } = await iter.next();
    for (const rec of value!) {
        console.log(rec);
    }

    console.log('\n\n');
    ({ value, done } = await iter.next());
    for (const rec of value!) {
        console.log(rec);
    }
}

main().then(console.log)