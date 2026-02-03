require('dotenv')

const config = require('config')
const mongoCollections = config.get('mongoCollections')
const { ObjectId } = require('mongodb')
const Utils = require("../../helpers/utils");
const PayloadValidator = require('../../helpers/PayloadValidator')
const payloadValidator = new PayloadValidator()

const ResponseHandler = require('../../helpers/ResponseHandler')
const responseHandler = new ResponseHandler()

class Employees {

    async create(req, res) {
        try {
            const isPayloadInvalid = await payloadValidator.Validate({ name: 'createEmployee', req, res, payload: req.body })
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

            const response = await req.mongoDB.insertOne(mongoCollections.EMPLOYEES, insertData)

            if (!response.acknowledged) return responseHandler.failedRequest({
                name: 'createEmployee',
                req, res,
                message: "Failed to create employee"
            })

            return responseHandler.successRequest({
                name: 'createEmployee',
                req, res,
                message: "Employee created successfully",
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'createEmployee', req, res })
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

            const response = await req.mongoDB.find(mongoCollections.EMPLOYEES, filters)

            return responseHandler.successRequest({
                name: 'getAllEmployees',
                req, res,
                message: "Employees retrieved successfully",
                data: response
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'getAllEmployees', req, res })
        }
    }


    async update(req, res) {
        try {
            const isPayloadInvalid = await payloadValidator.Validate({ name: 'updateEmployee', req, res, payload: req.body })
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

            const response = await req.mongoDB.updateOne(mongoCollections.EMPLOYEES, { _id: ObjectId(id), org_id }, { $set: updateData })

            if (!response.acknowledged) return responseHandler.failedRequest({
                name: 'updateEmployee',
                req, res,
                message: "Failed to update employee"
            })

            return responseHandler.successRequest({
                name: 'updateEmployee',
                req, res,
                message: "Employee updated successfully"
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'updateEmployee', req, res })
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.body
            const { org_id } = req

            const response = await req.mongoDB.deleteOne(mongoCollections.EMPLOYEES, { _id: ObjectId(id), org_id })

            if (!response.acknowledged) return responseHandler.failedRequest({
                name: 'deleteEmployee',
                req, res,
                message: "Failed to delete employee"
            })

            return responseHandler.successRequest({
                name: 'deleteEmployee',
                req, res,
                message: "Employee deleted successfully"
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'deleteEmployee', req, res })
        }
    }
}

module.exports = Employees;