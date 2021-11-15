const fs = require('fs');

sendError = (res, err) => {

    console.log("\x1b[31m", err, '>> sendError');

    let resCode = err.code || 500;
    let resMsg = err.message || 'Error';

    if (resCode == 'ENOENT') resCode = 404;
    res.statusCode = resCode;

    let index = fs.readFileSync('./public/index.html', 'utf8');
    index = index
    .replace('[inner_body]', `<h1>${resCode} ${resMsg}</h1>`)
    .replace("<script src='/public/scripts/index.js'></script>", '');
    res.end(index);

}

module.exports = sendError;