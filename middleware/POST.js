const mailer = require('./email.js');
const auth = require('./auth.js');
const asset = require('./asset.js');

module.exports = post = (req, res) => {

    const { url } = req;

    if ((/authGEO/).test(url)) {
        return auth.validateGEO(req, res);
    }

    if ((/login/).test(url)) {
        return auth.passwordMatch(req, res);
    }

    if ((/send/).test(url)) {
        return mailer.sendMessage(req, res);
    }

    if ((/create/).test(url)) {
        return asset.createAsset(req, res);
    }
    
}