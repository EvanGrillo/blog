const http = require('http');
const server = http.createServer(() => {});
const port = process.env.PORT || 3000;
const db = require('./middleware/db.js');
const GET = require('./middleware/CRUD/GET.js');
const POST = require('./middleware/CRUD/POST.js');

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

    const { method } = req;

    if (method === 'GET') return GET(req, res);

    if (method === 'POST') return POST(req, res);

});

console.log(`Server listening at port:${port}/`);