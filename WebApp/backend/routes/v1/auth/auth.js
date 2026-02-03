const express = require("express");
const Routes = express.Router()

const AuthController = require("../../../controllers/auth/auth");
const authController = new AuthController()

/*Middlewares*/
const Verifytoken = require('../../../middlewares/verifytoken')
const verifytoken = new Verifytoken()

Routes.post('/login', authController.register)
Routes.post('/verifyotp', authController.verifyotp)
Routes.post('/onboard', verifytoken.verify, authController.onboard)

module.exports = Routes