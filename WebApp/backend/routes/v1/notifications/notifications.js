const express = require("express");
const Routes = express.Router()

const NotificationsController = require("../../../controllers/notifications/notifications");
const notificationsController = new NotificationsController()

/*Middlewares*/
const Verifytoken = require('../../../middlewares/verifytoken')
const verifytoken = new Verifytoken()

Routes.get('/', verifytoken.verify, notificationsController.getAll)
Routes.put('/mark-as-read', verifytoken.verify, notificationsController.markAsRead)
Routes.delete('/clear-all', verifytoken.verify, notificationsController.clearAll)

module.exports = Routes
