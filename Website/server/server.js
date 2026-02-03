require("dotenv").config({ path: '.env' });

const express = require('express');
const app = express();
const path = require('path')
const cookieParser = require('cookie-parser');
const cors = require('cors')
const bodyParser = require('body-parser');
const helmet = require('helmet');
const PORT = process.env.PORT


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

app.use(express.static(path.join(__dirname, '../build')));

app.get("*", async (req, res) => {
    res.set('Cross-Origin-Opener-Policy', 'same-origin');
    res.sendFile(path.join(__dirname, '../build', 'index.html'))
})


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});