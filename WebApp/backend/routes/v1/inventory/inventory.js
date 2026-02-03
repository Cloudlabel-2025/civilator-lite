const express = require("express");
const Routes = express.Router()

const InventoryController = require("../../../controllers/inventory/inventory");
const inventoryController = new InventoryController()

/*Middlewares*/
const Verifytoken = require('../../../middlewares/verifytoken')
const verifytoken = new Verifytoken()
const multerUpload = require('../../../helpers/multer')

Routes.post('/procurement', verifytoken.verify, multerUpload.anyUpload.array('attachments'), inventoryController.createProcurement)
Routes.get('/procurement', verifytoken.verify, inventoryController.getProcurements)
Routes.put('/procurement', verifytoken.verify, multerUpload.anyUpload.array('attachments'), inventoryController.updateProcurement)
Routes.delete('/procurement', verifytoken.verify, inventoryController.deleteProcurement)

Routes.get('/', verifytoken.verify, inventoryController.getInventory)
Routes.put('/', verifytoken.verify, inventoryController.updateInventory)
Routes.put('/bulk', verifytoken.verify, inventoryController.updateInventoryBulk)
module.exports = Routes