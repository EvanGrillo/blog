require('dotenv').config();
const fs = require('fs');
const parseStream = require('../utils/parseStream.js');
const sendError = require('../utils/sendError.js');
const nodemailer = require('nodemailer');
const {
    GMAIL_ACCOUNT,
    GMAIL_PASSWORD,
    RECIEVER
} = process.env;
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: GMAIL_ACCOUNT,
        pass: GMAIL_PASSWORD
    }
});

module.exports = {
    sendMessage: async (req, res) => {
        
        let body = await parseStream(req);
        if (!body) return res.end(`<h1>No message to send!</div>`);

        transporter.sendMail({
            from: 'noreply@evangrillo.com',
            to: RECIEVER,
            subject: 'Message from your blog',
            text: body
        }, (err, info) => {

            if (err) return sendError(res, err);

            console.log("\x1b[32m", 'Email sent: ' + info.response);
        
            let writeMessageSnippet = fs.readFileSync('./public/templates/modal/snippets/writeMessage.html', 'utf8');
            res.end(writeMessageSnippet);

        });
        
    },
    sendGEO: (res, body) => {

        transporter.sendMail({
            from: 'noreply@evangrillo.com',
            to: RECIEVER,
            subject: 'GEO-auth Visitor',
            text: body
        }, (err, info) => {

            if (err) return sendError(res, err);

            console.log("\x1b[32m", 'Email sent: ' + info.response);

            res.end();

        });

    }
}
  
