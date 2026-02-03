const express = require("express");
const Routes = express.Router()

const RolesController = require("../../../controllers/roles/roles");
const rolesController = new RolesController()

/*Middlewares*/
const Verifytoken = require('../../../middlewares/verifytoken')
const verifytoken = new Verifytoken()

Routes.post('/', verifytoken.verify, rolesController.create)
Routes.get('/', verifytoken.verify, rolesController.getAll)
Routes.put('/', verifytoken.verify, rolesController.update)
Routes.delete('/', verifytoken.verify, rolesController.delete)

module.exports = Routes