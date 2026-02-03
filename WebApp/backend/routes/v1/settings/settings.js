const express = require("express");
const Routes = express.Router()

const SettingsController = require("../../../controllers/settings/settings");
const settingsController = new SettingsController()

const Verifytoken = require('../../../middlewares/verifytoken')
const verifytoken = new Verifytoken()

Routes.get('/get-profile', verifytoken.verify, settingsController.get_profile)
Routes.get('/get-company', verifytoken.verify, settingsController.get_company)
Routes.put('/update-profile', verifytoken.verify, settingsController.update_profile)
Routes.put('/update-company', verifytoken.verify, settingsController.update_company)

module.exports = Routes