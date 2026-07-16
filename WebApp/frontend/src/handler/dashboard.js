
import ApiHandler from '../helpers/ApiHandler'

class DashboardHandler {

    constructor() {
        this.apiHandler = new ApiHandler()
        this.end_point = "/dashboard"
    }

    async getSiteDashboard(params) {
        const response = await this.apiHandler.request({
            method: 'GET',
            endpoint: `${this.end_point}/site`,
            params: params,
        })
        return response
    }
}

export default DashboardHandler;
