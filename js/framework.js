
(function () {
    console.log("Loading Database...");
    const db = {};

    db._loaded = false;
    db._postsIndex = null;
    db.load = () => {
        return new Promise((resolve, reject) => {
            $.get("/posts.index.json")
                .done(function (data) {
                    db._postsIndex = data;
                    db._loaded = true;
                    return resolve();
                })
                .fail(function () {
                    return reject();
                });
        });
    };

    db.getPostById = (postId) => {
        if (!db._postsIndex || !db._loaded) {
            throw new Error("The database is not properly loaded");
        }

        let results = db._postsIndex.filder(p => p.Id == postId);
        if (results.length > 1) {
            throw new Error("Error with ambiguous post Identifier");
        }
        return results.length == 1 ? results[0] : null;
    };

    const getRandomItems = (collection, count) => {
        const results = [];
        const max = collection.length - 1;
        const usedRandoms = []
        for (let i = 0; i < count; i++) {
            let random = 0;
            do {
                random = Math.floor((Math.random() * max));
            } while (usedRandoms.indexOf(random) > -1);
            usedRandoms.push(random);
            const randomItem = collection[random];
            results.push(randomItem);
        }

        return results;
    };

    db.getRandomPosts = (count) => {
        count = count || 1;
        if (!db._postsIndex || !db._loaded) {
            throw new Error("The database is not properly loaded");
        }

        return getRandomItems(db._postsIndex, count);
    };

    const execute = (callback) => {
        db.load().then(() => {
            callback(db);
        });
    };

    window.WCG = { db, execute };
})();