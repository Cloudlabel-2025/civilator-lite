require('dotenv');


const Joi = require('joi')

const Schemas = {

  // Auth_Schemas

  register: Joi.object({
    email: Joi.string().email().required(),
  }),

  verifyotp: Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.string().required(),
  }),

  onboard: Joi.object({
    details: Joi.object().required(),
  }),

  // Site Schemas
  createSite: Joi.object({
    name: Joi.string().required(),
    description: Joi.string().allow('', null),
    client: Joi.object({
      name: Joi.string().allow('', null),
      phone: Joi.string().allow('', null),
    }).required(),
    estimateAmount: Joi.number().required(),
    startDate: Joi.string().allow('', null),
    endDate: Joi.string().allow('', null),
    address: Joi.string().allow('', null),
    team: Joi.array(),
    status: Joi.string().required(),
  }),

  updateSite: Joi.object({
    id: Joi.string().required(),
    name: Joi.string(),
    description: Joi.string().allow('', null),
    client: Joi.object({
      name: Joi.string().allow('', null),
      phone: Joi.string().allow('', null),
    }),
    estimateAmount: Joi.number().default(0),
    startDate: Joi.string().allow('', null),
    endDate: Joi.string().allow('', null),
    address: Joi.string().allow('', null),
    team: Joi.array(),
    status: Joi.string(),
  }),

  // Vendor Schemas
  createVendor: Joi.object({
    name: Joi.string().required(),
    category: Joi.string().required(),
    contactPersonName: Joi.string().required(),
    contactPersonPhone: Joi.string().required(),
    address: Joi.string().required(),
    gstin: Joi.string().required(),
    panNumber: Joi.string().required(),
  }),

  updateVendor: Joi.object({
    id: Joi.string().required(),
    name: Joi.string(),
    category: Joi.string(),
    contactPersonName: Joi.string(),
    contactPersonPhone: Joi.string(),
    address: Joi.string(),
    gstin: Joi.string(),
    panNumber: Joi.string(),
  }),

  // Employee Schemas
  createEmployee: Joi.object({
    name: Joi.string().required(),
    role_id: Joi.string().required(),
    role_name: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().email().required(),
  }),

  updateEmployee: Joi.object({
    id: Joi.string().required(),
    name: Joi.string(),
    role_id: Joi.string(),
    role_name: Joi.string(),
    phone: Joi.string(),
    email: Joi.string().email(),
  }),

  // Master Material Schemas
  createMasterMaterial: Joi.object({
    name: Joi.string().required(),
    description: Joi.string().allow('', null),
    unit: Joi.string().required(),
    brand_id: Joi.string().allow('', null),
    brand_name: Joi.string().allow('', null),
    maxUnitAmount: Joi.number().required(),
  }),

  updateMasterMaterial: Joi.object({
    id: Joi.string().required(),
    name: Joi.string(),
    description: Joi.string().allow('', null),
    unit: Joi.string(),
    brand_id: Joi.string().allow('', null),
    brand_name: Joi.string().allow('', null),
    maxUnitAmount: Joi.number(),
  }),

  // Master Brands Schemas
  createMasterBrand: Joi.object({
    name: Joi.string().required(),
    description: Joi.string().allow('', null),

  }),

  updateMasterBrand: Joi.object({
    id: Joi.string().required(),
    name: Joi.string(),
    description: Joi.string().allow('', null),

  }),

  // Master Labor Schemas
  createMasterLabor: Joi.object({
    name: Joi.string(),
    maxUnitAmount: Joi.number(),
  }),

  updateMasterLabor: Joi.object({
    id: Joi.string().required(),
    name: Joi.string(),
    maxUnitAmount: Joi.number(),
  }),

  // Settings Schemas
  updateProfile: Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().allow('', null),
    photo: Joi.string().allow('', null),
  }),

  updateCompany: Joi.object({
    name: Joi.string().required(),
    phone: Joi.string().required(),
    email: Joi.string().email().required(),
    address: Joi.string().required(),
    gstin: Joi.string().required(),
    panNumber: Joi.string().required(),
    website: Joi.string().required(),
    logo: Joi.string().required(),
  }),


  // Role Schemas
  createRole: Joi.object({
    name: Joi.string().required(),
    permissions: Joi.object()
  }),

  updateRole: Joi.object({
    id: Joi.string().required(),
    name: Joi.string(),
    permissions: Joi.object(),
  }),

  // Expense Schemas
  createExpense: Joi.object({
    site_id: Joi.string().required(),
    amount: Joi.number().required(),
    category: Joi.string().required(),
    party_id: Joi.string().allow('', null),
    party_name: Joi.string().allow('', null),
    paid_at: Joi.number().required(),
    payment_mode: Joi.string().required(),
    payment_type: Joi.string().required(),
    transaction_id: Joi.string().allow('', null),
    remarks: Joi.string().allow('', null),
    attachments: Joi.array()
  }),

  updateExpense: Joi.object({
    id: Joi.string().required(),
    site_id: Joi.string(),
    amount: Joi.number(),
    category: Joi.string(),
    party_id: Joi.string().allow('', null),
    party_name: Joi.string().allow('', null),
    paid_at: Joi.number(),
    payment_mode: Joi.string(),
    payment_type: Joi.string(),
    transaction_id: Joi.string().allow('', null),
    remarks: Joi.string().allow('', null),
    attachments: Joi.array()
  }),

  // Payment Schemas
  createPayment: Joi.object({
    site_id: Joi.string().required(),
    amount: Joi.number().required(),
    payment_from: Joi.string().valid('client', 'self').required(),
    paid_at: Joi.number().required(),
    payment_mode: Joi.string().required(),
    transaction_id: Joi.string().allow('', null),
    remarks: Joi.string().allow('', null),
    attachments: Joi.array()
  }),

  updatePayment: Joi.object({
    id: Joi.string().required(),
    site_id: Joi.string(),
    amount: Joi.number(),
    payment_from: Joi.string().valid('client', 'self'),
    paid_at: Joi.number(),
    payment_mode: Joi.string(),
    transaction_id: Joi.string().allow('', null),
    remarks: Joi.string().allow('', null),
    attachments: Joi.array()
  }),

  // Material Schemas
  createMaterial: Joi.object({
    site_id: Joi.string().required(),
    vendor_id: Joi.string().required(),
    vendor_name: Joi.string().required(),
    payment_type: Joi.string().valid('credit', 'debit').required(),
    purchased_at: Joi.string().required(),
    payment_mode: Joi.string().required(),
    transaction_id: Joi.string().allow('', null),
    remarks: Joi.string().allow('', null),
    discount: Joi.string().allow('', null),
    due_date: Joi.string().allow('', null),
    charges: Joi.string().allow('', null),
    paid_amount: Joi.string().allow('', null),
    materials: Joi.string().allow("", null),
    attachments: Joi.array()
  }),

  updateMaterial: Joi.object({
    id: Joi.string().required(),
    site_id: Joi.string().required(),
    vendor_id: Joi.string().required(),
    vendor_name: Joi.string().required(),
    payment_type: Joi.string().valid('credit', 'debit').required(),
    purchased_at: Joi.string().required(),
    payment_mode: Joi.string().required(),
    transaction_id: Joi.string().allow('', null),
    remarks: Joi.string().allow('', null),
    discount: Joi.string().allow('', null),
    due_date: Joi.string().allow('', null),
    charges: Joi.string().allow('', null),
    paid_amount: Joi.string().allow('', null),
    materials: Joi.string().allow("", null),
    attachments: Joi.array()
  }),

  // Task Schemas
  createTask: Joi.object({
    site_id: Joi.string().required(),
    name: Joi.string().required(),
    description: Joi.string().allow('', null),
    start_date: Joi.string().allow('', null),
    end_date: Joi.string().allow('', null),
    assignees: Joi.array(),
    unit: Joi.string().allow('', null),
    total_work_progress: Joi.number().allow(null),
  }),

  updateTask: Joi.object({
    id: Joi.string().required(),
    site_id: Joi.string(),
    name: Joi.string(),
    description: Joi.string().allow('', null),
    start_date: Joi.string().allow('', null),
    end_date: Joi.string().allow('', null),
    assignees: Joi.array(),
    unit: Joi.string().allow('', null),
    total_work_progress: Joi.number().allow(null),
  }),

  createTaskComment: Joi.object({
    task_id: Joi.string().required(),
    message: Joi.string().required(),
  }),

  updateTaskProgress: Joi.object({
    task_id: Joi.string().required(),
    progress_value: Joi.number().required(),
    type: Joi.string().required(),
    remarks: Joi.string().allow('', null),
    materials: Joi.string().allow("", null),
    attendances: Joi.string().allow("", null),
    attachments: Joi.array()
  }),

  deleteTaskProgress: Joi.object({
    task_id: Joi.string().required(),
    id: Joi.string().required(),
  }),

  createAttendance: Joi.object({
    site_id: Joi.string().required(),
    type: Joi.string().required(),
    vendor_id: Joi.string().allow('', null),
    vendor_name: Joi.string().allow('', null),
    labours: Joi.array(),

    name: Joi.string().allow('', null),
    phone: Joi.string().allow('', null),
    type_id: Joi.string().allow('', null),
    type_name: Joi.string().allow('', null),
    max_unitrate: Joi.number().allow('', null),
    salary_type: Joi.string().allow('', null),
    unitrate: Joi.number().allow('', null),
    overtime_rate: Joi.number().allow('', null),
  }),
  updateAttendance: Joi.object({
    id: Joi.string().required(),
    site_id: Joi.string().required(),
    type: Joi.string().required(),
    vendor_id: Joi.string().allow('', null),
    vendor_name: Joi.string().allow('', null),
    labours: Joi.array(),

    name: Joi.string().allow('', null),
    phone: Joi.string().allow('', null),
    type_id: Joi.string().allow('', null),
    type_name: Joi.string().allow('', null),
    max_unitrate: Joi.number().allow('', null),
    salary_type: Joi.string().allow('', null),
    unitrate: Joi.number().allow('', null),
    overtime_rate: Joi.number().allow('', null),
  }),

  markAttendance: Joi.object({
    id: Joi.string().required(),
    date: Joi.string().required(),
    data: Joi.object().required(),
  }),

  createContactUs: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
    message: Joi.string().allow('', null),

  }),
  createRequestDemo: Joi.object({
    name: Joi.string().required(),
    company_name: Joi.string().required(),
    email: Joi.string().required(),
    phone: Joi.string().required(),
    state: Joi.string().required(),
    company_type: Joi.string().required(),
    company_annual_turnover: Joi.string().required(),
    designation: Joi.string().required(),
  })
}



module.exports = Schemas