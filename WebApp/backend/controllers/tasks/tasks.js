require('dotenv')

const config = require('config')
const mongoCollections = config.get('mongoCollections')
const Utils = require("../../helpers/utils");
const PayloadValidator = require('../../helpers/PayloadValidator')
const payloadValidator = new PayloadValidator()
const { ObjectId } = require('mongodb')
const ResponseHandler = require('../../helpers/ResponseHandler')
const responseHandler = new ResponseHandler()
const AWSS3Uploader = require('../../helpers/awsS3Uploader')
const awsS3Uploader = new AWSS3Uploader()
const path = require('path')

class Tasks {

    async create(req, res) {
        try {
            const isPayloadInvalid = await payloadValidator.Validate({ name: 'createTask', req, res, payload: req.body })
            if (isPayloadInvalid) return isPayloadInvalid

            const { org_id, user_id, user_name } = req
            const insertData = {
                ...req.body,
                org_id,
                work_done_progress: 0,
                progress_timeline: [
                    {
                        id: Utils.getUniqueId(),
                        type: "created",
                        time: new Date().getTime(),
                        added_by: user_name,
                    }
                ],
                created_by_id: user_id,
                created_by_name: user_name,
                created_at: new Date(),
                updated_at: new Date()
            }

            const response = await req.mongoDB.insertOne(mongoCollections.TASKS, insertData)

            if (!response.acknowledged) return responseHandler.failedRequest({
                name: 'createTask',
                req, res,
                message: "Failed to create task"
            })

            return responseHandler.successRequest({
                name: 'createTask',
                req, res,
                message: "Task created successfully",
                data: insertData
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'createTask', req, res })
        }
    }

    async getAll(req, res) {
        try {

            const { org_id } = req

            const { id, search, status, site_id } = req.query

            const filters = {
                org_id
            }

            if (id) filters._id = ObjectId(id)
            if (status) filters.status = status
            if (site_id) filters.site_id = site_id
            if (search) filters.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { category: { $regex: search, $options: 'i' } },
                { assignee_name: { $regex: search, $options: 'i' } }
            ]

            const response = await req.mongoDB.find(mongoCollections.TASKS, filters)

            return responseHandler.successRequest({
                name: 'getAllTasks',
                req, res,
                message: "Tasks retrieved successfully",
                data: response
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'getAllTasks', req, res })
        }
    }

    async update(req, res) {
        try {
            const isPayloadInvalid = await payloadValidator.Validate({ name: 'updateTask', req, res, payload: req.body })
            if (isPayloadInvalid) return isPayloadInvalid

            const { id } = req.body
            const { org_id, user_id, user_name } = req

            const updateData = {
                ...req.body,
                updated_by_id: user_id,
                updated_by_name: user_name,
                updated_at: new Date()
            }

            delete updateData.id

            const response = await req.mongoDB.updateOne(mongoCollections.TASKS, { _id: ObjectId(id), org_id }, { $set: updateData })

            if (!response.acknowledged) return responseHandler.failedRequest({
                name: 'updateTask',
                req, res,
                message: "Failed to update task"
            })

            return responseHandler.successRequest({
                name: 'updateTask',
                req, res,
                message: "Task updated successfully"
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'updateTask', req, res })
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.body
            const { org_id } = req

            const response = await req.mongoDB.deleteOne(mongoCollections.TASKS, { _id: ObjectId(id), org_id })

            if (!response.acknowledged) return responseHandler.failedRequest({
                name: 'deleteTask',
                req, res,
                message: "Failed to delete task"
            })

            return responseHandler.successRequest({
                name: 'deleteTask',
                req, res,
                message: "Task deleted successfully"
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'deleteTask', req, res })
        }
    }

    async createTaskComment(req, res) {
        try {
            const isPayloadInvalid = await payloadValidator.Validate({ name: 'createTaskComment', req, res, payload: req.body })
            if (isPayloadInvalid) return isPayloadInvalid
            const { org_id, user_id, user_name } = req

            const { task_id, message } = req.body


            const get_task_details = await req.mongoDB.findOne(mongoCollections.TASKS, { _id: ObjectId(task_id), org_id }, { project: { _id: 1, comments: 1 } })

            if (!get_task_details) return responseHandler.failedRequest({
                name: 'createTaskComment',
                req, res,
                message: "Task not found"
            })

            let comments = get_task_details.comments || []

            comments.push({
                id: Utils.getUniqueId(),
                message,
                user_id,
                user_name,
                created_at: new Date().getTime()
            })

            const updatetData = {

                comments,
                updated_at: new Date()
            }
            const response = await req.mongoDB.updateOne(mongoCollections.TASKS, { _id: ObjectId(task_id), org_id }, { $set: updatetData })

            if (!response.acknowledged) return responseHandler.failedRequest({
                name: 'createTaskComment',
                req, res,
                message: "Failed to create task comment"
            })

            return responseHandler.successRequest({
                name: 'createTaskComment',
                req, res,
                message: "Task comment created successfully",
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'createTaskComment', req, res })
        }
    }

    async deleteTaskComment(req, res) {
        try {
            const { org_id } = req

            const { task_id, id } = req.body

            if (!task_id || !id) return responseHandler.failedRequest({
                name: 'deleteTaskComment',
                req, res,
                message: "Task and comment id is required"
            })

            const get_task_details = await req.mongoDB.findOne(mongoCollections.TASKS, { _id: ObjectId(task_id), org_id }, { project: { _id: 1, comments: 1 } })

            if (!get_task_details) return responseHandler.failedRequest({
                name: 'deleteTaskComment',
                req, res,
                message: "Task not found"
            })

            let comments = get_task_details.comments || []

            comments = comments.filter((comment) => comment.id !== id)

            const updatetData = {

                comments,
                updated_at: new Date()
            }
            const response = await req.mongoDB.updateOne(mongoCollections.TASKS, { _id: ObjectId(task_id), org_id }, { $set: updatetData })

            if (!response.acknowledged) return responseHandler.failedRequest({
                name: 'deleteTaskComment',
                req, res,
                message: "Failed to delete task comment"
            })

            return responseHandler.successRequest({
                name: 'deleteTaskComment',
                req, res,
                message: "Task comment deleted successfully",
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'deleteTaskComment', req, res })
        }
    }

    async updateTaskProgress(req, res) {
        try {
            const isPayloadInvalid = await payloadValidator.Validate({ name: 'updateTaskProgress', req, res, payload: req.body })
            if (isPayloadInvalid) return isPayloadInvalid
            const { org_id, user_id, user_name } = req

            let {
                task_id,
                progress_value,
                type,
                remarks,
                materials,
                attendances,

            } = req.body

            let attachments = []
            materials = JSON.parse(materials || '[]')
            attendances = JSON.parse(attendances || '[]')
            progress_value = parseFloat(progress_value || 0)

            const get_task_details = await req.mongoDB.findOne(mongoCollections.TASKS, { _id: ObjectId(task_id), org_id }, { project: { _id: 1, work_done_progress: 1, progress_timeline: 1, } })

            if (!get_task_details) return responseHandler.failedRequest({
                name: 'updateTaskProgress',
                req, res,
                message: "Task not found"
            })

            if (req.files && req.files.length > 0) {
                for (const file of req.files) {

                    const fileExtension = path.extname(file.originalname).substring(1)
                    const fileName = path.basename(file.originalname, path.extname(file.originalname))
                    const folderPath = `site_${req.body.site_id}/task_progress/`

                    const uploadedUrl = await awsS3Uploader.uploadFile(
                        file,
                        fileName,
                        folderPath,
                        fileExtension
                    )

                    if (uploadedUrl) {
                        attachments.push({
                            url: uploadedUrl,
                            name: file.originalname,
                            type: file.mimetype,
                            size: file.size
                        })
                    }

                }
            }


            let work_done_progress = parseFloat(get_task_details.work_done_progress || 0)
            let progress_timeline = get_task_details.progress_timeline || []

            progress_timeline.push({
                id: Utils.getUniqueId(),
                type: type,
                progress_value,
                remarks,
                materials,
                attendances,
                attachments,
                added_by_id: user_id,
                added_by: user_name,
                time: new Date().getTime(),
            })
            if (type == 'progress') {
                work_done_progress += progress_value
            }

            const updatetData = {
                work_done_progress: work_done_progress,
                progress_timeline,
                updated_at: new Date()
            }
            const response = await req.mongoDB.updateOne(mongoCollections.TASKS, { _id: ObjectId(task_id), org_id }, { $set: updatetData })

            if (!response.acknowledged) return responseHandler.failedRequest({
                name: 'updateTaskProgress',
                req, res,
                message: "Failed to update task progress"
            })

            return responseHandler.successRequest({
                name: 'updateTaskProgress',
                req, res,
                message: "Task progress created successfully",
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'updateTaskProgress', req, res })
        }
    }

    async deleteTaskProgress(req, res) {
        try {
            const isPayloadInvalid = await payloadValidator.Validate({ name: 'deleteTaskProgress', req, res, payload: req.body })
            if (isPayloadInvalid) return isPayloadInvalid
            const { org_id, user_id, user_name } = req
            let {
                task_id,
                id,
            } = req.body



            const get_task_details = await req.mongoDB.findOne(mongoCollections.TASKS, { _id: ObjectId(task_id), org_id }, { project: { _id: 1, work_done_progress: 1, progress_timeline: 1, } })

            if (!get_task_details) return responseHandler.failedRequest({
                name: 'deleteTaskProgress',
                req, res,
                message: "Task not found"
            })

            let work_done_progress = parseFloat(get_task_details.work_done_progress || 0)
            let progress_timeline = get_task_details.progress_timeline || []

            let existingAttachments = []
            progress_timeline = progress_timeline.filter((item) => {

                if (item.id == id) {
                    work_done_progress -= parseFloat(item.progress_value || 0)
                    existingAttachments = item.attachments || []
                } else return item

            })

            if (existingAttachments.length > 0) {
                await Promise.all(existingAttachments.map(async attachment => {

                    const file_key = attachment.url.split('/').slice(-3).join('/')
                    if (file_key) await awsS3Uploader.deleteFile(file_key)
                }))
            }

            const updatetData = {
                work_done_progress,
                progress_timeline,
                updated_at: new Date()
            }
            const response = await req.mongoDB.updateOne(mongoCollections.TASKS, { _id: ObjectId(task_id), org_id }, { $set: updatetData })

            if (!response.acknowledged) return responseHandler.failedRequest({
                name: 'deleteTaskProgress',
                req, res,
                message: "Failed to delete task progress"
            })

            return responseHandler.successRequest({
                name: 'deleteTaskProgress',
                req, res,
                message: "Task progress deleted successfully",
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'deleteTaskProgress', req, res })
        }
    }
}
module.exports = Tasks;