import ApiHandler from '../helpers/ApiHandler';

class NotificationsHandler {
    constructor() {
        this.apiHandler = new ApiHandler();
        this.endpoint = "/notifications";
    }

    async getAll() {
        return await this.apiHandler.request({
            method: 'GET',
            endpoint: this.endpoint
        });
    }

    async markAsRead(id) {
        return await this.apiHandler.request({
            method: 'PUT',
            endpoint: `${this.endpoint}/mark-as-read`,
            params: { id }
        });
    }

    async clearAll() {
        return await this.apiHandler.request({
            method: 'DELETE',
            endpoint: `${this.endpoint}/clear-all`
        });
    }

    async acceptBudgetAllocation(allocationId) {
        return await this.apiHandler.request({
            method: 'PUT',
            endpoint: `/budget-allocations/accept`,
            params: { id: allocationId }
        });
    }

    async declineBudgetAllocation(allocationId) {
        return await this.apiHandler.request({
            method: 'PUT',
            endpoint: `/budget-allocations/decline`,
            params: { id: allocationId }
        });
    }
}

export default NotificationsHandler;
