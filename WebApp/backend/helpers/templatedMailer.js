require('dotenv').config();
const nodemailer = require("nodemailer");
const handlebars = require('handlebars');
const fs = require('fs');
const path = require('path');

const TemplatedMailer = async ({ to, message, subject, template_name = '', template_data = undefined, html = '', file = null }) => {

    try {

        console.log(process.env.EMAIL, 'process.env.EMAIL');

        if (!to || !message || !subject) return;

        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASS
            }
        });


        let htmlToSend = ''

        if (!template_name || !template_data) htmlToSend = html

        if (template_name && template_data) {

            const file_path = path.join(__dirname, `./mailTemplates/${template_name}.html`);

            const source = fs.readFileSync(file_path, 'utf8').toString();

            const template = handlebars.compile(source);
            htmlToSend = template(template_data);
        }

        let mailOptions = {
            from: process.env.EMAIL,
            to: to,
            subject: subject,
            text: message,
            html: htmlToSend,
        };

        if (file) {

            mailOptions.attachments = [
                {
                    filename: file.name,
                    path: file.path,
                }
            ]
        }

        const info = await transporter.sendMail(mailOptions);

        return {
            success: true,
            output: info,
        };
    } catch (error) {
        console.error("Error occurred:", error);
        return {
            success: false,
            output: error,
        };
    }
};



module.exports = { TemplatedMailer };
