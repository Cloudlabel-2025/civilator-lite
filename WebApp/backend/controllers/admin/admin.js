require('dotenv')

const config = require('config')
const mongoCollections = config.get('mongoCollections')
const { ObjectId } = require('mongodb')
const ResponseHandler = require('../../helpers/ResponseHandler')
const responseHandler = new ResponseHandler()

class AdminController {

    async createUser(req, res) {
        try {
            const { name, email, phone } = req.body
            const { org_id, user_id, user_name } = req

            console.log('Create user request:', { name, email, phone, org_id, user_id });

            if (!name || !email) {
                return responseHandler.failedRequest({
                    name: 'createUser',
                    req, res,
                    message: "Name and email are required"
                })
            }

            const existingUser = await req.mongoDB.findOne(mongoCollections.USERS, { email })
            if (existingUser) {
                return responseHandler.failedRequest({
                    name: 'createUser',
                    req, res,
                    message: "User with this email already exists"
                })
            }

            const insertData = {
                name,
                email,
                phone: phone || '',
                role_type: 'admin',
                status: 1,
                onboarding_status: '1',
                org_id,
                created_by_id: user_id,
                created_by_name: user_name,
                created_at: new Date(),
                updated_at: new Date()
            }

            const response = await req.mongoDB.insertOne(mongoCollections.USERS, insertData)

            if (!response.acknowledged) return responseHandler.failedRequest({
                name: 'createUser',
                req, res,
                message: "Failed to create user"
            })

            console.log('User created successfully:', response.insertedId);

            return responseHandler.successRequest({
                name: 'createUser',
                req, res,
                message: "User created successfully"
            })
        } catch (err) {
            console.log('Error creating user:', err);
            return responseHandler.serverError({ name: 'createUser', req, res })
        }
    }

    async getUsers(req, res) {
        try {
            const { org_id } = req

            const response = await req.mongoDB.find(mongoCollections.USERS, { org_id })

            return responseHandler.successRequest({
                name: 'getUsers',
                req, res,
                message: "Users retrieved successfully",
                data: response
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'getUsers', req, res })
        }
    }

    async updateUser(req, res) {
        try {
            const { id, name, email, phone } = req.body
            const { org_id, user_id, user_name } = req

            const updateData = {
                name,
                email,
                phone: phone || '',
                updated_by_id: user_id,
                updated_by_name: user_name,
                updated_at: new Date()
            }

            const response = await req.mongoDB.updateOne(
                mongoCollections.USERS,
                { _id: new ObjectId(id), org_id },
                { $set: updateData }
            )

            if (!response.acknowledged) return responseHandler.failedRequest({
                name: 'updateUser',
                req, res,
                message: "Failed to update user"
            })

            return responseHandler.successRequest({
                name: 'updateUser',
                req, res,
                message: "User updated successfully"
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'updateUser', req, res })
        }
    }

    async deleteUser(req, res) {
        try {
            const { id } = req.body
            const { org_id } = req

            const response = await req.mongoDB.deleteOne(mongoCollections.USERS, { _id: new ObjectId(id), org_id })

            if (!response.acknowledged) return responseHandler.failedRequest({
                name: 'deleteUser',
                req, res,
                message: "Failed to delete user"
            })

            return responseHandler.successRequest({
                name: 'deleteUser',
                req, res,
                message: "User deleted successfully"
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'deleteUser', req, res })
        }
    }
}

module.exports = AdminController;
