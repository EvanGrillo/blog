const fs = require('fs');
const argon2 = require('argon2');
const mailer = require('./email.js');
const db = require('./db.js');
const parseStream = require('./utils/parseStream.js');
const sendError = require('./utils/sendError.js');
const jwt = require("jsonwebtoken");
require('dotenv').config();
const SECRET = process.env.SECRET;

const auth = {
    renderLoginView: (res) => {

        try {

            let adminLoginScript = fs.readFileSync('./public/scripts/adminLogin.js', 'utf8');
            let modalTemplate = fs.readFileSync('./public/templates/modal/modal.html', 'utf8');
            let loginSnippet = fs.readFileSync('./public/templates/modal/snippets/login.html', 'utf8');
            
            let adminLoginTemplate = modalTemplate
            .replace('[snippet]', loginSnippet);
            
            adminLoginTemplate.toString('utf8');
    
            res.end(`<script>${adminLoginScript}</script>` + adminLoginTemplate);
            
        } catch (err) {
            sendError(res, err);
        }

    },
    validateGEO: async (req, res) => {

        try {

            let body = await parseStream(req);
            if (!body) return res.end();

            console.log('geo:', body);

            let payload = JSON.parse(body);

            // mailer.sendGEO(body);

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
            console.log('geo:', body);

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

        if (!token) return auth.renderLoginView(res);
        
        try {

            let decoded = await new Promise((resolve, reject) => {
                jwt.verify(token, SECRET, function(err, decoded) {
                    if (err) reject(err);
                    resolve(decoded);
                });
            });

            if (!decoded) throw new Error('not valid');

            let editorHTML = fs.readFileSync('./public/templates/editor.html', 'utf8');

            res.end(editorHTML);
            
        } catch (err) {
            return auth.renderLoginView(res);
        }
    },
    setToken: async (res, dataObj) => {

        try {

            let token = await new Promise((resolve, reject) => {
                jwt.sign({
                    dataObj,
                    exp: Math.floor(Date.now() / 1000) + (60 * 60)
                }, SECRET, (err, token) => {
                    if (err) reject(err);
                    resolve(token);
                });
            });
            
            res.setHeader('Set-Cookie',`access-token=${token}; Max-Age=3600; Path=/admin; HttpOnly; Secure`);

            return token;

        } catch (err) {
            throw err;
        }
    }
}

module.exports = auth;