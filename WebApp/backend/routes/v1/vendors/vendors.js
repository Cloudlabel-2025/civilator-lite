const express = require("express");
const Routes = express.Router()

const VendorsController = require("../../../controllers/vendors/vendors");
const vendorsController = new VendorsController()

/*Middlewares*/
const Verifytoken = require('../../../middlewares/verifytoken')
const verifytoken = new Verifytoken()

Routes.post('/', verifytoken.verify, vendorsController.create)
Routes.get('/', verifytoken.verify, vendorsController.getAll)
Routes.put('/', verifytoken.verify, vendorsController.update)
Routes.delete('/', verifytoken.verify, vendorsController.delete)

module.exports = Routes