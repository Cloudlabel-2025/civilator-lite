require('dotenv')

const config = require('config')
const { ObjectId } = require('mongodb')
const mongoCollections = config.get('mongoCollections')
const Utils = require("../../helpers/utils");
const PayloadValidator = require('../../helpers/PayloadValidator')
const payloadValidator = new PayloadValidator()

const ResponseHandler = require('../../helpers/ResponseHandler')
const responseHandler = new ResponseHandler()

class Sites {

    async create(req, res) {
        try {
            const isPayloadInvalid = await payloadValidator.Validate({ name: 'createSite', req, res, payload: req.body })
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

            const response = await req.mongoDB.insertOne(mongoCollections.SITES, insertData)

            if (!response.acknowledged) return responseHandler.failedRequest({
                name: 'createSite',
                req, res,
                message: "Failed to create site"
            })

            return responseHandler.successRequest({
                name: 'createSite',
                req, res,
                message: "Site created successfully",
                data: { id: response.insertedId.toString() }
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'createSite', req, res })
        }
    }

    async getAll(req, res) {
        try {
            const { org_id } = req

            const { id, search, status } = req.query

            const filters = {
                org_id
            }

            if (id) {

                if (!ObjectId.isValid(id)) return responseHandler.failedRequest({
                    name: 'getAllSites',
                    req, res,
                    message: "Invalid site id"
                })

                filters._id = new ObjectId(id)
            }
            if (status) filters.status = status
            if (search) filters.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ]

            let response = await req.mongoDB.find(mongoCollections.SITES, filters,)



            return responseHandler.successRequest({
                name: 'getAllSites',
                req, res,
                message: "Sites retrieved successfully",
                data: response
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'getAllSites', req, res })
        }
    }


    async update(req, res) {
        try {
            const isPayloadInvalid = await payloadValidator.Validate({ name: 'updateSite', req, res, payload: req.body })
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

            const response = await req.mongoDB.updateOne(mongoCollections.SITES, { _id: new ObjectId(id), org_id }, { $set: updateData })

            if (!response.acknowledged) return responseHandler.failedRequest({
                name: 'updateSite',
                req, res,
                message: "Failed to update site"
            })

            return responseHandler.successRequest({
                name: 'updateSite',
                req, res,
                message: "Site updated successfully"
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'updateSite', req, res })
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.body
            const { org_id } = req

            const response = await req.mongoDB.deleteOne(mongoCollections.SITES, { _id: new ObjectId(id), org_id })

            if (!response.acknowledged) return responseHandler.failedRequest({
                name: 'deleteSite',
                req, res,
                message: "Failed to delete site"
            })

            return responseHandler.successRequest({
                name: 'deleteSite',
                req, res,
                message: "Site deleted successfully"
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'deleteSite', req, res })
        }
    }
}

module.exports = Sites;