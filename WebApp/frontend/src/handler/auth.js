
import ApiHandler from '../helpers/ApiHandler'

class AuthHandler {

    constructor() {
        this.apiHandler = new ApiHandler()
    }

    async login(params) {

        const response = await this.apiHandler.request({
            method: 'POST',
            endpoint: "/auth/login",
            params: params,
            has_token: false,
        })

        return response
    }
    async verify(params) {

        const response = await this.apiHandler.request({
            method: 'POST',
            endpoint: "/auth/verifyotp",
            params: params,
            has_token: false,
        })

        return response
    }
    async onboard(params) {

        const response = await this.apiHandler.request({
            method: 'POST',
            endpoint: "/auth/onboard",
            params: params,
        })

        return response
    }

}

export default AuthHandler;