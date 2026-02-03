const express = require("express");
const Routes = express.Router()

const ExpensesController = require("../../../controllers/expenses/expenses");
const expensesController = new ExpensesController()

/*Middlewares*/
const Verifytoken = require('../../../middlewares/verifytoken')
const verifytoken = new Verifytoken()
const multerUpload = require('../../../helpers/multer')

Routes.post('/', verifytoken.verify, multerUpload.anyUpload.array('attachments'), expensesController.create)
Routes.get('/', verifytoken.verify, expensesController.getAll)
Routes.put('/', verifytoken.verify, multerUpload.anyUpload.array('attachments'), expensesController.update)
Routes.delete('/', verifytoken.verify, expensesController.delete)

module.exports = Routes