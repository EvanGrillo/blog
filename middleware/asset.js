const parseStream = require('../utils/parseStream.js');
const db = require('./db.js');

const asset = {
    createAsset: async (req, res) => {

        let body = await parseStream(req);
        if (!body) return res.end();
        
        body = JSON.parse(body);

        await db.insertOne('assets', {
            _id: db.uuid(),
            type: 'page',
            created: {
                date: Date.now(),
                by: 1
            },
            modified: {
                date: Date.now(),
                by: 1
            },
            html: body.html || '',
            css: body.css || '',
            js: body.js || '',
            version: 1,
            public: true
        });

        res.end();

    }
}

module.exports = asset;