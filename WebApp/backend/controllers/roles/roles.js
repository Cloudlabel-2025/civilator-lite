require('dotenv')

const config = require('config')
const mongoCollections = config.get('mongoCollections')
const { ObjectId } = require('mongodb')
const Utils = require("../../helpers/utils");
const PayloadValidator = require('../../helpers/PayloadValidator')
const payloadValidator = new PayloadValidator()

const ResponseHandler = require('../../helpers/ResponseHandler')
const responseHandler = new ResponseHandler()

class Roles {

    async create(req, res) {
        try {
            const isPayloadInvalid = await payloadValidator.Validate({ name: 'createRole', req, res, payload: req.body })
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

            const response = await req.mongoDB.insertOne(mongoCollections.ROLES, insertData)

            if (!response.acknowledged) return responseHandler.failedRequest({
                name: 'createRole',
                req, res,
                message: "Failed to create role"
            })

            return responseHandler.successRequest({
                name: 'createRole',
                req, res,
                message: "Role created successfully",
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'createRole', req, res })
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

            const response = await req.mongoDB.find(mongoCollections.ROLES, filters)

            return responseHandler.successRequest({
                name: 'getAllRoles',
                req, res,
                message: "Roles retrieved successfully",
                data: response
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'getAllRoles', req, res })
        }
    }


    async update(req, res) {
        try {
            const isPayloadInvalid = await payloadValidator.Validate({ name: 'updateRole', req, res, payload: req.body })
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

            const response = await req.mongoDB.updateOne(mongoCollections.ROLES, { _id: ObjectId(id), org_id }, { $set: updateData })

            if (!response.acknowledged) return responseHandler.failedRequest({
                name: 'updateRole',
                req, res,
                message: "Failed to update role"
            })

            return responseHandler.successRequest({
                name: 'updateRole',
                req, res,
                message: "Role updated successfully"
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'updateRole', req, res })
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.body
            const { org_id } = req

            const response = await req.mongoDB.deleteOne(mongoCollections.ROLES, { _id: ObjectId(id), org_id })

            if (!response.acknowledged) return responseHandler.failedRequest({
                name: 'deleteRole',
                req, res,
                message: "Failed to delete role"
            })

            return responseHandler.successRequest({
                name: 'deleteRole',
                req, res,
                message: "Role deleted successfully"
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'deleteRole', req, res })
        }
    }
}

module.exports = Roles;