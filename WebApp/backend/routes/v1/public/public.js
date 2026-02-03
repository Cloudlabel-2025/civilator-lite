const express = require("express");
const Routes = express.Router()

const PublicController = require("../../../controllers/public/public");
const publicController = new PublicController()

Routes.post('/contact-us', publicController.createContactUs)
Routes.post('/request-demo', publicController.createRequestDemo)

module.exports = Routes