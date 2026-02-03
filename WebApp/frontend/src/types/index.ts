export interface Site {
  id: string;
  name: string;
  description: string;
  client: {
    name: string;
    phone: string;
    email: string;
  };
  estimateAmount: number;
  startDate: string;
  endDate: string;
  address: string;
  team: string[];
  status: "planning" | "ongoing" | "completed" | "on-hold";
  completionPercentage: number;
}

export interface Vendor {
  id: string;
  name: string;
  category: "Material" | "Labour" | "Other";
  contactPersonName: string;
  contactPersonPhone: string;
  address: string;
  gstin: string;
  panNumber: string;
}

export interface Employee {
  id: string;
  name: string;
  role_id: string;
  role_name: string;
  phone: string;
  email: string;
}

export interface Material {
  id: string;
  name: string;
  description: string;
  unit: string;
  brand_id: string;
  brand_name: string;
  maxUnitAmount: number;
  photo?: string;
}

export interface Brand {
  id: string;
  name: string;
  description: string;
}

export interface LabourType {
  id: string;
  name: string;
  maxUnitAmount: number;
}

export interface Role {
  id: string;
  name: string;
  permissions: {
    dashboard: {
      view: boolean;
      create: boolean;
      edit: boolean;
      delete: boolean;
    };
    sites: { view: boolean; create: boolean; edit: boolean; delete: boolean };
    vendors: { view: boolean; create: boolean; edit: boolean; delete: boolean };
    employees: {
      view: boolean;
      create: boolean;
      edit: boolean;
      delete: boolean;
    };
    masterDatabase: {
      view: boolean;
      create: boolean;
      edit: boolean;
      delete: boolean;
    };
    roleManagement: {
      view: boolean;
      create: boolean;
      edit: boolean;
      delete: boolean;
    };
    settings: {
      view: boolean;
      create: boolean;
      edit: boolean;
      delete: boolean;
    };
  };
}

export interface Expense {
  id: string;
  site_id: string;
  amount: number;
  category: string;
  party_id?: string;
  party_name?: string;
  paid_at: number;
  payment_mode: string;
  payment_type: string;
  transaction_id?: string;
  remarks?: string;
  attachments?: any[];
}

export interface Task {
  id: string;
  siteId: string;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  status: "upcoming" | "in-progress" | "completed" | "delayed";
  assignedTo: string[];
  priority: "low" | "medium" | "high";
}

export interface ClientPayment {
  id: string;
  siteId: string;
  amount: number;
  date: string;
  description: string;
}
