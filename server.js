const http = require('http');
const fs = require('fs');
const path = require('path');
const server = http.createServer(() => {});
const port = process.env.PORT || 3000;
const mimeTypes = require('./mimeTypes');
const db = require('./db.js');
const mailer = require('./email.js');

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
        url = './public/index.html';
        return renderBlogs(res, url);
    }

    if ((/blog/.test(url)) && !(/style/).test(url)) {
        return renderBlog(res, `./public${url}`);
    }

    if (method === 'POST' && (/send/).test(url)) return mailer.sendMessage(req, res);

    readFile(res, url);

});

readFile = (res, url) => {

    const extname = path.extname(url);
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    try {

        let content = fs.readFileSync(url);
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf8');

    } catch (err) {
        sendError(err);
    }

}

renderBlogs = async (res, url) => {

    console.log("\x1b[32m", url, '>> RenderBlogs');

    try {

        let blogs = await db.getBlogs();

        let blogPreviews = '';
        let blogPreviewTemplate = fs.readFileSync('./public/templates/blogPreview.html', 'utf8');

        for (blog of blogs) {

            let entry = blogPreviewTemplate
            .replace('[title]', blog.title)
            .replaceAll('[titleLink]', blog.handle)
            .replace('[createdDate]', blog.createdDate);

            blogPreviews = blogPreviews.concat(entry);
        }

        let content = 
        fs.readFileSync(url, 'utf8')
        .replace('[blogs]', blogPreviews);

        return res.end(content, 'utf8');

    } catch (err) {
        console.log("\x1b[31m", err);
        sendError(res, err);
    }

}

renderBlog = async (res, url) => {

    let handle = url.split('/')[3];

    console.log("\x1b[32m", url, handle, '>> RenderBlog');

    try {

        let blog = await db.getBlog_ByHandle(handle);

        let blogDisplayTemplate = fs.readFileSync('./public/templates/blogDisplay.html', 'utf8');

        let blogDisplay = blogDisplayTemplate
        .replace('[title]', blog.title)
        .replace('[text]', blog.text)
        .replace('[createdDate]', blog.createdDate);

        let content =
        fs.readFileSync('./public/index.html', 'utf8')
        .replace('[blogs]', blogDisplay);

        return res.end(content, 'utf8');

    } catch (err) {
        console.log("\x1b[31m", err);
        sendError(res, err);
    }

}

sendError = (res, err) => {

    console.log("\x1b[31m", err, '>> sendError');

    if (err.code == 'ENOENT' || 'EISDIR') {
        return res.end('<h1>403 Forbidden</h1>', 'utf-8');
    }
    return res.end('<h1>500</h1>', 'utf-8');

}

console.log(`Server listening at port:${port}/`);