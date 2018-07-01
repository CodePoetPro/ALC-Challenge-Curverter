let req, db, tx, index;

const dbPromise = idb.open('currverter', 1, upgradeDB => {
    upgradeDB.createObjectStore('currencies');
    upgradeDB.createObjectStore('rates');
});


const idbKey = {
    getAll(store) {
        return dbPromise.then(db => {
            return db.transaction(store)
                .objectStore(store).getAll();
        });
    },
    get(store, key) {
        return dbPromise.then(db => {
            return db.transaction(store)
                .objectStore(store).get(key);
        });
    },
    set(store, key, val) {
        return dbPromise.then(db => {
            const tx = db.transaction(store, 'readwrite');
            tx.objectStore(store).put(val, key);
            return tx.complete;
        });
    },
    delete(store, key) {
        return dbPromise.then(db => {
            const tx = db.transaction(store, 'readwrite');
            tx.objectStore(store).delete(key);
            return tx.complete;
        });
    },
    clear(store) {
        return dbPromise.then(db => {
            const tx = db.transaction(store, 'readwrite');
            tx.objectStore(store).clear();
            return tx.complete;
        });
    },
    keys(store) {
        return dbPromise.then(db => {
            const tx = db.transaction(store);
            const keys = [];
            const store = tx.objectStore(store);

            // This would be store.getAllKeys(), but it isn't supported by Edge or Safari.
            // openKeyCursor isn't supported by Safari, so we fall back
            (store.iterateKeyCursor || store.iterateCursor).call(store, cursor => {
                if (!cursor) return;
                keys.push(cursor.key);
                cursor.continue();
            });

            return tx.complete.then(() => keys);
        });
    }
};

export const setCurrencies = (index, obj) => {
    idbKey.set('currencies', index, obj);
}

export const getCurrencies = () => {
    return idbKey.getAll('currencies');
}

export const setRate = (key, val) => {
    return idbKey.set('rates', key, val);
}

export const getRate = (key) => {
    return idbKey.get('rate', key);
}