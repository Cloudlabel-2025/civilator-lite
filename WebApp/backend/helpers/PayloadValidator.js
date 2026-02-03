
const Schemas = require('../schemas/schemas')
const ResponseHandler = require('./ResponseHandler')
const responseHandler = new ResponseHandler()

class PayloadValidator {

  async Validate({ name, req, res, payload }) {

    const { error } = Schemas[name].validate(payload)

    console.log(error, 'error');


    const Valid = error ? false : true

    if (!Valid) {

      return responseHandler.invalidParams({ req, res, name })

    }

    return false

  }
}





module.exports = PayloadValidator;