require('dotenv').config();

const winston = require('winston');
const Mailer = require('./mailer');

const { format, transports } = winston;
const { combine, metadata, json, timestamp } = format;

const sendTo = process.env.LOG_EMAIL;

/**
 * Winston Logger Configuration
 * - Console logging (development)
 * - File logging (production / debugging)
 * - NO MongoDB dependency
 */
const logger = winston.createLogger({
    level: 'info',
    format: combine(
        timestamp(),
        format.errors({ stack: true }),
        metadata({ fillExcept: ['message', 'level', 'timestamp'] }),
        json()
    ),
    transports: [
        new transports.File({ filename: 'error.log', level: 'error' }),
        new transports.File({ filename: 'combined.log' }),
        new transports.Console({
            format: winston.format.simple()
        })
    ],
});

/**
 * Standard application log
 */
const setLog = (
    url,
    email,
    method,
    success,
    message,
    hostname,
    level,
    name,
    stack
) => {
    const time = Date.now();

    logger.info(message, {
        success,
        url,
        email,
        method,
        time,
        host: hostname,
        level
    });

    if (level === 'error') {
        const html = `
        <table cellspacing="0" cellpadding="4" border="1" width="100%">
            <tr><th></th><th>INFO</th></tr>
            <tr><td>HOST NAME</td><td>${hostname}</td></tr>
            <tr><td>API URL</td><td>${url}</td></tr>
            <tr><td>METHOD</td><td>${method}</td></tr>
            <tr><td>MESSAGE</td><td>${message}</td></tr>
            <tr><td>TIME</td><td>${new Date(time)}</td></tr>
            <tr><td>STACK</td><td>${stack || 'N/A'}</td></tr>
            <tr><td>USER EMAIL</td><td>${email || 'N/A'}</td></tr>
        </table>
        `;

        Mailer({
            to: sendTo,
            message,
            subject: name || 'Application Error',
            html
        });
    }
};

/**
 * Internal server / fatal error log
 */
const setErrlog = (message, name, stack, origin, path) => {
    const time = Date.now();
    const hostname = 'CivilATOR';

    logger.error(message, {
        success: false,
        stack,
        name,
        time,
        origin,
        path
    });

    const html = `
    <table cellspacing="0" cellpadding="4" border="1" width="100%">
        <tr><th></th><th>INFO</th></tr>
        <tr><td>HOST NAME</td><td>${hostname}</td></tr>
        <tr><td>TIME</td><td>${new Date(time)}</td></tr>
        <tr><td>ERROR</td><td>Internal Server Error</td></tr>
        <tr><td>MESSAGE</td><td>${message}</td></tr>
        <tr><td>STACK</td><td>${stack || 'N/A'}</td></tr>
    </table>
    `;

    Mailer({
        to: sendTo,
        message,
        subject: name || 'Critical Server Error',
        html
    });
};

module.exports = {
    logger,
    setLog,
    setErrlog
};
