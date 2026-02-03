require('dotenv')

const config = require('config')
const mongoCollections = config.get('mongoCollections')
const Utils = require("../../helpers/utils");
const { ObjectId } = require('mongodb')

const ResponseHandler = require('../../helpers/ResponseHandler')
const responseHandler = new ResponseHandler()

class DashboardController {

    async getSiteDashboard(req, res) {
        try {

            const { org_id } = req

            const { site_id, start_date, end_date } = req.query

            const dashboard_data = {
                site: {
                    site_status_percentage: 0,
                    planned_start_date: '',
                    planned_end_date: '',
                    actual_start_date: '',
                    actual_end_date: '',
                    name: '',
                    status: '',
                    client_id: '',
                    client_name: '',
                    client_phone: '',
                },
                task: {
                    not_started: 0,
                    in_progress: 0,
                    completed: 0,
                    upcoming: 0,
                    delayed: 0,
                },
                finance: {
                    estimated: 0,
                    expenses: 0,
                    received: 0,
                    profit: 0,
                },
                expense_breakdown: {
                    total: 0,
                    material: 0,
                    labor: 0,
                    petty_cash: 0,
                    vendor_advance: 0,
                    other: 0,
                },
                finance_breakdown: {
                    client: {
                        total: 0,
                        paid: 0,
                        pending: 0,
                    },
                    labour: {
                        total: 0,
                        paid: 0,
                        pending: 0,
                    },
                    material: {
                        total: 0,
                        paid: 0,
                        pending: 0,
                    },
                },
                labour_attendance: [],
                overdue_payments: [],
                delayed_tasks: [],
                upcoming_tasks: []
            }

            const now = new Date()
            const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

            // Labour attendance - last 7 days
            const attendance = await req.mongoDB.find(mongoCollections.labour_attendance,
                { site_id: ObjectId(site_id), date: { $gte: sevenDaysAgo } })

            const attendanceMap = {}
            attendance.forEach(record => {
                const dateStr = record.date.toISOString().split('T')[0]
                if (!attendanceMap[dateStr]) attendanceMap[dateStr] = { present: 0, absent: 0, halfday: 0 }
                attendanceMap[dateStr][record.status]++
            })

            dashboard_data.labour_attendance = Object.entries(attendanceMap)
                .map(([date, counts]) => ({ date, ...counts }))

            // Overdue payments
            const [labourPayments, expenses, materials] = await Promise.all([
                req.mongoDB.find(mongoCollections.labour_payments,
                    { site_id: ObjectId(site_id), due_date: { $lt: now }, status: { $ne: 'paid' } }),
                req.mongoDB.find(mongoCollections.expenses,
                    { site_id: ObjectId(site_id), due_date: { $lt: now }, status: { $ne: 'paid' } }),
                req.mongoDB.find(mongoCollections.material_procurement,
                    { site_id: ObjectId(site_id), due_date: { $lt: now }, status: { $ne: 'paid' } })
            ])

            dashboard_data.overdue_payments = [...labourPayments, ...expenses, ...materials]
                .map(item => ({ id: item._id, date: item.due_date, amount: item.amount }))

            // Delayed tasks
            const delayedTasks = await req.mongoDB.find(mongoCollections.tasks,
                { site_id: ObjectId(site_id), end_date: { $lt: now }, status: { $ne: 'completed' } })

            dashboard_data.delayed_tasks = delayedTasks.map(task => ({
                id: task._id,
                date: task.end_date,
                days: Math.ceil((now - task.end_date) / (1000 * 60 * 60 * 24))
            }))

            // Upcoming tasks
            const upcomingTasks = await req.mongoDB.find(mongoCollections.tasks,
                { site_id: ObjectId(site_id), start_date: { $gt: now } })

            dashboard_data.upcoming_tasks = upcomingTasks.map(task => ({
                id: task._id,
                date: task.start_date,
                days: Math.ceil((task.start_date - now) / (1000 * 60 * 60 * 24))
            }))

            return responseHandler.successRequest({
                name: 'getSiteDashboard',
                req, res,
                message: "Site dashboard retrieved successfully",
                data: dashboard_data
            })

        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'getAllMasterbrands', req, res })
        }
    }

}

module.exports = DashboardController;