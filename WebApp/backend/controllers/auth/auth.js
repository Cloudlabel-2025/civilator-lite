require('dotenv')

const config = require('config')
const mongoCollections = config.get('mongoCollections')
const Utils = require("../../helpers/utils");
const AuthHelper = require('../../helpers/auth')
const PayloadValidator = require('../../helpers/PayloadValidator')
const payloadValidator = new PayloadValidator()

const ResponseHandler = require('../../helpers/ResponseHandler')
const responseHandler = new ResponseHandler()

const { sendSMS } = require('../../helpers/smsSender')

const SESSION_DURATION = 1000 * 60 * 60 * 24 * 7; // 7 days

class Auth {

    async register(req, res) {

        try {
            const isPayloadInvalid = await payloadValidator.Validate({ name: 'register', req, res, payload: req.body })
            if (isPayloadInvalid) return isPayloadInvalid
            const { email } = req.body


            let check_user_exist_res = await req.mongoDB.findOne(mongoCollections.USERS, { email }, { "$projection": { _id: 0, id: 1, status: 1 } })

            // Only allow login if user exists in database
            if (!check_user_exist_res) {
                return responseHandler.failedRequest({
                    name: 'register',
                    req, res,
                    message: "User not found. Please contact admin for access."
                })
            }

            const verify_otp = Utils.getNumberOTP()

            let login_data = {
                verify_otp: verify_otp,
                status: 1,
                updated_by_id: email,
                updated_by_name: email,
            }
            let response = await req.mongoDB.updateOne(mongoCollections.USERS, { email }, { "$set": login_data })

            if (!response.acknowledged) return responseHandler.failedRequest({
                name: 'register',
                req, res,
                message: "Failed to login, Please try again!"
            })

            // Send OTP via email instead of SMS
            const Mailer = require('../../helpers/mailer')
            const emailResult = await Mailer({
                to: email,
                subject: 'Your Login OTP',
                message: `Your verification OTP is: ${verify_otp}`,
                html: `<h2>Your verification OTP is: <strong>${verify_otp}</strong></h2>`
            })

            if (!emailResult || !emailResult.success) {
                console.log('Email send failed:', emailResult);
                return responseHandler.failedRequest({
                    name: 'register',
                    req, res,
                    message: "Failed to send OTP, Please try again!"
                })
            }

            return responseHandler.successRequest({
                name: 'register',
                req, res,
                message: "Please check your email for OTP!",
            })
        }
        catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'register', req, res })
        }

    }

    async verifyotp(req, res) {
        try {
            const isPayloadInvalid = await payloadValidator.Validate({ name: 'verifyotp', req, res, payload: req.body })
            if (isPayloadInvalid) return isPayloadInvalid
            const { email, otp } = req.body


            const get_user_details_res = await req.mongoDB.findOne(mongoCollections.USERS, { email }, { projection: { _id: 1, name: 1, verify_otp: 1, email: 1, org_id: 1, status: 1, role_type: 1, onboarding_status: 1 } })

            if (!get_user_details_res) return responseHandler.failedRequest({
                name: 'verifyotp',
                req, res,
                message: "No user found, Please try to register!"
            })

            if (get_user_details_res.verify_otp != otp) return responseHandler.failedRequest({
                name: 'verifyotp',
                req, res,
                message: "Invalid OTP, Please try again!"
            })

            const login_token = await AuthHelper.GenerateJWTToken({
                _id: String(get_user_details_res._id),
                org_id: get_user_details_res.org_id,
                name: get_user_details_res.name,
                email: get_user_details_res.email,
                role_type: get_user_details_res.role_type,
            })


            res.cookie("access_token", login_token, { httpOnly: true, expires: new Date(Date.now() + SESSION_DURATION) })
            res.cookie("userdetails", JSON.stringify(get_user_details_res), { httpOnly: true, expires: new Date(Date.now() + SESSION_DURATION) })


            return responseHandler.successRequest({
                name: 'verifyotp',
                req, res,
                message: "Login successfull, Redirecting to dashboard!",
                data: {
                    token: login_token,
                    user_details: get_user_details_res
                }
            })

        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'verifyotp', req, res })
        }

    }

    async onboard(req, res) {
        try {
            const isPayloadInvalid = await payloadValidator.Validate({ name: 'onboard', req, res, payload: req.body })
            if (isPayloadInvalid) return isPayloadInvalid
            const { user_id, user_name, user_email } = req
            const { details } = req.body
            let { name } = details


            const update_data = {
                name: name,
                onboarding_status: '1',
                onboarding_details: JSON.stringify(details || "{}"),
                updated_by_id: user_id,
                updated_by_name: user_name,
            }


            let update_user_details_res = await req.mongoDB.updateOne(mongoCollections.USERS, { _id: user_id }, update_data)

            if (!update_user_details_res.acknowledged) return responseHandler.failedRequest({
                name: 'onboard',
                req, res,
                message: "Failed to onboard, Please try again!"
            })

            return responseHandler.successRequest({
                name: 'onboard',
                req, res,
                message: "Onboarding completed succesfully!",
            })

        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'onboard', req, res })
        }
    }


}

module.exports = Auth;