function createScrollWaiter() {
    let resolve = undefined;
    let promise = undefined;

    function add() {
        promise = new Promise(r => {
            resolve = r
        })
    }

    function flush() {
        resolve && resolve()
        resolve = undefined
        promise = undefined
    }

    const waiter =  {
        promise,
        add,
        flush
    };

    Object.defineProperty(waiter, 'promise', {
        get: () => promise,
    });

    return waiter;
}

export const scrollWaiter = createScrollWaiter();
