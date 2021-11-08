const parseStream = require('../utils/parseStream.js');
const db = require('./db.js');

modules.export = {
    createAsset: (req, res) => {

        let body = await parseStream(req);
        if (!body) return res.end();
        
        body = JSON.parse(body);

        let asset = await db.insertOne('assets', body);

        /* 
            _id: null,
            type: 'page',
            created: {
                date: Date.now(),
                by: User._id
            },
            modified: {
                date: Date.now(),
                by: User._id
            },
            html: '',
            css: '',
            js: '',
            version: 1,
            public: true
        */
    }
}