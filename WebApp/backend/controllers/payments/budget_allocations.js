require('dotenv')

const config = require('config')
const mongoCollections = config.get('mongoCollections')
const PayloadValidator = require('../../helpers/PayloadValidator')
const payloadValidator = new PayloadValidator()
const { ObjectId } = require('mongodb')
const ResponseHandler = require('../../helpers/ResponseHandler')
const responseHandler = new ResponseHandler()

class BudgetAllocations {

    async create(req, res) {
        try {
            const isPayloadInvalid = await payloadValidator.Validate({ name: 'createBudgetAllocation', req, res, payload: req.body })
            if (isPayloadInvalid) return isPayloadInvalid

            const { org_id, user_id, user_name } = req

            const insertData = {
                ...req.body,
                status: 'pending',
                org_id,
                created_by_id: user_id,
                created_by_name: user_name,
                created_at: new Date(),
                updated_at: new Date()
            }

            const response = await req.mongoDB.insertOne(mongoCollections.BUDGET_ALLOCATIONS, insertData)

            if (!response.acknowledged) return responseHandler.failedRequest({
                name: 'createBudgetAllocation',
                req, res,
                message: "Failed to allocate budget"
            })

            const allocationId = response.insertedId

            // Trigger Notification
            try {
                const { site_id, employee_id, amount, transaction_id } = req.body

                // Fetch Employee & Site Info
                const [employee, site] = await Promise.all([
                    req.mongoDB.findOne(mongoCollections.EMPLOYEES, { _id: new ObjectId(employee_id), org_id }),
                    req.mongoDB.findOne(mongoCollections.SITES, { _id: new ObjectId(site_id), org_id })
                ])

                if (employee) {
                    const siteName = site ? site.name : 'N/A'
                    const message = `₹${amount} has been allocated to you for Site ${siteName}. Transaction ID: ${transaction_id || 'N/A'}`

                    // Create In-App Notification
                    try {
                        let targetUser = await req.mongoDB.findOne(mongoCollections.USERS, { email: { $regex: new RegExp("^" + employee.email + "$", "i") } })

                        // Proactive sync: If user doesn't exist in USERS, create them from EMPLOYEES data
                        if (!targetUser) {
                            console.log(`[BudgetAllocations] Proactively syncing employee to USERS for notification: ${employee.email}`);
                            const newUserData = {
                                name: employee.name,
                                email: employee.email,
                                phone: employee.phone,
                                role_type: 'user',
                                role_id: employee.role_id,
                                org_id: org_id,
                                status: 1,
                                onboarding_status: '1',
                                created_at: new Date(),
                                updated_at: new Date()
                            }
                            const userResponse = await req.mongoDB.insertOne(mongoCollections.USERS, newUserData)
                            if (userResponse.acknowledged) {
                                targetUser = { _id: userResponse.insertedId, ...newUserData }
                            }
                        }

                        if (targetUser) {
                            const notificationData = {
                                title: 'Budget Allocated',
                                message: message,
                                target_user_id: String(targetUser._id), // Store as string to match req.user_id format
                                org_id: org_id,
                                status: 'unread',
                                type: 'budget_allocation',
                                allocation_id: String(allocationId),
                                created_at: new Date(),
                                updated_at: new Date()
                            }
                            await req.mongoDB.insertOne(mongoCollections.NOTIFICATIONS, notificationData)
                            console.log(`[BudgetAllocations] In-app notification created for ${employee.email} (User ID: ${targetUser._id})`);
                        } else {
                            console.log(`[BudgetAllocations] Failed to resolve target user for ${employee.email}`)
                        }
                    } catch (inAppErr) {
                        console.error("[BudgetAllocations] In-App Notification failed:", inAppErr)
                    }
                } else {
                    console.log(`[BudgetAllocations] Employee not found for ID: ${employee_id}`)
                }
            } catch (notifyErr) {
                console.error("[BudgetAllocations] Notification process failed:", notifyErr)
            }

            return responseHandler.successRequest({
                name: 'createBudgetAllocation',
                req, res,
                message: "Budget allocated successfully",
                data: insertData
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'createBudgetAllocation', req, res })
        }
    }

    async getAll(req, res) {
        try {
            const { org_id } = req
            const { id, site_id, employee_id } = req.query

            const filters = {
                org_id
            }

            if (id) filters._id = new ObjectId(id)
            if (site_id) filters.site_id = site_id
            if (employee_id) filters.employee_id = employee_id

            const response = await req.mongoDB.find(mongoCollections.BUDGET_ALLOCATIONS, filters)

            return responseHandler.successRequest({
                name: 'getAllBudgetAllocations',
                req, res,
                message: "Budget allocations retrieved successfully",
                data: response
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'getAllBudgetAllocations', req, res })
        }
    }

    async update(req, res) {
        try {
            const isPayloadInvalid = await payloadValidator.Validate({ name: 'updateBudgetAllocation', req, res, payload: req.body })
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

            const response = await req.mongoDB.updateOne(mongoCollections.BUDGET_ALLOCATIONS, { _id: new ObjectId(id), org_id }, { $set: updateData })

            if (!response.acknowledged) return responseHandler.failedRequest({
                name: 'updateBudgetAllocation',
                req, res,
                message: "Failed to update budget allocation"
            })

            return responseHandler.successRequest({
                name: 'updateBudgetAllocation',
                req, res,
                message: "Budget allocation updated successfully"
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'updateBudgetAllocation', req, res })
        }
    }

    async accept(req, res) {
        try {
            const { id } = req.body
            const { org_id, user_id } = req

            // Verify that this allocation is actually for the logged-in user (employee)
            const allocationFilter = { _id: new ObjectId(id), org_id }
            const allocation = await req.mongoDB.findOne(mongoCollections.BUDGET_ALLOCATIONS, allocationFilter)

            if (!allocation) return responseHandler.failedRequest({ name: 'acceptBudgetAllocation', req, res, message: "Allocation not found" })

            // Find employee record for this user
            const userDetails = await req.mongoDB.findOne(mongoCollections.USERS, { _id: new ObjectId(user_id) })

            // Search employee by email (case-insensitive)
            const employee = await req.mongoDB.findOne(mongoCollections.EMPLOYEES, {
                email: { $regex: new RegExp("^" + userDetails.email + "$", "i") },
                org_id
            })

            if (!employee || String(allocation.employee_id) !== String(employee._id)) {
                console.log(`[BudgetAllocations] Auth mismatch: Allocation Employee=${allocation.employee_id}, Logged Employee=${employee ? employee._id : 'None'}`);
                return responseHandler.failedRequest({ name: 'acceptBudgetAllocation', req, res, message: "Unauthorized to accept this allocation" })
            }

            const response = await req.mongoDB.updateOne(
                mongoCollections.BUDGET_ALLOCATIONS,
                { _id: new ObjectId(id), org_id },
                { $set: { status: 'accepted', accepted_at: new Date(), updated_at: new Date() } }
            )

            if (!response.acknowledged) return responseHandler.failedRequest({
                name: 'acceptBudgetAllocation',
                req, res,
                message: "Failed to accept budget allocation"
            })

            // Update associated notification to show "Accepted"
            try {
                await req.mongoDB.updateOne(
                    mongoCollections.NOTIFICATIONS,
                    { allocation_id: id, org_id },
                    { $set: { message: `(ACCEPTED) ₹${allocation.amount} allocated to you for Site ${allocation.site_name || 'Site'}`, status: 'read', updated_at: new Date() } }
                )
            } catch (notifErr) {
                console.error("[BudgetAllocations] Failed to update notification on accept:", notifErr);
            }

            return responseHandler.successRequest({
                name: 'acceptBudgetAllocation',
                req, res,
                message: "Budget allocation accepted successfully"
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'acceptBudgetAllocation', req, res })
        }
    }

    async decline(req, res) {
        try {
            const { id } = req.body
            const { org_id, user_id } = req

            const allocation = await req.mongoDB.findOne(mongoCollections.BUDGET_ALLOCATIONS, { _id: new ObjectId(id), org_id })
            if (!allocation) return responseHandler.failedRequest({ name: 'declineBudgetAllocation', req, res, message: "Allocation not found" })

            const userDetails = await req.mongoDB.findOne(mongoCollections.USERS, { _id: new ObjectId(user_id) })
            const employee = await req.mongoDB.findOne(mongoCollections.EMPLOYEES, {
                email: { $regex: new RegExp("^" + userDetails.email + "$", "i") },
                org_id
            })

            if (!employee || String(allocation.employee_id) !== String(employee._id)) {
                return responseHandler.failedRequest({ name: 'declineBudgetAllocation', req, res, message: "Unauthorized to decline this allocation" })
            }

            const response = await req.mongoDB.updateOne(
                mongoCollections.BUDGET_ALLOCATIONS,
                { _id: new ObjectId(id), org_id },
                { $set: { status: 'rejected', rejected_at: new Date(), updated_at: new Date() } }
            )

            if (!response.acknowledged) return responseHandler.failedRequest({
                name: 'declineBudgetAllocation',
                req, res,
                message: "Failed to decline budget allocation"
            })

            // Update associated notification to show "Declined"
            try {
                await req.mongoDB.updateOne(
                    mongoCollections.NOTIFICATIONS,
                    { allocation_id: id, org_id },
                    { $set: { message: `(DECLINED) ₹${allocation.amount} allocated to you for Site ${allocation.site_name || 'Site'}`, status: 'read', updated_at: new Date() } }
                )
            } catch (notifErr) {
                console.error("[BudgetAllocations] Failed to update notification on decline:", notifErr);
            }

            return responseHandler.successRequest({
                name: 'declineBudgetAllocation',
                req, res,
                message: "Budget allocation declined successfully"
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'declineBudgetAllocation', req, res })
        }
    }

    async delete(req, res) {
        try {
            const { id } = req.body
            const { org_id } = req

            const response = await req.mongoDB.deleteOne(mongoCollections.BUDGET_ALLOCATIONS, { _id: new ObjectId(id), org_id })

            if (!response.acknowledged) return responseHandler.failedRequest({
                name: 'deleteBudgetAllocation',
                req, res,
                message: "Failed to delete budget allocation"
            })

            return responseHandler.successRequest({
                name: 'deleteBudgetAllocation',
                req, res,
                message: "Budget allocation deleted successfully"
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'deleteBudgetAllocation', req, res })
        }
    }
}

module.exports = BudgetAllocations;
