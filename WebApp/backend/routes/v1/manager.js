const express = require("express");
const Routes = express.Router()

const auth = require("./auth/auth");
const admin = require("./admin/admin");
const sites = require("./sites/sites");
const vendors = require("./vendors/vendors");
const employees = require("./employees/employees");
const masterMaterials = require("./masters/materials");
const masterBrands = require("./masters/brands");
const masterLabours = require("./masters/labours");
const settings = require("./settings/settings");
const roles = require("./roles/roles");
const expenses = require("./expenses/expenses");
const payments = require("./payments/payments");
const inventory = require("./inventory/inventory");
const tasks = require("./tasks/tasks");
const attendances = require("./attendances/attendances");

const public = require("./public/public");



Routes.use('/auth', auth)
Routes.use('/admin', admin)
Routes.use('/sites', sites)
Routes.use('/vendors', vendors)
Routes.use('/employees', employees)
Routes.use('/master-materials', masterMaterials)
Routes.use('/master-brands', masterBrands)
Routes.use('/master-labours', masterLabours)
Routes.use('/roles', roles)
Routes.use('/settings', settings)
Routes.use('/expenses', expenses)
Routes.use('/payments', payments)
Routes.use('/inventory', inventory)
Routes.use('/tasks', tasks)
Routes.use('/attendances', attendances)
Routes.use('/public', public)



module.exports = Routes
