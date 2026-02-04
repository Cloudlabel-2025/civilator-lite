require('dotenv')

const config = require('config')
const mongoCollections = config.get('mongoCollections')
const PayloadValidator = require('../../helpers/PayloadValidator')
const payloadValidator = new PayloadValidator()
const { ObjectId } = require('mongodb')
const ResponseHandler = require('../../helpers/ResponseHandler')
const responseHandler = new ResponseHandler()

class Settings {

    async get_profile(req, res) {
        try {
            const { user_id } = req
            console.log(user_id);


            const response = await req.mongoDB.findOne(
                mongoCollections.USERS,
                { _id: new ObjectId(user_id) }
            )

            if (!response) return responseHandler.failedRequest({
                name: 'getProfile',
                req, res,
                message: "Profile not found"
            })

            return responseHandler.successRequest({
                name: 'getProfile',
                req, res,
                message: "Profile retrieved successfully",
                data: response
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'getProfile', req, res })
        }
    }

    async get_company(req, res) {
        try {
            const { org_id } = req


            console.log(org_id);

            const response = await req.mongoDB.findOne(
                mongoCollections.ORG,
                { _id: new ObjectId(org_id) }
            )

            if (!response) return responseHandler.failedRequest({
                name: 'getCompany',
                req, res,
                message: "Company not found"
            })

            return responseHandler.successRequest({
                name: 'getCompany',
                req, res,
                message: "Company retrieved successfully",
                data: response
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'getCompany', req, res })
        }
    }

    async update_profile(req, res) {
        try {
            const isPayloadInvalid = await payloadValidator.Validate({ name: 'updateProfile', req, res, payload: req.body })
            if (isPayloadInvalid) return isPayloadInvalid

            const { user_id } = req
            const { name, phone, email, photo } = req.body

            const updateData = {
                name,
                phone,
                email,
                photo,
                updated_at: new Date()
            }

            const response = await req.mongoDB.updateOne(
                mongoCollections.USERS,
                { _id: new ObjectId(user_id) },
                { $set: updateData }
            )

            if (!response.acknowledged) return responseHandler.failedRequest({
                name: 'updateProfile',
                req, res,
                message: "Failed to update profile"
            })

            return responseHandler.successRequest({
                name: 'updateProfile',
                req, res,
                message: "Profile updated successfully"
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'updateProfile', req, res })
        }
    }

    async update_company(req, res) {
        try {
            const isPayloadInvalid = await payloadValidator.Validate({ name: 'updateCompany', req, res, payload: req.body })
            if (isPayloadInvalid) return isPayloadInvalid

            const { org_id, user_id, user_name } = req
            const { name, phone, email, address, gstin, panNumber, website, logo } = req.body

            const updateData = {
                name,
                phone,
                email,
                address,
                gstin,
                panNumber,
                website,
                logo,
                updated_by_id: user_id,
                updated_by_name: user_name,
                updated_at: new Date()
            }

            const response = await req.mongoDB.updateOne(
                mongoCollections.ORG,
                { _id: new ObjectId(org_id) },
                { $set: updateData }
            )

            if (!response.acknowledged) return responseHandler.failedRequest({
                name: 'updateCompany',
                req, res,
                message: "Failed to update company"
            })

            return responseHandler.successRequest({
                name: 'updateCompany',
                req, res,
                message: "Company updated successfully"
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'updateCompany', req, res })
        }
    }
}

module.exports = Settings;