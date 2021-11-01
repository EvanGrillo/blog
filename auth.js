const fs = require('fs');
const argon2 = require('argon2');
const mailer = require('./email.js');
const db = require('./db.js');

const auth = {
    getGEOLocation: (res) => {
        let getGeoTemplate = fs.readFileSync('./public/templates/auth/getGPSLocation.html', 'utf8');
        getGeoTemplate.toString('utf8');
        res.end(getGeoTemplate);
    },
    validateGEO: (req, res) => {

        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString('utf8');
        });

        req.on('end', () => {

            if (!body) return res.end('<h1>403 Forbidden</h1>');

            //- TODO validate coords

            try {
                console.log('geo:', body);
                mailer.sendGEO(body);
                let editorHTML = fs.readFileSync('./public/templates/editor.html', 'utf8');
                editorHTML = editorHTML.toString('utf8');
                res.end(editorHTML);
            } catch (err) {
                res.end('<h1>500 Internal Server Error</h1>')
            }

        });

    },
    passwordMatch: (req, res) => {

        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString('utf8');
        });

        req.on('end', async () => {

            body = JSON.parse(body);
            let user = await db.getUser_ByEmail(body.email);
            if (!user) return res.end('<h1>User does not exist</h1>');

            let passwordMatch = await argon2.verify(user.password, body.password);
            if (!passwordMatch)  {
                res.statusCode = 403;
                res.statusMessage = 'Incorrect Password'
                return res.end();
            }

            let editorHTML = fs.readFileSync('./public/templates/editor.html', 'utf8');
            editorHTML = editorHTML.toString('utf8');
            res.end(editorHTML);
        
            //- TODO handle session
        });

    },
    
}

module.exports = auth;