const express = require("express");
const Routes = express.Router()

const EmployeesController = require("../../../controllers/employees/employees");
const employeesController = new EmployeesController()

/*Middlewares*/
const Verifytoken = require('../../../middlewares/verifytoken')
const verifytoken = new Verifytoken()

Routes.post('/', verifytoken.verify, employeesController.create)
Routes.get('/', verifytoken.verify, employeesController.getAll)
Routes.put('/', verifytoken.verify, employeesController.update)
Routes.delete('/', verifytoken.verify, employeesController.delete)

module.exports = Routes