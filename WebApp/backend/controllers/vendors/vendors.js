require('dotenv')

const config = require('config')
const mongoCollections = config.get('mongoCollections')
const Utils = require("../../helpers/utils");
const PayloadValidator = require('../../helpers/PayloadValidator')
const payloadValidator = new PayloadValidator()
const { ObjectId } = require('mongodb')
const ResponseHandler = require('../../helpers/ResponseHandler')
const responseHandler = new ResponseHandler()

class Vendors {

    async create(req, res) {
        try {
            const isPayloadInvalid = await payloadValidator.Validate({ name: 'createVendor', req, res, payload: req.body })
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

            const response = await req.mongoDB.insertOne(mongoCollections.VENDORS, insertData)

            if (!response.acknowledged) return responseHandler.failedRequest({
                name: 'createVendor',
                req, res,
                message: "Failed to create vendor"
            })

            return responseHandler.successRequest({
                name: 'createVendor',
                req, res,
                message: "Vendor created successfully",
                data: insertData
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'createVendor', req, res })
        }
    }

    async getAll(req, res) {
        try {

            const { org_id } = req

            const { id, search, status } = req.query

            const filters = {
                org_id
            }

            if (id) filters._id = ObjectId(id)
            if (status) filters.status = status
            if (search) filters.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ]

            const response = await req.mongoDB.find(mongoCollections.VENDORS, filters)




            return responseHandler.successRequest({
                name: 'getAllVendors',
                req, res,
                message: "Vendors retrieved successfully",
                data: response
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'getAllVendors', req, res })
        }
    }


    async update(req, res) {
        try {
            const isPayloadInvalid = await payloadValidator.Validate({ name: 'updateVendor', req, res, payload: req.body })
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

            const response = await req.mongoDB.updateOne(mongoCollections.VENDORS, { _id: ObjectId(id), org_id }, { $set: updateData })

            if (!response.acknowledged) return responseHandler.failedRequest({
                name: 'updateVendor',
                req, res,
                message: "Failed to update vendor"
            })

            return responseHandler.successRequest({
                name: 'updateVendor',
                req, res,
                message: "Vendor updated successfully"
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'updateVendor', req, res })
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.body
            const { org_id } = req

            const response = await req.mongoDB.deleteOne(mongoCollections.VENDORS, { _id: ObjectId(id), org_id })

            if (!response.acknowledged) return responseHandler.failedRequest({
                name: 'deleteVendor',
                req, res,
                message: "Failed to delete vendor"
            })

            return responseHandler.successRequest({
                name: 'deleteVendor',
                req, res,
                message: "Vendor deleted successfully"
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'deleteVendor', req, res })
        }
    }
}

module.exports = Vendors;