require('dotenv')

const config = require('config')
const mongoCollections = config.get('mongoCollections')
const Utils = require("../../helpers/utils");
const { ObjectId } = require('mongodb')
const PayloadValidator = require('../../helpers/PayloadValidator')
const payloadValidator = new PayloadValidator()

const ResponseHandler = require('../../helpers/ResponseHandler')
const responseHandler = new ResponseHandler()

class BrandsController {

    async create(req, res) {
        try {

            const isPayloadInvalid = await payloadValidator.Validate({ name: 'createMasterBrand', req, res, payload: req.body })
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


            const response = await req.mongoDB.insertOne(mongoCollections.MASTER_BRANDS, insertData)

            if (!response.acknowledged) return responseHandler.failedRequest({
                name: 'createMasterBrand',
                req, res,
                message: "Failed to create master brand"
            })

            return responseHandler.successRequest({
                name: 'createMasterBrand',
                req, res,
                message: "Master brand created successfully",
                data: insertData
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'createMasterBrand', req, res })
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

            let response = await req.mongoDB.find(mongoCollections.MASTER_BRANDS, filters)



            return responseHandler.successRequest({
                name: 'getAllMasterbrands',
                req, res,
                message: "Master brands retrieved successfully",
                data: response
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'getAllMasterbrands', req, res })
        }
    }

    async update(req, res) {
        try {
            const isPayloadInvalid = await payloadValidator.Validate({ name: 'updateMasterBrand', req, res, payload: req.body })
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


            const response = await req.mongoDB.updateOne(mongoCollections.MASTER_BRANDS, { _id: ObjectId(id), org_id }, { $set: updateData })

            if (!response.acknowledged) return responseHandler.failedRequest({
                name: 'updateMasterBrand',
                req, res,
                message: "Failed to update master brand"
            })

            return responseHandler.successRequest({
                name: 'updateMasterBrand',
                req, res,
                message: "Master brand updated successfully"
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'updateMasterBrand', req, res })
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.body
            const { org_id } = req
            const response = await req.mongoDB.deleteOne(mongoCollections.MASTER_BRANDS, { _id: ObjectId(id), org_id })

            if (!response.acknowledged) return responseHandler.failedRequest({
                name: 'deleteMasterbrand',
                req, res,
                message: "Failed to delete master brand"
            })

            return responseHandler.successRequest({
                name: 'deleteMasterbrand',
                req, res,
                message: "Master brand deleted successfully"
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'deleteMasterbrand', req, res })
        }
    }
}

module.exports = BrandsController;