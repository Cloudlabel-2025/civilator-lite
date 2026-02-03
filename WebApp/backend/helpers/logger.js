require('dotenv').config();
require('winston-mongodb')

const winston = require('winston');
const { createLogger, format, transports } = require('winston');
const Mailer = require('./mailer');
const { combine, metadata, json, timestamp, label, printf } = format;

const sendTo = process.env.LOG_EMAIL

const logger = winston.createLogger({
    level: 'info',
    format: format.combine(
        format.errors({ stack: true }),
        metadata({ fillExcept: ['message', 'level'] }),
        json()
    ),
    defaultMeta: "",
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log', level: 'info' }),
    ],

});
logger.add(new winston.transports.Console({
    format: winston.format.simple(),
}))


const setLog = (url, email, method, success, message, hostname, level, name, stack) => {

    const time = new Date().getTime()

    logger.info(message, { success: success, url: url, "email": email, method: method, time: time, host: hostname, level: level })

    if (level == "error") {
        let html = ` 
                 <table cellspacing="0" cellpadding="4" border="1" bordercolor="#224466" width="100%">
                      <tr>
                          <th></th>
                          <th>INFO</th>
                      </tr>
                      <tr>
                          <td>HOST NAME</td>
                          <td title="5868 thread">${hostname}</td>
                      </tr>
                      <tr>
                          <td>API URL</td>
                          <td title="5868 thread">${url}</td>
                      </tr>
                      <tr>
                          <td>METHOD</td>
                          <td title="5868 thread">${method}</td>
                      </tr>
                      <tr>
                          <td>MESSAGE</td>
                          <td title="5868 thread">${message}</td>
                      </tr>
                      <tr>
                      <td>TIME</td>
                      <td title="5868 thread">${new Date(time)}</td>
                      </tr>
                      <tr>
                          <td>STACK</td>
                          <td title="5868 thread">${stack}</td>
                      </tr>
                      <tr>
                          <td>USER EMAIL</td>
                          <td title="5868 thread">${email}</td>
                      </tr>
                  </table>
                `
        Mailer({ to: sendTo, message, subject: name, html })
    }
}
const setErrlog = (message, name, stack, origin, path) => {
    const time = new Date().getTime()
    logger.error(message, { success: false, stack: stack, name: name, time: time, origin: origin })

    let hostname = "CivilATOR"

    let html = `
             <table cellspacing="0" cellpadding="4" border="1" bordercolor="#224466" width="100%">
              <tr>
                  <th></th>
                  <th>INFO</th>
              </tr>
              <tr>
                  <td>HOST NAME</td>
                  <td title="5868 thread">${hostname}</td>
              </tr>
              <tr>
              <td>TIME</td>
              <td title="5868 thread">${new Date(time)}</td>
              </tr>
              <tr>
                  <td>ERROR</td>
                  <td title="5868 thread">internal Server Error </td>
              </tr>
              <tr>
                  <td>MESSAGE</td>
                  <td title="5868 thread">${message}</td>
              </tr>
              <tr>
                  <td>STACK</td>
                  <td title="5868 thread">${stack}</td>
              </tr>
             </table>
            `
    Mailer({ to: sendTo, message, subject: name, html })


}



module.exports = { logger, setLog, setErrlog }


