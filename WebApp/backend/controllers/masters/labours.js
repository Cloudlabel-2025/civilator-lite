require('dotenv')

const config = require('config')
const mongoCollections = config.get('mongoCollections')
const Utils = require("../../helpers/utils");
const { ObjectId } = require('mongodb')
const PayloadValidator = require('../../helpers/PayloadValidator')
const payloadValidator = new PayloadValidator()

const ResponseHandler = require('../../helpers/ResponseHandler')
const responseHandler = new ResponseHandler()

class LaboursController {

    async create(req, res) {
        try {

            const isPayloadInvalid = await payloadValidator.Validate({ name: 'createMasterLabor', req, res, payload: req.body })
            if (isPayloadInvalid) return isPayloadInvalid

            const { org_id, user_id, user_name } = req
            const insertData = {
                ...req.body,
                org_id,
                created_by_id: user_id,
                created_by_name: user_name,
                created_at: new Date(),
                updated_at: new Date()
            }

            const response = await req.mongoDB.insertOne(mongoCollections.MASTER_LABORS, insertData)

            if (!response.acknowledged) return responseHandler.failedRequest({
                name: 'createMasterLabor',
                req, res,
                message: "Failed to create master labour"
            })

            return responseHandler.successRequest({
                name: 'createMasterLabor',
                req, res,
                message: "Master labour created successfully",
                data: insertData
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'createMasterLabor', req, res })
        }
    }

    async getAll(req, res) {
        try {

            const { org_id } = req

            const { id, search, status } = req.query

            const filters = {
                org_id: org_id
            }

            if (id) filters._id = ObjectId(id)
            if (status) filters.status = status
            if (search) filters.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ]

            let response = await req.mongoDB.find(mongoCollections.MASTER_LABORS, filters)



            return responseHandler.successRequest({
                name: 'getAllMasterlabours',
                req, res,
                message: "Master labours retrieved successfully",
                data: response
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'getAllMasterlabours', req, res })
        }
    }

    async update(req, res) {
        try {
            const isPayloadInvalid = await payloadValidator.Validate({ name: 'updateMasterLabor', req, res, payload: req.body })
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

            const response = await req.mongoDB.updateOne(mongoCollections.MASTER_LABORS, { _id: ObjectId(id), org_id }, { $set: updateData })

            if (!response.acknowledged) return responseHandler.failedRequest({
                name: 'updateMasterLabor',
                req, res,
                message: "Failed to update master labour"
            })

            return responseHandler.successRequest({
                name: 'updateMasterLabor',
                req, res,
                message: "Master labour updated successfully"
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'updateMasterLabor', req, res })
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.body
            const { org_id } = req
            const response = await req.mongoDB.deleteOne(mongoCollections.MASTER_LABORS, { _id: ObjectId(id), org_id })

            if (!response.acknowledged) return responseHandler.failedRequest({
                name: 'deleteMasterlabour',
                req, res,
                message: "Failed to delete master labour"
            })

            return responseHandler.successRequest({
                name: 'deleteMasterlabour',
                req, res,
                message: "Master labour deleted successfully"
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'deleteMasterlabour', req, res })
        }
    }
}

module.exports = LaboursController;