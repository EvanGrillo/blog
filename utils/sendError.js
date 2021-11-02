sendError = (res, err) => {

    console.log("\x1b[31m", err, '>> sendError');

    if (err.code == 'ENOENT' || 'EISDIR') {
        return res.end('<h1>403 Forbidden</h1>', 'utf-8');
    }
    return res.end('<h1>500</h1>', 'utf-8');

}

module.exports = sendError;