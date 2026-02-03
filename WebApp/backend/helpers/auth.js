const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require('dotenv').config();

const config = require("config");
const authConfig = config.get("authConfig")

const Auth = {

    HashPassword: async (password) => {

        const salt = await bcrypt.genSalt(10)

        const hassed = await new Promise((resovle, reject) => {
            bcrypt.hash(password, salt).then((r) => {
                return resovle(r);
            }).catch(err => reject(err))
        })

        return hassed
    },
    ComparePassword: async (password, hash) => {

        const result = await bcrypt.compare(password, hash)

        return result;
    },
    GenerateJWTToken: async (payload = '') => {

        if (!payload) return false

        let token = new Promise((resolve, reject) => {
            return jwt.sign(
                payload, authConfig.AUTH_SECRET,
                {
                    expiresIn: '30d',
                    algorithm: "HS256"
                },
                function (err, token) {

                    if (err) reject(err)
                    else resolve(token)
                }
            )
        })


        return token
    },
    GenerateOTP: () => {

        return Math.floor(100000 + Math.random() * 900000)
    },
    ValidateJWT: async (token) => {
        try {

            let response = new Promise((resolve, reject) => {
                return jwt.verify(token, authConfig.AUTH_SECRET, function (err, token) {
                    if (err) reject(err)
                    resolve(token)
                })

            })

            response = await response

            return {
                success: true,
                message: "Token Validated Successfully",
                data: response
            }

        } catch (error) {
            return {
                success: false,
                message: error.message
            }
        }
    }

}
module.exports = Auth