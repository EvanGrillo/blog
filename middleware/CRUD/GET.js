const auth = require('../auth.js');
const renderer = require('../renderer.js');
const readFile = require('../../utils/readFile.js');

module.exports = get = (req, res) => {

    let { url } = req;

    if ((/public/).test(url)) url = '.' + url;

    if (url === '/'|| url === '/blog') {
        return renderer.homeView(req, res);
    }

    if ((/blog/.test(url)) && !(/style/).test(url)) {
        return renderer.displayAsset(res, `./public${url}`);
    }

    if ((/admin/).test(url)) {
        return auth.checkForToken(req, res);
    }

    readFile(res, url);
}