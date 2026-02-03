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

class Expenses {

    async create(req, res) {
        try {
            const isPayloadInvalid = await payloadValidator.Validate({ name: 'createExpense', req, res, payload: req.body })
            if (isPayloadInvalid) return isPayloadInvalid

            const { org_id, user_id, user_name } = req
            let attachments = []

            // Handle file uploads if present
            if (req.files && req.files.length > 0) {
                for (const file of req.files) {
                    const fileExtension = path.extname(file.originalname).substring(1)
                    const fileName = path.basename(file.originalname, path.extname(file.originalname))
                    const folderPath = `site_${req.body.site_id}/expenses/`

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

            const insertData = {
                ...req.body,
                attachments,
                org_id,
                created_by_id: user_id,
                created_by_name: user_name,
                created_at: new Date(),
                updated_at: new Date()
            }

            const response = await req.mongoDB.insertOne(mongoCollections.EXPENSES, insertData)

            if (!response.acknowledged) return responseHandler.failedRequest({
                name: 'createExpense',
                req, res,
                message: "Failed to create expense"
            })

            return responseHandler.successRequest({
                name: 'createExpense',
                req, res,
                message: "Expense created successfully",
                data: insertData
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'createExpense', req, res })
        }
    }

    async getAll(req, res) {
        try {
            const { org_id } = req
            const { id, search, site_id, category, payment_mode, payment_type } = req.query

            const filters = {
                org_id
            }

            if (id) filters._id = ObjectId(id)
            if (site_id) filters.site_id = site_id
            if (category) filters.category = category
            if (payment_mode) filters.payment_mode = payment_mode
            if (payment_type) filters.payment_type = payment_type
            if (search) filters.$or = [
                { party_name: { $regex: search, $options: 'i' } },
                { remarks: { $regex: search, $options: 'i' } },
                { transaction_id: { $regex: search, $options: 'i' } }
            ]

            const response = await req.mongoDB.find(mongoCollections.EXPENSES, filters)

            return responseHandler.successRequest({
                name: 'getAllExpenses',
                req, res,
                message: "Expenses retrieved successfully",
                data: response
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'getAllExpenses', req, res })
        }
    }

    async update(req, res) {
        try {
            const isPayloadInvalid = await payloadValidator.Validate({ name: 'updateExpense', req, res, payload: req.body })
            if (isPayloadInvalid) return isPayloadInvalid

            const { id } = req.body
            const { org_id, user_id, user_name } = req
            let attachments = []


            // Get existing expense record to check attachments
            const existingExpense = await req.mongoDB.findOne(mongoCollections.EXPENSES, { _id: ObjectId(id), org_id })
            const existingAttachments = existingExpense?.attachments || []

            // Remove files that are no longer present
            await Promise.all(existingAttachments.map(async existingAttachment => {
                const isFileStillPresent = req?.files?.some(file => file.originalname == existingAttachment.name)

                if (!isFileStillPresent) {
                    const file_key = existingAttachment.url.split('/').slice(-3).join('/')

                    console.log(file_key, 'file_key');

                    if (file_key) await awsS3Uploader.deleteFile(file_key)
                }
            }))
            // Handle file uploads and attachment updates
            if (req.files && req.files.length > 0) {
                for (const file of req.files) {
                    // Check if file already exists in attachments
                    const existingFile = existingAttachments.find(att => att.name == file.originalname)

                    if (!existingFile) {
                        const fileExtension = path.extname(file.originalname).substring(1)
                        const fileName = path.basename(file.originalname, path.extname(file.originalname))
                        const folderPath = `site_${req.body.site_id}/expenses/`

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
                    } else {
                        // Keep existing attachment
                        attachments.push(existingFile)
                    }
                }
            }



            const updateData = {
                ...req.body,
                attachments,
                updated_by_id: user_id,
                updated_by_name: user_name,
                updated_at: new Date()
            }

            delete updateData.id

            const response = await req.mongoDB.updateOne(mongoCollections.EXPENSES, { _id: ObjectId(id), org_id }, { $set: updateData })

            if (!response.acknowledged) return responseHandler.failedRequest({
                name: 'updateExpense',
                req, res,
                message: "Failed to update expense"
            })

            return responseHandler.successRequest({
                name: 'updateExpense',
                req, res,
                message: "Expense updated successfully"
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'updateExpense', req, res })
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.body
            const { org_id } = req

            const response = await req.mongoDB.deleteOne(mongoCollections.EXPENSES, { _id: ObjectId(id), org_id })

            if (!response.acknowledged) return responseHandler.failedRequest({
                name: 'deleteExpense',
                req, res,
                message: "Failed to delete expense"
            })

            return responseHandler.successRequest({
                name: 'deleteExpense',
                req, res,
                message: "Expense deleted successfully"
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'deleteExpense', req, res })
        }
    }
}

module.exports = Expenses;