const http = require('http');
const server = http.createServer(() => {});
const port = process.env.PORT || 3000;
const db = require('./middleware/db.js');
const mailer = require('./middleware/email.js');
const auth = require('./middleware/auth.js');
const renderer = require('./middleware/renderer.js');
const readFile = require('./utils/readFile.js');

connectToDB = async () => {
    try {
        await db.connect();
    } catch (err) {
        throw err;
    }
}
connectToDB().then(() => {
    server.listen(port);
}).catch((err) => {
    console.log("\x1b[31m", err.message);
    server.close();
});

server.on('request', (req, res) => {

    let { method, url } = req;

    if ((/public/).test(url)) url = '.' + url;

    if (url === '/'|| url === '/blog') {
        return renderer.homeView(req, res);
    }

    if ((/blog/.test(url)) && !(/style/).test(url)) {
        return renderer.displayAsset(res, `./public${url}`);
    }

    if ((/admin/).test(url) && method === 'GET') {
        return auth.checkForToken(req, res);
    }

    if ((/authGEO/).test(url) && method === 'POST') {
        return auth.validateGEO(req, res);
    }

    if ((/login/).test(url) && method === 'POST') {
        return auth.passwordMatch(req, res);
    }

    if ((/send/).test(url) && method === 'POST') {
        return mailer.sendMessage(req, res);
    }

    readFile(res, url);

});

console.log(`Server listening at port:${port}/`);