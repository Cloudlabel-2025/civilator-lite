import ApiHandler from '../helpers/ApiHandler'

class InventoryHandler {

    constructor() {
        this.apiHandler = new ApiHandler()

        this.end_point = "/inventory/procurement"
        this.end_point2 = "/inventory"


        this.get = this.get.bind(this)
        this.post = this.post.bind(this)
        this.put = this.put.bind(this)
        this.delete = this.delete.bind(this)

        this.getInventory = this.getInventory.bind(this)
        this.updateInventory = this.updateInventory.bind(this)
        this.updateInventoryBulk = this.updateInventoryBulk.bind(this)
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
            header_type: 'formdata'

        })

        return response
    }
    async put(params) {

        const response = await this.apiHandler.request({
            method: 'PUT',
            endpoint: this.end_point,
            params: params,
            header_type: 'formdata'

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

    async getInventory(params) {

        const response = await this.apiHandler.request({
            method: 'GET',
            endpoint: this.end_point2,
            params: params,

        })

        return response
    }
    async updateInventory(params) {

        const response = await this.apiHandler.request({
            method: 'PUT',
            endpoint: this.end_point2,
            params: params,

        })

        return response
    }
    async updateInventoryBulk(params) {

        const response = await this.apiHandler.request({
            method: 'PUT',
            endpoint: this.end_point2 + '/bulk',
            params: params,

        })

        return response
    }


}

export default InventoryHandler;