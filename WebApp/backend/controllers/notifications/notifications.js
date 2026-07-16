require('dotenv')
const config = require('config')
const mongoCollections = config.get('mongoCollections')
const { ObjectId } = require('mongodb')
const ResponseHandler = require('../../helpers/ResponseHandler')
const responseHandler = new ResponseHandler()

class NotificationsController {

    async getAll(req, res) {
        try {
            const { user_id, org_id } = req

            const filters = {
                target_user_id: user_id,
                org_id
            }

            const response = await req.mongoDB.find(mongoCollections.NOTIFICATIONS, filters, { sort: { created_at: -1 } })

            return responseHandler.successRequest({
                name: 'getAllNotifications',
                req, res,
                message: "Notifications retrieved successfully",
                data: response
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'getAllNotifications', req, res })
        }
    }

    async markAsRead(req, res) {
        try {
            const { id } = req.body
            const { user_id, org_id } = req

            const response = await req.mongoDB.updateOne(
                mongoCollections.NOTIFICATIONS,
                { _id: new ObjectId(id), target_user_id: user_id, org_id },
                { $set: { status: 'read', updated_at: new Date() } }
            )

            if (!response.acknowledged) return responseHandler.failedRequest({
                name: 'markNotificationAsRead',
                req, res,
                message: "Failed to mark notification as read"
            })

            return responseHandler.successRequest({
                name: 'markNotificationAsRead',
                req, res,
                message: "Notification marked as read"
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'markNotificationAsRead', req, res })
        }
    }

    async clearAll(req, res) {
        try {
            const { user_id, org_id } = req

            const response = await req.mongoDB.deleteMany(
                mongoCollections.NOTIFICATIONS,
                { target_user_id: user_id, org_id }
            )

            if (!response.acknowledged) return responseHandler.failedRequest({
                name: 'clearAllNotifications',
                req, res,
                message: "Failed to clear notifications"
            })

            return responseHandler.successRequest({
                name: 'clearAllNotifications',
                req, res,
                message: "Notifications cleared successfully"
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'clearAllNotifications', req, res })
        }
    }
}

module.exports = NotificationsController;
