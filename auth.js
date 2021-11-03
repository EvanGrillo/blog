const fs = require('fs');
const argon2 = require('argon2');
const mailer = require('./email.js');
const db = require('./db.js');
const parseStream = require('./utils/parseStream.js');
const sendError = require('./utils/sendError.js');
const jwt = require("jsonwebtoken");

const auth = {
    renderLoginView: (res) => {
        let adminLoginScript = fs.readFileSync('./public/scripts/adminLogin.js', 'utf8');
        let modalTemplate = fs.readFileSync('./public/templates/modal/modal.html', 'utf8');
        let loginSnippet = fs.readFileSync('./public/templates/modal/snippets/login.html', 'utf8');
        
        let adminLoginTemplate = modalTemplate
        .replace('[snippet]', loginSnippet);
        
        adminLoginTemplate.toString('utf8');

        res.end(`<script>${adminLoginScript}</script>` + adminLoginTemplate);
    },
    validateGEO: async (req, res) => {

        try {

            let body = await parseStream(req);
            if (!body) return res.end();

            console.log('geo:', body);

            // mailer.sendGEO(body);

            // let editorHTML = fs.readFileSync('./public/templates/editor.html');
            // editorHTML = editorHTML.toString('utf8');

            // res.end(editorHTML);

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

            let token = await new Promise((resolve, reject) => {
                jwt.sign({ 
                    data: 'bar',
                    exp: Math.floor(Date.now() / 1000) + (60 * 60)
                }, 'shhhhh', (err, token) => {
                    if (err) reject(err);
                    resolve(token);
                });
            });
            
            return res.end(token);

        } catch (err) {
            console.log(err);
            sendError(res, err);
        }

    },
    checkForToken: async (req, res) => {

        let token = req.headers["x-access-token"];

        if (!token) {
            return auth.renderLoginView(res);
        }
        
        try {

            let decoded = await new Promise((resolve, reject) => {
                jwt.verify(token, secret, function(err, decoded) {
                    if (err) reject(err);
                    resolve(decoded);
                });
            });

            if (!decoded) throw new Error('not valid');

            let editorHTML = fs.readFileSync('./public/templates/editor.html', 'utf8').toString('utf8');
            let editorJS = fs.readFileSync('./public/scripts/editor.js').toString();
            editorHTML = editorHTML.replace('[editor_script]', editorJS);

            res.end(editorHTML);
            
        } catch (err) {
            return res.status(401).send("Invalid Token");
        }
    }
}

module.exports = auth;