const express = require("express");
const Routes = express.Router()

const AttendanceController = require("../../../controllers/attendances/attendances");
const attendancesController = new AttendanceController()

/*Middlewares*/
const Verifytoken = require('../../../middlewares/verifytoken')
const verifytoken = new Verifytoken()

Routes.post('/', verifytoken.verify, attendancesController.create)
Routes.get('/', verifytoken.verify, attendancesController.getAll)
Routes.put('/', verifytoken.verify, attendancesController.update)
Routes.delete('/', verifytoken.verify, attendancesController.delete)
Routes.post('/mark', verifytoken.verify, attendancesController.markAttendance)


module.exports = Routes