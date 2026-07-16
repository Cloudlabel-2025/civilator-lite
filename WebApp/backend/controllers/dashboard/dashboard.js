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
            const { site_id } = req.query

            console.log(`[Dashboard] Fetching for Site: ${site_id}, Org: ${org_id}`);

            if (!site_id || !ObjectId.isValid(site_id)) {
                console.log(`[Dashboard] Invalid Site ID: ${site_id}`);
                return responseHandler.failedRequest({
                    name: 'getSiteDashboard',
                    req, res,
                    message: "Invalid or missing site id"
                })
            }

            const now = new Date()
            const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

            // 1. Fetch Site Details for basic info and estimated value
            const site = await req.mongoDB.findOne(mongoCollections.SITES, { _id: new ObjectId(site_id), org_id })

            console.log(`[Dashboard] Site Found: ${site ? site.name : 'NO'}`);

            if (!site) {
                return responseHandler.failedRequest({
                    name: 'getSiteDashboard',
                    req, res,
                    message: "Site not found"
                })
            }

            const dashboard_data = {
                site: {
                    site_status_percentage: site.completionPercentage || 0,
                    planned_start_date: site.startDate || '',
                    planned_end_date: site.endDate || '',
                    actual_start_date: site.actual_start_date || site.startDate || '',
                    actual_end_date: site.actual_end_date || '',
                    name: site.name || '',
                    status: site.status || '',
                    client_id: site.client_id || '',
                    client_name: site.client?.name || '',
                    client_phone: site.client?.phone || '',
                },
                task: {
                    not_started: 0,
                    in_progress: 0,
                    completed: 0,
                    upcoming: 0,
                    delayed: 0,
                },
                finance: {
                    estimated: parseFloat(site.estimateAmount || 0),
                    expenses: 0,
                    received: 0,
                    budget_allocated: 0,
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
                        total: parseFloat(site.estimateAmount || 0),
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
                overdue_payments: [],
                delayed_tasks: [],
                upcoming_tasks: []
            }

            // 2. Fetch Tasks and calculate counts
            const tasksResult = await req.mongoDB.find(mongoCollections.TASKS, { site_id: site_id, org_id })
            const tasks = tasksResult.items || []
            console.log(`[Dashboard] Tasks Found: ${tasks.length}`);
            tasks.forEach(task => {
                if (task.status === 'completed') dashboard_data.task.completed++
                else if (task.status === 'in-progress') dashboard_data.task.in_progress++
                else if (task.status === 'delayed') dashboard_data.task.delayed++
                else if (task.status === 'upcoming') dashboard_data.task.upcoming++
                else dashboard_data.task.not_started++
            })

            // 3. Fetch Expenses and calculate breakdown
            const expensesResult = await req.mongoDB.find(mongoCollections.EXPENSES, { site_id: site_id, org_id })
            const expensesList = expensesResult.items || []
            console.log(`[Dashboard] Expenses Found: ${expensesList.length}`);
            expensesList.forEach(exp => {
                const amount = parseFloat(exp.amount || 0)
                dashboard_data.finance.expenses += amount
                dashboard_data.expense_breakdown.total += amount

                const cat = exp.category?.toLowerCase() || ''
                if (cat.includes('material')) dashboard_data.expense_breakdown.material += amount
                else if (cat.includes('labor') || cat.includes('labour')) dashboard_data.expense_breakdown.labor += amount
                else if (cat.includes('petty')) dashboard_data.expense_breakdown.petty_cash += amount
                else if (cat.includes('advance')) dashboard_data.expense_breakdown.vendor_advance += amount
                else dashboard_data.expense_breakdown.other += amount
            })

            // 4. Fetch Payments (Total Site Funds)
            const paymentsResult = await req.mongoDB.find(mongoCollections.PAYMENTS, { site_id: site_id, org_id })
            const payments = paymentsResult.items || []
            console.log(`[Dashboard] Payments Found: ${payments.length}`);

            let totalIncome = 0
            payments.forEach(payment => {
                const amount = parseFloat(payment.amount || 0)
                if (payment.payment_from === 'return') {
                    // Return doesn't add to totalIncome inflow, it's a deduction from builder investment
                    // But user wants it added to client revenue tracking
                    dashboard_data.finance_breakdown.client.paid += amount
                } else {
                    totalIncome += amount
                    if (payment.payment_from === 'client') {
                        dashboard_data.finance_breakdown.client.paid += amount
                    }
                }
            })
            dashboard_data.finance.received = totalIncome
            dashboard_data.finance_breakdown.client.pending = dashboard_data.finance_breakdown.client.total - (dashboard_data.finance_breakdown.client.paid)

            // 5. Fetch Budget Allocations (Only Accepted)
            const budgetResults = await req.mongoDB.find(mongoCollections.BUDGET_ALLOCATIONS, { site_id: site_id, org_id, status: 'accepted' })
            const budgetList = budgetResults.items || []
            let totalAllocated = 0;
            budgetList.forEach(budget => {
                totalAllocated += parseFloat(budget.amount || 0)
                // Note: We keep the user's previous request to reduce this from "received" funds logic if still needed, 
                // but usually, budget allocated is a subset of received funds.
            })

            // Budget Allocated card now shows REMAINING budget (Total Allocated - Total Expenses)
            dashboard_data.finance.budget_allocated = totalAllocated - dashboard_data.finance.expenses;

            // 6. Calculate Profit (Received from Client - Total Expenses)
            dashboard_data.finance.profit = dashboard_data.finance.received - dashboard_data.finance.expenses


            // 7. Delayed tasks details
            dashboard_data.delayed_tasks = tasks
                .filter(task => task.status === 'delayed' || (task.status !== 'completed' && task.end_date && new Date(task.end_date) < now))
                .map(task => ({
                    name: task.name,
                    date: task.end_date,
                    days: task.end_date ? Math.ceil((now - new Date(task.end_date)) / (1000 * 60 * 60 * 24)) : 0
                }))

            return responseHandler.successRequest({
                name: 'getSiteDashboard',
                req, res,
                message: "Site dashboard retrieved successfully",
                data: dashboard_data
            })

        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'getSiteDashboard', req, res })
        }
    }

}

module.exports = DashboardController;