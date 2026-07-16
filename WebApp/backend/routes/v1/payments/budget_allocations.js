const express = require("express");
const Routes = express.Router()

const BudgetAllocationsController = require("../../../controllers/payments/budget_allocations");
const budgetAllocationsController = new BudgetAllocationsController()

/*Middlewares*/
const Verifytoken = require('../../../middlewares/verifytoken')
const verifytoken = new Verifytoken()

Routes.post('/', verifytoken.verify, budgetAllocationsController.create)
Routes.get('/', verifytoken.verify, budgetAllocationsController.getAll)
Routes.put('/', verifytoken.verify, budgetAllocationsController.update)
Routes.put('/accept', verifytoken.verify, budgetAllocationsController.accept)
Routes.put('/decline', verifytoken.verify, budgetAllocationsController.decline)
Routes.delete('/', verifytoken.verify, budgetAllocationsController.delete)

module.exports = Routes
