parseStream = async (req) => {
    return await new Promise((resolve, reject) => {
        let body = '';
        req.on('data', (chunk) => {
            body += chunk.toString('utf8');
        });
        req.on('end', () => {
            resolve(body);
        });
        req.on('err', (err) => {
            reject(err);
        });
    });
}

module.exports = parseStream;