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

            // Sync with USERS collection to enable login
            try {
                const userData = {
                    name: insertData.name,
                    email: insertData.email,
                    phone: insertData.phone,
                    role_type: 'user',
                    role_id: insertData.role_id,
                    org_id: org_id,
                    status: 1,
                    onboarding_status: '1',
                    created_at: new Date(),
                    updated_at: new Date()
                }
                await req.mongoDB.insertOne(mongoCollections.USERS, userData)
            } catch (userSyncErr) {
                console.error("[Employees] User sync failed:", userSyncErr)
                // We don't fail the whole request if user sync fails, but we log it
            }

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

            if (id) filters._id = new ObjectId(id)
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

            const response = await req.mongoDB.updateOne(mongoCollections.EMPLOYEES, { _id: new ObjectId(id), org_id }, { $set: updateData })

            if (!response.acknowledged) return responseHandler.failedRequest({
                name: 'updateEmployee',
                req, res,
                message: "Failed to update employee"
            })

            // Sync with USERS collection
            try {
                const employee = await req.mongoDB.findOne(mongoCollections.EMPLOYEES, { _id: new ObjectId(id) })
                if (employee && employee.email) {
                    await req.mongoDB.updateOne(mongoCollections.USERS,
                        { email: employee.email },
                        {
                            $set: {
                                name: updateData.name || employee.name,
                                role_id: updateData.role_id || employee.role_id,
                                phone: updateData.phone || employee.phone,
                                updated_at: new Date()
                            }
                        }
                    )
                }
            } catch (userSyncErr) {
                console.error("[Employees] User update sync failed:", userSyncErr)
            }

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

            const employee = await req.mongoDB.findOne(mongoCollections.EMPLOYEES, { _id: new ObjectId(id), org_id })
            const response = await req.mongoDB.deleteOne(mongoCollections.EMPLOYEES, { _id: new ObjectId(id), org_id })

            if (!response.acknowledged) return responseHandler.failedRequest({
                name: 'deleteEmployee',
                req, res,
                message: "Failed to delete employee"
            })

            // Sync with USERS collection (Remove user access)
            try {
                if (employee && employee.email) {
                    await req.mongoDB.deleteOne(mongoCollections.USERS, { email: employee.email })
                }
            } catch (userSyncErr) {
                console.error("[Employees] User delete sync failed:", userSyncErr)
            }

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