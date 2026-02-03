const express = require("express");
const Routes = express.Router()

const SitesController = require("../../../controllers/sites/sites");
const sitesController = new SitesController()

/*Middlewares*/
const Verifytoken = require('../../../middlewares/verifytoken')
const verifytoken = new Verifytoken()

Routes.post('/', verifytoken.verify, sitesController.create)
Routes.get('/', verifytoken.verify, sitesController.getAll)
Routes.put('/', verifytoken.verify, sitesController.update)
Routes.delete('/', verifytoken.verify, sitesController.delete)

module.exports = Routes