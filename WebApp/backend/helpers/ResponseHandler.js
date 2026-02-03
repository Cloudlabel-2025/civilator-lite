
const { logger, setLog } = require('./logger')

class ResponseHandler {

    async invalidParams({ req, res, message, name }) {

        message = message || "Invalid parameters. Please try again."
        logger.error(message, { payload: req.body, name })

        return res.status(400).json({
            "success": false,
            "message": message,
        })
    }

    async failedRequest({ req, res, message, name }) {

        message = message || "Invalid parameters. Please try again."
        logger.error(message, { payload: req.body, name })

        return res.status(400).json({
            "success": false,
            "message": message || "Failed request",
        })
    }

    async serverError({ req, res, message, name }) {
        return res.status(500).json({
            "success": false,
            "message": message || "Internal Server Error. Please try again.",
        })
    }

    async successRequest({ req, res, message, data, name, summary_data }) {
        return res.status(200).json({
            "success": true,
            "message": message || "Successfull request",
            "data": data || undefined,
            "summary_data": summary_data || undefined
        })
    }

}

module.exports = ResponseHandler