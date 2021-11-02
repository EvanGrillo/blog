const fs = require('fs');
const path = require('path');
const mimeTypes = require('./mimeTypes');
const sendError = require('./sendError.js');

module.exports = readFile = (res, url) => {

    const extname = path.extname(url);
    const contentType = mimeTypes[extname] || 'application/octet-stream';

    try {

        let content = fs.readFileSync(url);
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(content, 'utf8');

    } catch (err) {
        sendError(res, err);
    }

}