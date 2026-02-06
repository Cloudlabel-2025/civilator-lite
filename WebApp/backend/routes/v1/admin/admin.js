const express = require("express");
const Routes = express.Router()

const AdminController = require("../../../controllers/admin/admin");
const adminController = new AdminController()

const Verifytoken = require('../../../middlewares/verifytoken')
const verifytoken = new Verifytoken()

Routes.post('/users', verifytoken.verify, adminController.createUser)
Routes.get('/users', verifytoken.verify, adminController.getUsers)
Routes.put('/users', verifytoken.verify, adminController.updateUser)
Routes.delete('/users', verifytoken.verify, adminController.deleteUser)

module.exports = Routes
