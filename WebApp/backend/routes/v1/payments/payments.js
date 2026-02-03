const express = require("express");
const Routes = express.Router()

const PaymentsController = require("../../../controllers/payments/payments");
const paymentsController = new PaymentsController()

/*Middlewares*/
const Verifytoken = require('../../../middlewares/verifytoken')
const verifytoken = new Verifytoken()
const multerUpload = require('../../../helpers/multer')

Routes.post('/', verifytoken.verify, multerUpload.anyUpload.array('attachments'), paymentsController.create)
Routes.get('/', verifytoken.verify, paymentsController.getAll)
Routes.put('/', verifytoken.verify, multerUpload.anyUpload.array('attachments'), paymentsController.update)
Routes.delete('/', verifytoken.verify, paymentsController.delete)

module.exports = Routes