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

class Payments {

    async create(req, res) {
        try {
            const isPayloadInvalid = await payloadValidator.Validate({ name: 'createPayment', req, res, payload: req.body })
            if (isPayloadInvalid) return isPayloadInvalid

            const { org_id, user_id, user_name } = req
            let attachments = []

            // Handle file uploads if present
            if (req.files && req.files.length > 0) {
                for (const file of req.files) {
                    const fileExtension = path.extname(file.originalname).substring(1)
                    const fileName = path.basename(file.originalname, path.extname(file.originalname))
                    const folderPath = `site_${req.body.site_id}/payments/`

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

            const response = await req.mongoDB.insertOne(mongoCollections.PAYMENTS, insertData)

            if (!response.acknowledged) return responseHandler.failedRequest({
                name: 'createPayment',
                req, res,
                message: "Failed to create payment"
            })

            return responseHandler.successRequest({
                name: 'createPayment',
                req, res,
                message: "Payment created successfully",
                data: insertData
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'createPayment', req, res })
        }
    }

    async getAll(req, res) {
        try {
            const { org_id } = req
            const { id, search, site_id, payment_from, payment_mode } = req.query

            const filters = {
                org_id
            }

            if (id) filters._id = ObjectId(id)
            if (site_id) filters.site_id = site_id
            if (payment_from) filters.payment_from = payment_from
            if (payment_mode) filters.payment_mode = payment_mode
            if (search) filters.$or = [
                { remarks: { $regex: search, $options: 'i' } },
                { transaction_id: { $regex: search, $options: 'i' } }
            ]

            const response = await req.mongoDB.find(mongoCollections.PAYMENTS, filters)

            return responseHandler.successRequest({
                name: 'getAllPayments',
                req, res,
                message: "Payments retrieved successfully",
                data: response
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'getAllPayments', req, res })
        }
    }

    async update(req, res) {
        try {
            const isPayloadInvalid = await payloadValidator.Validate({ name: 'updatePayment', req, res, payload: req.body })
            if (isPayloadInvalid) return isPayloadInvalid

            const { id } = req.body
            const { org_id, user_id, user_name } = req
            let attachments = []

            // Get existing payment record to check attachments
            const existingPayment = await req.mongoDB.findOne(mongoCollections.PAYMENTS, { _id: ObjectId(id), org_id })
            const existingAttachments = existingPayment?.attachments || []

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
                        const folderPath = `site_${req.body.site_id}/payments/`

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

            const response = await req.mongoDB.updateOne(mongoCollections.PAYMENTS, { _id: ObjectId(id), org_id }, { $set: updateData })

            if (!response.acknowledged) return responseHandler.failedRequest({
                name: 'updatePayment',
                req, res,
                message: "Failed to update payment"
            })

            return responseHandler.successRequest({
                name: 'updatePayment',
                req, res,
                message: "Payment updated successfully"
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'updatePayment', req, res })
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.body
            const { org_id } = req

            const response = await req.mongoDB.deleteOne(mongoCollections.PAYMENTS, { _id: ObjectId(id), org_id })

            if (!response.acknowledged) return responseHandler.failedRequest({
                name: 'deletePayment',
                req, res,
                message: "Failed to delete payment"
            })

            return responseHandler.successRequest({
                name: 'deletePayment',
                req, res,
                message: "Payment deleted successfully"
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'deletePayment', req, res })
        }
    }
}

module.exports = Payments;