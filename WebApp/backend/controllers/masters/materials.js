require('dotenv')

const config = require('config')
const mongoCollections = config.get('mongoCollections')
const Utils = require("../../helpers/utils");
const { ObjectId } = require('mongodb')
const PayloadValidator = require('../../helpers/PayloadValidator')
const payloadValidator = new PayloadValidator()

const ResponseHandler = require('../../helpers/ResponseHandler')
const responseHandler = new ResponseHandler()

class MaterialsController {

    async create(req, res) {
        try {

            const isPayloadInvalid = await payloadValidator.Validate({ name: 'createMasterMaterial', req, res, payload: req.body })
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

            const response = await req.mongoDB.insertOne(mongoCollections.MASTER_MATERIALS, insertData)

            if (!response.acknowledged) return responseHandler.failedRequest({
                name: 'createMasterMaterial',
                req, res,
                message: "Failed to create master material"
            })

            return responseHandler.successRequest({
                name: 'createMasterMaterial',
                req, res,
                message: "Master material created successfully",
                data: insertData
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'createMasterMaterial', req, res })
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

            let response = await req.mongoDB.find(mongoCollections.MASTER_MATERIALS, filters)



            return responseHandler.successRequest({
                name: 'getAllMasterMaterials',
                req, res,
                message: "Master materials retrieved successfully",
                data: response
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'getAllMasterMaterials', req, res })
        }
    }

    async update(req, res) {
        try {
            const isPayloadInvalid = await payloadValidator.Validate({ name: 'updateMasterMaterial', req, res, payload: req.body })
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

            const response = await req.mongoDB.updateOne(mongoCollections.MASTER_MATERIALS, { _id: ObjectId(id), org_id }, { $set: updateData })

            if (!response.acknowledged) return responseHandler.failedRequest({
                name: 'updateMasterMaterial',
                req, res,
                message: "Failed to update master material"
            })

            return responseHandler.successRequest({
                name: 'updateMasterMaterial',
                req, res,
                message: "Master material updated successfully"
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'updateMasterMaterial', req, res })
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.body
            const { org_id } = req
            const response = await req.mongoDB.deleteOne(mongoCollections.MASTER_MATERIALS, { _id: ObjectId(id), org_id })

            if (!response.acknowledged) return responseHandler.failedRequest({
                name: 'deleteMasterMaterial',
                req, res,
                message: "Failed to delete master material"
            })

            return responseHandler.successRequest({
                name: 'deleteMasterMaterial',
                req, res,
                message: "Master material deleted successfully"
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'deleteMasterMaterial', req, res })
        }
    }
}

module.exports = MaterialsController;