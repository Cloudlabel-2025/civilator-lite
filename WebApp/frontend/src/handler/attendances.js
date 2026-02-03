
import ApiHandler from '../helpers/ApiHandler'

class AttendancesHandler {

    constructor() {
        this.apiHandler = new ApiHandler()

        this.end_point = "/attendances"


        this.get = this.get.bind(this)
        this.post = this.post.bind(this)
        this.markAttendance = this.markAttendance.bind(this)
        this.put = this.put.bind(this)
        this.delete = this.delete.bind(this)
    }

    async get(params) {

        const response = await this.apiHandler.request({
            method: 'GET',
            endpoint: this.end_point,
            params: params,

        })

        return response
    }
    async post(params) {

        const response = await this.apiHandler.request({
            method: 'POST',
            endpoint: this.end_point,
            params: params,

        })

        return response
    }
    async markAttendance(params) {

        const response = await this.apiHandler.request({
            method: 'POST',
            endpoint: this.end_point + "/mark",
            params: params,

        })

        return response
    }
    async put(params) {

        const response = await this.apiHandler.request({
            method: 'PUT',
            endpoint: this.end_point,
            params: params,

        })

        return response
    }
    async delete(params) {

        const response = await this.apiHandler.request({
            method: 'DELETE',
            endpoint: this.end_point,
            params: params,

        })

        return response
    }


}

export default AttendancesHandler;