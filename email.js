const nodemailer = require('nodemailer');
require('dotenv').config();
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

        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString('utf8');
        });

        req.on('end', () => {

            if (!body) return res.end(`<h1>No message to send!</div>`);

            transporter.sendMail({
                from: 'noreply@evangrillo.com',
                to: RECIEVER,
                subject: 'Message from your blog',
                text: body
            }, (err, info) => {

                if (err) return console.log("\x1b[31m", err) && res.end(err);

                console.log("\x1b[32m", 'Email sent: ' + info.response);
                res.end(`<h1>Message sent!</div>`);

            });

        });
        
    },
    sendGEO: async (body) => {

        transporter.sendMail({
            from: 'noreply@evangrillo.com',
            to: RECIEVER,
            subject: 'GEO-auth Visitor',
            text: body
        }, (err, info) => {

            if (err) return console.log("\x1b[31m", err) && res.end(err);

            console.log("\x1b[32m", 'Email sent: ' + info.response);
            res.end();

        });

    }
}
  
