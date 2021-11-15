const fs = require('fs');
const argon2 = require('argon2');
const mailer = require('./email.js');
const db = require('./db.js');
const parseStream = require('../utils/parseStream.js');
const sendError = require('../utils/sendError.js');
const jwt = require("jsonwebtoken");
require('dotenv').config();
const SECRET = process.env.SECRET;
const renderer = require('./renderer');

const auth = {
    validateGEO: async (req, res) => {

        try {

            let body = await parseStream(req);
            if (!body) return res.end();

            console.log('geo:', body);

            let payload = JSON.parse(body);

            mailer.send(req, res, {
                body: body,
                subject: 'GEO-auth Visitor',
            });

            let token = await auth.setToken(res, {
                lat: payload.latitude,
                lon: payload.longitude
            });

            return res.end(token);

        } catch (err) {
            sendError(res, err);
        }

    },
    passwordMatch: async (req, res) => {

        try {

            let body = await parseStream(req);
            if (!body) return res.end('<h1>403 Forbidden</h1>');

            body = JSON.parse(body);
            let user = await db.findOne('users', {'email': body.email});
            if (!user) {
                res.statusCode = 404;
                res.statusMessage = `User ${body.email} Not Found`;
                return res.end();
            }

            let passwordMatch = await argon2.verify(user.password, body.password);
            if (!passwordMatch)  {
                res.statusCode = 403;
                res.statusMessage = 'Incorrect Password'
                return res.end();
            }

            let token = await auth.setToken(res, {user: user.email});

            return res.end(token);

        } catch (err) {
            sendError(res, err);
        }

    },
    checkForToken: async (req, res) => {

        let token;

        if (req.headers.cookie && (/access-token/).test(req.headers.cookie)) {
            token = req.headers.cookie.split('=')[1];
        }

        if (!token) return renderer.loginView(res);
        
        try {

            let decoded = await new Promise((resolve, reject) => {
                jwt.verify(token, SECRET, function(err, decoded) {
                    if (err) reject(err);
                    resolve(decoded);
                });
            });

            if (!decoded) throw new Error('not valid');

            return auth.routeAdminPath(req, res);
            
        } catch (err) {
            return renderer.loginView(res);
        }
    },
    setToken: async (res, dataObj) => {

        try {

            let token = await new Promise((resolve, reject) => {
                jwt.sign({
                    dataObj,
                    expiresIn: '2h'
                }, SECRET, (err, token) => {
                    if (err) reject(err);
                    resolve(token);
                });
            });
            
            res.setHeader('Set-Cookie',`access-token=${token}; Max-Age=7200; Path=/admin; HttpOnly; Secure`);

            return token;

        } catch (err) {
            throw err;
        }
    },
    routeAdminPath: async (req, res) => {
        
        const { url } = req;

        if ((/getCode/).test(url)) {

            const pageId = url.split('/')[3];
            
            let page = await db.findOne('assets', {
                _id: pageId,
                type: 'page'
            });

            if (!page) return sendError(res, {
                code: 404,
                message: 'Not Found'
            });

            return res.end(JSON.stringify(page));

        }

        renderer.editorView(res);

    }
}

module.exports = auth;