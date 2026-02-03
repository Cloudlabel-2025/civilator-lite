require("dotenv").config({ path: '.env' });

const config = require("config");
const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const helmet = require('helmet');
const path = require('path')
const cookieParser = require('cookie-parser');
const cors = require('cors')
const bodyParser = require('body-parser');

const MongoDBConnection = require('./helpers/MongoDBConnection')
const mongoDBConnection = new MongoDBConnection()

const Routemanager = require('./routes/manager')
const uncaughtException = require('./helpers/ExceptionHandling');

app.use((req, res, next) => {
    req.mongoDB = mongoDBConnection;
    next();
});

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json({ limit: '30mb' }));
app.use(express.urlencoded({ extended: true }))
app.use(express.json({ limit: '50mb' }))
app.use(cookieParser())
app.use(cors())
app.use(helmet({
    contentSecurityPolicy: false, // Disable CSP if not needed
    crossOriginOpenerPolicy: 'same-origin', // Set COOP policy
}));

uncaughtException()

app.use('/api', Routemanager)
app.use(express.static('../frontend/dist'))

app.get("*", async (req, res) => {
    res.set('Cross-Origin-Opener-Policy', 'same-origin');
    res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'))
})

function startServer(server, port) {
    try {
        server.listen(port, () => {

            console.log('Server started on port ' + port)
        })

    } catch (error) {
        console.log("Error in server start:", error)
    }

}

startServer(server, config.get('port'))
