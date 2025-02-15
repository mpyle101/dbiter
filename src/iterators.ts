type Offsetable = {
    offset: number
}

export class RecordIterator<T, P extends Offsetable> implements AsyncIterableIterator<T> {
    private idx: number;
    private done: boolean;
    private recs: T[];

    constructor(private params: P, private fn: (p: P) => Promise<T[]>) {
        this.idx  = 0;
        this.done = false;
        this.recs = [];
    }

    [Symbol.asyncIterator](): RecordIterator<T, P> {
        return this
    }

    async next(): Promise<IteratorResult<T, undefined>> {
        if (this.done) {
            return Promise.resolve({ done: this.done, value: undefined })
        }
        if (this.idx === this.recs.length) {
            this.idx  = 0;
            this.recs = await this.fn(this.params);
            this.params.offset += this.recs.length;
        }
        if (this.recs.length === 0) {
            this.done = true;
            return Promise.resolve({ done: true, value: undefined })
        }

        const rec = this.recs[this.idx];
        this.idx += 1;
        return Promise.resolve({ done: false, value: rec })
    }
}

export class RecordBatchIterator<T, P extends Offsetable> implements AsyncIterableIterator<T[]> {
    private idx: number;
    private done: boolean;

    constructor(private params: P, private fn: (p: P) => Promise<T[]>) {
        this.idx  = 0;
        this.done = false;
    }

    [Symbol.asyncIterator](): RecordBatchIterator<T, P> {
        return this
    }

    async next(): Promise<IteratorResult<T[], undefined>> {
        if (this.done) {
            return Promise.resolve({ done: this.done, value: undefined })
        }

        const recs = await this.fn(this.params);
        if (recs.length === 0) {
            this.done = true;
            return Promise.resolve({ done: true, value: undefined })
        }

        this.params.offset += recs.length;
        return Promise.resolve({ done: false, value: recs })
    }
}