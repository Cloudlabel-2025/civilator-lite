require('dotenv')

const config = require('config')
const mongoCollections = config.get('mongoCollections')
const { ObjectId } = require('mongodb')
const Utils = require("../../helpers/utils");
const PayloadValidator = require('../../helpers/PayloadValidator')
const payloadValidator = new PayloadValidator()

const ResponseHandler = require('../../helpers/ResponseHandler')
const responseHandler = new ResponseHandler()

class Attendances {

    async create(req, res) {
        try {
            const isPayloadInvalid = await payloadValidator.Validate({ name: 'createAttendance', req, res, payload: req.body })
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

            const response = await req.mongoDB.insertOne(mongoCollections.ATTENDANCES, insertData)

            if (!response.acknowledged) return responseHandler.failedRequest({
                name: 'createAttendance',
                req, res,
                message: "Failed to create attendance"
            })

            return responseHandler.successRequest({
                name: 'createAttendance',
                req, res,
                message: "Attendance created successfully",
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'createAttendance', req, res })
        }
    }

    async getAll(req, res) {
        try {
            const { org_id } = req
            const { id, search, status, date, type } = req.query

            const filters = { org_id }

            if (id) filters._id = ObjectId(id)
            if (status) filters.status = status
            if (type) filters.type = type
            if (search) {
                filters.$or = [
                    { name: { $regex: search, $options: 'i' } },
                    { phone: { $regex: search, $options: 'i' } },
                    { type_name: { $regex: search, $options: 'i' } },
                    { vendor_id: { $regex: search, $options: 'i' } },
                    { vendor_name: { $regex: search, $options: 'i' } },
                    { "labours.labour_name": { $regex: search, $options: 'i' } },
                ]
            }

            let pipeline = [{ $match: filters }]

            if (date) {
                pipeline.push({
                    $addFields: {
                        attendance_records: {
                            $ifNull: [
                                {
                                    $getField: {
                                        field: date,   // 👈 dynamic date from query
                                        input: "$attendance_records"
                                    }
                                },
                                {}
                            ]
                        }
                    }
                })
            }

            let response = await req.mongoDB.aggregate(
                mongoCollections.ATTENDANCES,
                pipeline
            )

            response = response?.map(item => {

                item.id = item._id

                delete item._id

                return item


            })

            return responseHandler.successRequest({
                name: 'getAllAttendances',
                req, res,
                message: "Attendances retrieved successfully",
                data: {
                    items: response
                }
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'getAllAttendances', req, res })
        }
    }


    async update(req, res) {
        try {
            const isPayloadInvalid = await payloadValidator.Validate({ name: 'updateAttendance', req, res, payload: req.body })
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

            const response = await req.mongoDB.updateOne(mongoCollections.ATTENDANCES, { _id: ObjectId(id), org_id }, { $set: updateData })

            if (!response.acknowledged) return responseHandler.failedRequest({
                name: 'updateAttendance',
                req, res,
                message: "Failed to update attendance"
            })

            return responseHandler.successRequest({
                name: 'updateAttendance',
                req, res,
                message: "Attendance updated successfully"
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'updateAttendance', req, res })
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.body
            const { org_id } = req

            const response = await req.mongoDB.deleteOne(mongoCollections.ATTENDANCES, { _id: ObjectId(id), org_id })

            if (!response.acknowledged) return responseHandler.failedRequest({
                name: 'deleteAttendance',
                req, res,
                message: "Failed to delete attendance"
            })

            return responseHandler.successRequest({
                name: 'deleteAttendance',
                req, res,
                message: "Attendance deleted successfully"
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'deleteAttendance', req, res })
        }
    }


    async markAttendance(req, res) {
        try {
            const isPayloadInvalid = await payloadValidator.Validate({ name: 'markAttendance', req, res, payload: req.body })
            if (isPayloadInvalid) return isPayloadInvalid

            const { org_id, user_id, user_name } = req
            const { id, date, data } = req.body

            const get_attendance = await req.mongoDB.findOne(mongoCollections.ATTENDANCES, { _id: ObjectId(id), org_id }, { project: { attendance_records: 1 } })

            if (!get_attendance) return responseHandler.failedRequest({
                name: 'markAttendance',
                req, res,
                message: "Attendance not found"
            })

            let attendance_records = get_attendance.attendance_records || {}
            attendance_records[date] = data

            const updateData = {
                attendance_records,
                updated_by_id: user_id,
                updated_by_name: user_name,
                updated_at: new Date()
            }

            const response = await req.mongoDB.updateOne(mongoCollections.ATTENDANCES, { _id: ObjectId(id), org_id }, { $set: updateData })

            if (!response.acknowledged) return responseHandler.failedRequest({
                name: 'markAttendance',
                req, res,
                message: "Failed to mark attendance"
            })

            return responseHandler.successRequest({
                name: 'markAttendance',
                req, res,
                message: "Attendance marked successfully"
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'markAttendance', req, res })
        }
    }
}

module.exports = Attendances;