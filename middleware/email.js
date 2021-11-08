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
        
        body = JSON.parse(body);

        let formCheck_valueFails = [
            !(body.msg || '').trim(),
            !(body.name || '').trim(),
            !(/\S+@\S+\.\S+/).test(body.email || '')
        ];
        if (formCheck_valueFails.includes(true)) return res.end(`<h1>Payload is incomplete</div>`);

        let emailTemplate = fs.readFileSync('./public/templates/emails/message.html', 'utf8');
        emailTemplate = emailTemplate
        .replaceAll('[name]', body.name)
        .replaceAll('[email]', body.email)
        .replaceAll('[msg]', body.msg);

        transporter.sendMail({
            from: 'noreply@evangrillo.com',
            to: RECIEVER,
            subject: 'Message from your blog',
            html: emailTemplate
        }, (err, info) => {

            if (err) return sendError(res, err);

            console.log("\x1b[32m", 'Email sent: ' + info.response);
        
            let writeMessageSnippet = fs.readFileSync('./public/templates/modal/snippets/writeMessage.html', 'utf8');
            res.end(writeMessageSnippet);

        });
        
    },
    send: async (req, res, config) => {

        let {
            subject,
            body
        } = config;

        if (!body) body = await parseStream(req);

        transporter.sendMail({
            from: 'noreply@evangrillo.com',
            to: RECIEVER,
            subject: subject,
            text: body
        }, (err, info) => {

            if (err) return sendError(res, err);

            console.log("\x1b[32m", 'Email sent: ' + info.response);

            res.end();

        });
    }
}
  
