import {
  Site,
  Vendor,
  Employee,
  Material,
  Brand,
  LabourType,
  Role,
  Expense,
  Task,
  ClientPayment,
} from "../types";

export const mockSites: Site[] = [
  {
    id: "1",
    name: "Sunrise Apartments",
    description: "Luxury residential complex with 50 units",
    client: {
      name: "John Smith",
      phone: "+91 98765 43210",
      email: "john.smith@email.com",
    },
    estimateAmount: 5000000,
    startDate: "2024-01-15",
    endDate: "2024-12-31",
    address: {
      street: "123 Main Street",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400001",
    },
    team: ["emp1", "emp2", "emp3"],
    status: "ongoing",
    completionPercentage: 65,
    totalExpense: 3250000,
  },
  {
    id: "2",
    name: "Green Valley Villa",
    description: "Premium villa construction with modern amenities",
    client: {
      name: "Sarah Johnson",
      phone: "+91 87654 32109",
      email: "sarah.johnson@email.com",
    },
    estimateAmount: 2500000,
    startDate: "2024-03-01",
    endDate: "2024-10-30",
    address: {
      street: "456 Park Avenue",
      city: "Bangalore",
      state: "Karnataka",
      zipCode: "560001",
    },
    team: ["emp1", "emp4"],
    status: "ongoing",
    completionPercentage: 40,
    totalExpense: 1000000,
  },
  {
    id: "3",
    name: "Corporate Tower",
    description: "Commercial office building with 20 floors",
    client: {
      name: "Tech Corp Ltd.",
      phone: "+91 76543 21098",
      email: "contact@techcorp.com",
    },
    estimateAmount: 15000000,
    startDate: "2023-06-01",
    endDate: "2024-05-31",
    address: {
      street: "789 Business District",
      city: "Delhi",
      state: "Delhi",
      zipCode: "110001",
    },
    team: ["emp2", "emp3", "emp5"],
    status: "completed",
    completionPercentage: 100,
    totalExpense: 14500000,
  },
  {
    id: "1",
    name: "Sunrise Apartments",
    description: "Luxury residential complex with 50 units",
    client: {
      name: "John Smith",
      phone: "+91 98765 43210",
      email: "john.smith@email.com",
    },
    estimateAmount: 5000000,
    startDate: "2024-01-15",
    endDate: "2024-12-31",
    address: {
      street: "123 Main Street",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400001",
    },
    team: ["emp1", "emp2", "emp3"],
    status: "ongoing",
    completionPercentage: 65,
    totalExpense: 3250000,
  },
  {
    id: "2",
    name: "Green Valley Villa",
    description: "Premium villa construction with modern amenities",
    client: {
      name: "Sarah Johnson",
      phone: "+91 87654 32109",
      email: "sarah.johnson@email.com",
    },
    estimateAmount: 2500000,
    startDate: "2024-03-01",
    endDate: "2024-10-30",
    address: {
      street: "456 Park Avenue",
      city: "Bangalore",
      state: "Karnataka",
      zipCode: "560001",
    },
    team: ["emp1", "emp4"],
    status: "ongoing",
    completionPercentage: 40,
    totalExpense: 1000000,
  },
  {
    id: "3",
    name: "Corporate Tower",
    description: "Commercial office building with 20 floors",
    client: {
      name: "Tech Corp Ltd.",
      phone: "+91 76543 21098",
      email: "contact@techcorp.com",
    },
    estimateAmount: 15000000,
    startDate: "2023-06-01",
    endDate: "2024-05-31",
    address: {
      street: "789 Business District",
      city: "Delhi",
      state: "Delhi",
      zipCode: "110001",
    },
    team: ["emp2", "emp3", "emp5"],
    status: "completed",
    completionPercentage: 100,
    totalExpense: 14500000,
  },
];

export const mockVendors: Vendor[] = [
  {
    id: "1",
    name: "Premium Steel Suppliers",
    category: "Material",
    contactPerson: {
      name: "Raj Patel",
      phone: "+91 98765 43210",
    },
    address: "123 Industrial Area, Mumbai, Maharashtra - 400001",
    gstin: "27ABCDE1234F1Z5",
    panNumber: "ABCDE1234F",
  },
  {
    id: "2",
    name: "Elite Construction Workers",
    category: "Labour",
    contactPerson: {
      name: "Amit Kumar",
      phone: "+91 87654 32109",
    },
    address: "456 Workers Colony, Bangalore, Karnataka - 560001",
    gstin: "29FGHIJ5678K2A6",
    panNumber: "FGHIJ5678K",
  },
  {
    id: "3",
    name: "Heavy Machinery Rentals",
    category: "Other",
    contactPerson: {
      name: "Suresh Sharma",
      phone: "+91 76543 21098",
    },
    address: "789 Equipment Hub, Delhi - 110001",
    gstin: "07LMNOP9012Q3B7",
    panNumber: "LMNOP9012Q",
  },
];

export const mockEmployees: Employee[] = [
  {
    id: "emp1",
    name: "Rajesh Gupta",
    role: "site-engineer",
    phone: "+91 98765 43210",
    email: "rajesh.gupta@company.com",
    designation: "Senior Site Engineer",
  },
  {
    id: "emp2",
    name: "Priya Sharma",
    role: "project-manager",
    phone: "+91 87654 32109",
    email: "priya.sharma@company.com",
    designation: "Project Manager",
  },
  {
    id: "emp3",
    name: "Amit Verma",
    role: "site-engineer",
    phone: "+91 76543 21098",
    email: "amit.verma@company.com",
    designation: "Site Engineer",
  },
  {
    id: "emp4",
    name: "Sunita Rani",
    role: "architect",
    phone: "+91 65432 10987",
    email: "sunita.rani@company.com",
    designation: "Senior Architect",
  },
  {
    id: "emp5",
    name: "Vikash Singh",
    role: "supervisor",
    phone: "+91 54321 09876",
    email: "vikash.singh@company.com",
    designation: "Site Supervisor",
  },
];

export const mockMaterials: Material[] = [
  {
    id: "1",
    name: "Cement (OPC 43 Grade)",
    description: "Ordinary Portland Cement 43 Grade",
    unit: "Bag (50kg)",
    maxUnitAmount: 450,
  },
  {
    id: "2",
    name: "Steel Rebar (TMT)",
    description: "Thermo-Mechanically Treated Steel Bars",
    unit: "MT",
    maxUnitAmount: 75000,
  },
  {
    id: "3",
    name: "Red Bricks",
    description: "High quality clay bricks",
    unit: "Thousand",
    maxUnitAmount: 8000,
  },
];

export const mockBrands: Brand[] = [
  {
    id: "1",
    name: "UltraTech Cement",
    description: "Leading cement manufacturer in India",
  },
  {
    id: "2",
    name: "Tata Steel",
    description: "Premium steel products",
  },
  {
    id: "3",
    name: "Asian Paints",
    description: "Quality paint and coating solutions",
  },
];

export const mockLabourTypes: LabourType[] = [
  {
    id: "1",
    name: "Mason",
    maxUnitAmount: 800,
  },
  {
    id: "2",
    name: "Carpenter",
    maxUnitAmount: 900,
  },
  {
    id: "3",
    name: "Electrician",
    maxUnitAmount: 1000,
  },
];

export const mockRoles: Role[] = [
  {
    id: "1",
    name: "Admin",
    permissions: {
      dashboard: { view: true, create: true, edit: true, delete: true },
      sites: { view: true, create: true, edit: true, delete: true },
      vendors: { view: true, create: true, edit: true, delete: true },
      employees: { view: true, create: true, edit: true, delete: true },
      masterDatabase: { view: true, create: true, edit: true, delete: true },
      roleManagement: { view: true, create: true, edit: true, delete: true },
      settings: { view: true, create: true, edit: true, delete: true },
    },
  },
  {
    id: "2",
    name: "Project Manager",
    permissions: {
      dashboard: { view: true, create: false, edit: false, delete: false },
      sites: { view: true, create: true, edit: true, delete: false },
      vendors: { view: true, create: true, edit: true, delete: false },
      employees: { view: true, create: false, edit: false, delete: false },
      masterDatabase: { view: true, create: true, edit: true, delete: false },
      roleManagement: {
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      settings: { view: true, create: false, edit: true, delete: false },
    },
  },
];

export const mockExpenses: Expense[] = [
  {
    id: "1",
    siteId: "1",
    category: "Materials",
    amount: 150000,
    date: "2024-01-15",
    status: "paid",
    description: "Cement and steel procurement",
  },
  {
    id: "2",
    siteId: "1",
    category: "Labour",
    amount: 75000,
    date: "2024-01-20",
    status: "overdue",
    description: "Mason and carpenter charges",
  },
  {
    id: "3",
    siteId: "2",
    category: "Equipment",
    amount: 50000,
    date: "2024-01-25",
    status: "credit",
    description: "Excavator rental",
  },
];

export const mockTasks: Task[] = [
  {
    id: "1",
    siteId: "1",
    name: "Foundation Laying",
    description: "Complete foundation work for building A",
    startDate: "2024-01-15",
    endDate: "2024-02-15",
    status: "completed",
    assignedTo: ["emp1", "emp3"],
    priority: "high",
  },
  {
    id: "2",
    siteId: "1",
    name: "Steel Framework",
    description: "Install steel framework for floors 1-5",
    startDate: "2024-02-16",
    endDate: "2024-03-30",
    status: "delayed",
    assignedTo: ["emp1", "emp2"],
    priority: "high",
  },
  {
    id: "3",
    siteId: "2",
    name: "Electrical Wiring",
    description: "Complete electrical wiring installation",
    startDate: "2024-03-01",
    endDate: "2024-03-15",
    status: "in-progress",
    assignedTo: ["emp4"],
    priority: "medium",
  },
];

export const mockClientPayments: ClientPayment[] = [
  {
    id: "1",
    siteId: "1",
    amount: 1000000,
    date: "2024-01-01",
    description: "Initial payment",
  },
  {
    id: "2",
    siteId: "1",
    amount: 1500000,
    date: "2024-02-01",
    description: "First milestone payment",
  },
  {
    id: "3",
    siteId: "2",
    amount: 500000,
    date: "2024-03-01",
    description: "Initial payment",
  },
];

export const mockCompanyInfo = {
  name: "Civilator Construction",
  phone: "+91 98765 43210",
  email: "info@civilator.com",
  address: "123 Construction Hub, Mumbai, Maharashtra - 400001",
  gstin: "27BUILDMAX123F1",
  panNumber: "BUILDMAX123",
  website: "https://civilator.com",
  logo: null,
};

export const mockProfile = {
  name: "Admin User",
  phone: "+91 98765 43210",
  email: "admin@civilator.com",
  photo: null,
};

export const mockCustomerAppSettings = {
  visibleCompanyName: "Civilator Construction",
  subUrl: "civilator-construction",
  colorTheme: "#3b82f6",
  portalUrl: "https://customer.civilator.aiseowrite.in/civilator-construction",
};

// Indian states for dropdown
export const indianStates = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
];
