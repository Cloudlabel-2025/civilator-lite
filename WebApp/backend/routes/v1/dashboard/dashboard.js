const express = require("express");
const Routes = express.Router()

const Dashboard = require("../../../controllers/dashboard/dashboard");
const dashboard = new Dashboard()

const Verifytoken = require('../../../middlewares/verifytoken')
const verifytoken = new Verifytoken()

Routes.get('/site', verifytoken.verify, dashboard.getSiteDashboard)

module.exports = Routes
