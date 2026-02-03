const express = require("express");
const Routes = express.Router()

const MaterialsController = require("../../../controllers/masters/materials");
const materialsController = new MaterialsController()

/*Middlewares*/
const Verifytoken = require('../../../middlewares/verifytoken')
const verifytoken = new Verifytoken()

Routes.post('/', verifytoken.verify, materialsController.create)
Routes.get('/', verifytoken.verify, materialsController.getAll)
Routes.put('/', verifytoken.verify, materialsController.update)
Routes.delete('/', verifytoken.verify, materialsController.delete)

module.exports = Routes