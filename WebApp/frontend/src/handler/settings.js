import ApiHandler from '../helpers/ApiHandler'

class SettingsHandler {

    constructor() {
        this.apiHandler = new ApiHandler()
        this.end_point = "/settings"
        this.get_profile = this.get_profile.bind(this)
        this.get_company = this.get_company.bind(this)
        this.update_profile = this.update_profile.bind(this)
        this.update_company = this.update_company.bind(this)
    }

    async get_profile() {
        const response = await this.apiHandler.request({
            method: 'GET',
            endpoint: this.end_point + '/get-profile',
        })
        return response
    }

    async get_company() {
        const response = await this.apiHandler.request({
            method: 'GET',
            endpoint: this.end_point + '/get-company',
        })
        return response
    }

    async update_profile(params) {
        const response = await this.apiHandler.request({
            method: 'PUT',
            endpoint: this.end_point + '/update-profile',
            params: params,
        })
        return response
    }

    async update_company(params) {
        const response = await this.apiHandler.request({
            method: 'PUT',
            endpoint: this.end_point + '/update-company',
            params: params,
        })
        return response
    }
}

export default SettingsHandler;