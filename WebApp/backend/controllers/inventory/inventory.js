require('dotenv')

const config = require('config')
const mongoCollections = config.get('mongoCollections')
const Utils = require("../../helpers/utils");
const PayloadValidator = require('../../helpers/PayloadValidator')
const payloadValidator = new PayloadValidator()
const { ObjectId } = require('mongodb')
const ResponseHandler = require('../../helpers/ResponseHandler')
const responseHandler = new ResponseHandler()
const AWSS3Uploader = require('../../helpers/awsS3Uploader')
const awsS3Uploader = new AWSS3Uploader()
const path = require('path')

class Inventory {

    async createProcurement(req, res) {
        try {
            const isPayloadInvalid = await payloadValidator.Validate({ name: 'createMaterial', req, res, payload: req.body })
            if (isPayloadInvalid) return isPayloadInvalid

            const { org_id, user_id, user_name } = req
            let attachments = []

            // Handle file uploads if present
            if (req.files && req.files.length > 0) {
                for (const file of req.files) {
                    const fileExtension = path.extname(file.originalname).substring(1)
                    const fileName = path.basename(file.originalname, path.extname(file.originalname))
                    const folderPath = `site_${req.body.site_id}/inventory/`

                    const uploadedUrl = await awsS3Uploader.uploadFile(
                        file,
                        fileName,
                        folderPath,
                        fileExtension
                    )

                    if (uploadedUrl) {
                        attachments.push({
                            url: uploadedUrl,
                            name: file.originalname,
                            type: file.mimetype,
                            size: file.size
                        })
                    }
                }
            }

            let materials = JSON.parse(req.body.materials || "[]")
            let site_id = req.body.site_id

            const insertData = {
                ...req.body,

                materials,
                attachments,
                org_id,
                type: 'procurement',
                created_by_id: user_id,
                created_by_name: user_name,
                created_at: new Date(),
                updated_at: new Date()
            }

            let materialIds = materials.map(item => item.material_id)


            let inventoryMaterials = await req.mongoDB.find(mongoCollections.INVENTORY, { site_id: site_id, material_id: { $in: materialIds }, org_id })
            inventoryMaterials = inventoryMaterials.items || []

            console.log(inventoryMaterials, 'inventoryMaterials');


            const updateInvendtory = async (new_material, inventoryMaterial) => {

                const inventoryInsertData = {
                    material_id: new_material.material_id,
                    material_name: new_material.material_name,
                    material_unit: new_material.material_unit,
                    brand_id: new_material.brand_id,
                    brand_name: new_material.brand_name,
                    site_id: site_id,
                    purchased_quantity: parseFloat(new_material.quantity),
                    balance_quantity: parseFloat(new_material.quantity),
                    used_quantity: 0,
                    org_id,

                    created_by_id: user_id,
                    created_by_name: user_name,
                    created_at: new Date(),
                    updated_at: new Date()
                }

                if (inventoryMaterial) {
                    await req.mongoDB.updateOne(mongoCollections.INVENTORY, { _id: ObjectId(inventoryMaterial.id) }, {
                        $set: {
                            purchased_quantity: parseFloat(inventoryMaterial.purchased_quantity) + parseFloat(new_material.quantity),
                            balance_quantity: parseFloat(inventoryMaterial.balance_quantity) + parseFloat(new_material.quantity),
                            updated_at: new Date()
                        }
                    })
                } else {
                    await req.mongoDB.insertOne(mongoCollections.INVENTORY, inventoryInsertData)
                }
            }

            await Promise.all(materials.map(async new_material => {
                const inventoryMaterial = inventoryMaterials ? inventoryMaterials.find(item => item.material_id == new_material.material_id) : null
                await updateInvendtory(new_material, inventoryMaterial)
            }))

            const response = await req.mongoDB.insertOne(mongoCollections.PROCUREMENT, insertData)

            if (!response.acknowledged) return responseHandler.failedRequest({
                name: 'createMaterial',
                req, res,
                message: "Failed to create material"
            })

            return responseHandler.successRequest({
                name: 'createMaterial',
                req, res,
                message: "Material created successfully",
                data: insertData
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'createMaterial', req, res })
        }
    }

    async getProcurements(req, res) {
        try {
            const { org_id } = req
            const { id, search, site_id, vendor_id, payment_mode, payment_type } = req.query

            const filters = {
                org_id,
                type: 'procurement',
            }

            if (id) filters._id = ObjectId(id)
            if (site_id) filters.site_id = site_id
            if (vendor_id) filters.vendor_id = vendor_id
            if (payment_mode) filters.payment_mode = payment_mode
            if (payment_type) filters.payment_type = payment_type
            if (search) filters.$or = [
                { material_name: { $regex: search, $options: 'i' } },
                { vendor_name: { $regex: search, $options: 'i' } },
                { remarks: { $regex: search, $options: 'i' } },
                { transaction_id: { $regex: search, $options: 'i' } }
            ]

            const response = await req.mongoDB.find(mongoCollections.PROCUREMENT, filters)

            return responseHandler.successRequest({
                name: 'getAllMaterials',
                req, res,
                message: "Materials retrieved successfully",
                data: response
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'getAllMaterials', req, res })
        }
    }

    async updateProcurement(req, res) {
        try {
            const isPayloadInvalid = await payloadValidator.Validate({ name: 'updateMaterial', req, res, payload: req.body })
            if (isPayloadInvalid) return isPayloadInvalid

            const { id } = req.body
            const { org_id, user_id, user_name } = req
            let attachments = []

            // Get existing material record to check attachments
            const existingProcurement = await req.mongoDB.findOne(mongoCollections.PROCUREMENT, { _id: ObjectId(id), org_id })
            const existingAttachments = existingProcurement?.attachments || []

            // Remove files that are no longer present
            await Promise.all(existingAttachments.map(async existingAttachment => {
                const isFileStillPresent = req?.files?.some(file => file.originalname == existingAttachment.name)

                if (!isFileStillPresent) {
                    const file_key = existingAttachment.url.split('/').slice(-3).join('/')

                    console.log(file_key, 'file_key');

                    if (file_key) await awsS3Uploader.deleteFile(file_key)
                }
            }))

            // Handle file uploads and attachment updates
            if (req.files && req.files.length > 0) {
                for (const file of req.files) {
                    // Check if file already exists in attachments
                    const existingFile = existingAttachments.find(att => att.name == file.originalname)

                    if (!existingFile) {
                        const fileExtension = path.extname(file.originalname).substring(1)
                        const fileName = path.basename(file.originalname, path.extname(file.originalname))
                        const folderPath = `site_${req.body.site_id}/inventory/`

                        const uploadedUrl = await awsS3Uploader.uploadFile(
                            file,
                            fileName,
                            folderPath,
                            fileExtension
                        )

                        if (uploadedUrl) {
                            attachments.push({
                                url: uploadedUrl,
                                name: file.originalname,
                                type: file.mimetype,
                                size: file.size
                            })
                        }
                    } else {
                        // Keep existing attachment
                        attachments.push(existingFile)
                    }
                }
            }

            let materials = JSON.parse(req.body.materials || "[]")
            let site_id = req.body.site_id

            let materialIds = materials.map(item => item.material_id)

            const updateData = {
                ...req.body,
                materials,
                attachments,
                updated_by_id: user_id,
                updated_by_name: user_name,
                updated_at: new Date()
            }

            let inventoryMaterials = await req.mongoDB.find(mongoCollections.INVENTORY, { site_id: site_id, material_id: { $in: materialIds }, org_id })
            inventoryMaterials = inventoryMaterials.items || []

            const updateInvendtory = async (new_material, inventoryMaterial) => {

                let existing_material = existingProcurement?.materials?.find(item => item.id === new_material.id)

                const inventoryInsertData = {
                    material_id: new_material.material_id,
                    material_name: new_material.material_name,
                    material_unit: new_material.material_unit,
                    brand_id: new_material.brand_id,
                    brand_name: new_material.brand_name,
                    site_id: site_id,
                    purchased_quantity: parseFloat(new_material.quantity),
                    balance_quantity: parseFloat(new_material.quantity),
                    used_quantity: 0,
                    org_id,

                    created_by_id: user_id,
                    created_by_name: user_name,
                    created_at: new Date(),
                    updated_at: new Date()
                }

                if (inventoryMaterial) {

                    let purchased_quantity = parseFloat(inventoryMaterial.purchased_quantity)
                    let balance_quantity = parseFloat(inventoryMaterial.balance_quantity)

                    console.log(existing_material, 'existing_material');

                    if (existing_material) {
                        purchased_quantity -= parseFloat(existing_material.quantity)
                        balance_quantity -= parseFloat(existing_material.quantity)
                    }

                    await req.mongoDB.updateOne(mongoCollections.INVENTORY, { _id: ObjectId(inventoryMaterial.id) }, {
                        $set: {
                            purchased_quantity: purchased_quantity + parseFloat(new_material.quantity),
                            balance_quantity: balance_quantity + parseFloat(new_material.quantity),
                            updated_at: new Date()
                        }
                    })
                } else {
                    await req.mongoDB.insertOne(mongoCollections.INVENTORY, inventoryInsertData)
                }
            }

            await Promise.all(materials.map(async new_material => {
                const inventoryMaterial = inventoryMaterials ? inventoryMaterials.find(item => item.material_id === new_material.material_id) : null
                await updateInvendtory(new_material, inventoryMaterial)
            }))

            delete updateData.id

            const response = await req.mongoDB.updateOne(mongoCollections.PROCUREMENT, { _id: ObjectId(id), org_id }, { $set: updateData })

            if (!response.acknowledged) return responseHandler.failedRequest({
                name: 'updateMaterial',
                req, res,
                message: "Failed to update material"
            })

            return responseHandler.successRequest({
                name: 'updateMaterial',
                req, res,
                message: "Material updated successfully"
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'updateMaterial', req, res })
        }
    }

    async deleteProcurement(req, res) {
        try {
            const { id } = req.body
            const { org_id } = req

            const response = await req.mongoDB.deleteOne(mongoCollections.PROCUREMENT, { _id: ObjectId(id), org_id })

            if (!response.acknowledged) return responseHandler.failedRequest({
                name: 'deleteMaterial',
                req, res,
                message: "Failed to delete material"
            })

            return responseHandler.successRequest({
                name: 'deleteMaterial',
                req, res,
                message: "Material deleted successfully"
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'deleteMaterial', req, res })
        }
    }

    async getInventory(req, res) {
        try {
            const { org_id } = req
            const { id, search, site_id } = req.query

            const filters = {
                org_id,
                site_id
            }

            if (id) filters._id = ObjectId(id)
            if (site_id) filters.site_id = site_id
            if (search) filters.$or = [
                { material_name: { $regex: search, $options: 'i' } },
            ]

            console.log(filters, 'filters');


            const response = await req.mongoDB.find(mongoCollections.INVENTORY, filters)

            return responseHandler.successRequest({
                name: 'getAllInventory',
                req, res,
                message: "Inventory retrieved successfully",
                data: response
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'getAllInventory', req, res })
        }
    }

    async updateInventory(req, res) {
        try {
            const { org_id, user_id, user_name } = req

            const {
                site_id,

                material_id,
                material_name,
                material_unit,
                brand_id,
                brand_name,
                type,
                quantity,
                unit_rate,
                amount,
                remarks
            } = req.body

            const insertData = {
                material_id,
                material_name,
                material_unit,
                brand_id,
                brand_name,
                site_id,
                org_id,
                type,
                unit_rate,
                quantity,
                amount,
                remarks,
                updated_by_id: user_id,
                updated_by_name: user_name,
                updated_at: new Date()
            }

            const inventoryMaterial = await req.mongoDB.findOne(mongoCollections.INVENTORY, { site_id: site_id, material_id: material_id, org_id })

            const inventoryInsertData = {
                material_id: material_id,
                material_name: material_name,
                material_unit: material_unit,
                brand_id,
                brand_name,
                site_id: site_id,
                purchased_quantity: type == 'add_stock' ? parseFloat(quantity) : 0,
                balance_quantity: type == 'add_stock' ? parseFloat(quantity) : 0,
                used_quantity: type == 'used_stock' ? parseFloat(quantity) : 0,
                org_id,
                amount: amount || parseFloat(quantity) * parseFloat(unit_rate),

                created_by_id: user_id,
                created_by_name: user_name,
                created_at: new Date(),
                updated_at: new Date()
            }

            if (inventoryMaterial) {
                let update_data = {
                    updated_at: new Date()
                }
                if (type == 'add_stock') {
                    update_data.purchased_quantity = parseFloat(inventoryMaterial.purchased_quantity) + parseFloat(quantity)
                    update_data.balance_quantity = parseFloat(inventoryMaterial.balance_quantity) + parseFloat(quantity)
                }
                if (type == 'used_stock') {
                    update_data.used_quantity = parseFloat(inventoryMaterial.used_quantity) + parseFloat(quantity)
                    update_data.balance_quantity = parseFloat(inventoryMaterial.balance_quantity) - parseFloat(quantity)
                }

                console.log(update_data, type, 'sample')

                await req.mongoDB.updateOne(mongoCollections.INVENTORY, { _id: inventoryMaterial._id }, {
                    $set: update_data
                })
            } else {
                await req.mongoDB.insertOne(mongoCollections.INVENTORY, inventoryInsertData)
            }

            const response = await req.mongoDB.insertOne(mongoCollections.PROCUREMENT, insertData)

            if (!response.acknowledged) return responseHandler.failedRequest({
                name: 'updateInventory',
                req, res,
                message: "Failed to update inventory"
            })

            return responseHandler.successRequest({
                name: 'updateInventory',
                req, res,
                message: "Inventory updated successfully"
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'updateInventory', req, res })
        }
    }

    async updateInventoryBulk(req, res) {
        try {
            const { org_id, user_id, user_name } = req

            const {
                site_id,
                materials
            } = req.body


            let material_ids = materials.map(material => ObjectId(material.material_id))

            const inventoryMaterials = await req.mongoDB.find(mongoCollections.INVENTORY, { site_id: site_id, material_id: { $in: material_ids }, org_id })

            let procurementInsertDatas = []
            let insertDatas = []
            let updateDatas = []

            for (let material of materials) {
                let insert_data = {
                    material_id: material.material_id,
                    material_name: material.material_name,
                    material_unit: material.material_unit,
                    brand_id: material.brand_id,
                    brand_name: material.brand_name,
                    site_id: site_id,
                    purchased_quantity: parseFloat(material.quantity),
                    balance_quantity: parseFloat(material.quantity),
                    used_quantity: 0,
                    org_id,
                    amount: parseFloat(material.quantity) * parseFloat(material.unit_rate),

                    created_by_id: user_id,
                    created_by_name: user_name,
                    created_at: new Date(),
                    updated_at: new Date()
                }
                procurementInsertDatas.push(insert_data)
                const inventoryMaterial = inventoryMaterials.items.find(inv => inv.material_id == material.material_id)
                if (!inventoryMaterial) {
                    insertDatas.push(insert_data)
                } else {
                    let update_data = {
                        updated_at: new Date()
                    }
                    update_data.purchased_quantity = parseFloat(inventoryMaterial.purchased_quantity) + parseFloat(material.quantity)
                    update_data.balance_quantity = parseFloat(inventoryMaterial.balance_quantity) + parseFloat(material.quantity)

                    updateDatas.push({
                        _id: inventoryMaterial._id,
                        $set: update_data
                    })
                }

            }

            if (insertDatas.length > 0) {
                await req.mongoDB.insertMany(mongoCollections.INVENTORY, insertDatas)
            }
            if (updateDatas.length > 0) {
                await req.mongoDB.bulkWrite(mongoCollections.INVENTORY, updateDatas)
            }

            await req.mongoDB.insertMany(mongoCollections.PROCUREMENT, procurementInsertDatas)

            return responseHandler.successRequest({
                name: 'updateInventoryBulk',
                req, res,
                message: "Inventory updated successfully"
            })
        } catch (err) {
            console.log(err);
            return responseHandler.serverError({ name: 'updateInventoryBulk', req, res })
        }
    }
}

module.exports = Inventory;