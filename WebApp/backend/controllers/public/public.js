require('dotenv')

const config = require('config')
const mongoCollections = config.get('mongoCollections')
const Utils = require("../../helpers/utils");
const { ObjectId } = require('mongodb')
const PayloadValidator = require('../../helpers/PayloadValidator')
const payloadValidator = new PayloadValidator()

const ResponseHandler = require('../../helpers/ResponseHandler')
const responseHandler = new ResponseHandler()

class PublicController {

    async createContactUs(req, res) {
        try {

            const isPayloadInvalid = await payloadValidator.Validate({ name: 'createContactUs', req, res, payload: req.body })
            if (isPayloadInvalid) return isPayloadInvalid

            const insertData = {
                ...req.body,
                created_at: new Date(),
            }


            const response = await req.mongoDB.insertOne(mongoCollections.CONTACT_US, insertData)

            if (!response.acknowledged) return responseHandler.failedRequest({
                name: 'createContactUs',
                req, res,
                message: "Failed to create contact us"
            })

            return responseHandler.successRequest({
                name: 'createContactUs',
                req, res,
                message: "Contact us created successfully",
                data: insertData
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'createContactUs', req, res })
        }
    }
    async createRequestDemo(req, res) {
        try {

            const isPayloadInvalid = await payloadValidator.Validate({ name: 'createRequestDemo', req, res, payload: req.body })
            if (isPayloadInvalid) return isPayloadInvalid

            const insertData = {
                ...req.body,
                created_at: new Date(),
            }


            const response = await req.mongoDB.insertOne(mongoCollections.CONTACT_US, insertData)

            if (!response.acknowledged) return responseHandler.failedRequest({
                name: 'createRequestDemo',
                req, res,
                message: "Failed to create request demo"
            })

            return responseHandler.successRequest({
                name: 'createRequestDemo',
                req, res,
                message: "Request demo created successfully",
                data: insertData
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'createRequestDemo', req, res })
        }
    }

}

module.exports = PublicController;