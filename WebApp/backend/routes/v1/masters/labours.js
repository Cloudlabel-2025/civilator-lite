const express = require("express");
const Routes = express.Router()

const LaboursController = require("../../../controllers/masters/labours");
const laboursController = new LaboursController()

/*Middlewares*/
const Verifytoken = require('../../../middlewares/verifytoken')
const verifytoken = new Verifytoken()

Routes.post('/', verifytoken.verify, laboursController.create)
Routes.get('/', verifytoken.verify, laboursController.getAll)
Routes.put('/', verifytoken.verify, laboursController.update)
Routes.delete('/', verifytoken.verify, laboursController.delete)

module.exports = Routes