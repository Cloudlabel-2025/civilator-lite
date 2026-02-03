const express = require("express");
const Routes = express.Router()

const BrandsController = require("../../../controllers/masters/brands");
const brandsController = new BrandsController()

/*Middlewares*/
const Verifytoken = require('../../../middlewares/verifytoken')
const verifytoken = new Verifytoken()

Routes.post('/', verifytoken.verify, brandsController.create)
Routes.get('/', verifytoken.verify, brandsController.getAll)
Routes.put('/', verifytoken.verify, brandsController.update)
Routes.delete('/', verifytoken.verify, brandsController.delete)

module.exports = Routes