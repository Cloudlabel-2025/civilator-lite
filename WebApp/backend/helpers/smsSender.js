const twilio = require("twilio");
const config = require('config')
const SMS_CONFIG = config.get('SMS_CONFIG')

const accountSid = SMS_CONFIG.TWILIO_ACCOUNT_SID;
const authToken = SMS_CONFIG.TWILIO_AUTH_TOKEN;
const twilioPhone = SMS_CONFIG.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);


async function sendSMS(phoneNumber, body) {
    try {

        if (!phoneNumber || !body) return false

        const message = await client.messages.create({
            body: body,
            from: twilioPhone,
            to: phoneNumber,
        });

        console.log("SMS sent successfully:", message.sid);
        return message;
    } catch (error) {
        console.error("Error sending SMS:", error.message);
        return false
    }
}

module.exports = { sendSMS };
