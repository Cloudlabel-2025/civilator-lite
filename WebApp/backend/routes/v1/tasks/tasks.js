const express = require("express");
const Routes = express.Router()

const TasksController = require("../../../controllers/tasks/tasks");
const tasksController = new TasksController()

/*Middlewares*/
const Verifytoken = require('../../../middlewares/verifytoken')
const verifytoken = new Verifytoken()

const multerUpload = require('../../../helpers/multer')

Routes.post('/', verifytoken.verify, tasksController.create)
Routes.get('/', verifytoken.verify, tasksController.getAll)
Routes.put('/', verifytoken.verify, tasksController.update)
Routes.delete('/', verifytoken.verify, tasksController.delete)

Routes.post('/comment', verifytoken.verify, tasksController.createTaskComment)
Routes.delete('/comment', verifytoken.verify, tasksController.deleteTaskComment)
Routes.post('/task-progress', verifytoken.verify, multerUpload.anyUpload.array('attachments'), tasksController.updateTaskProgress)
Routes.delete('/task-progress', verifytoken.verify, tasksController.deleteTaskProgress)

module.exports = Routes