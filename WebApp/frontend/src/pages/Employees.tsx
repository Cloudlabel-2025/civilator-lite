import React, { useState, useEffect } from "react";
import { Layout } from "../components/Layout/Layout";
import { Button } from "../components/Common/Button";
import { Modal } from "../components/Common/Modal";
import { FormField } from "../components/Common/FormField";
import { Table } from "../components/Common/Table";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Employee } from "../types";
import EmployeesHandler from "../handler/employees";
import RolesHandler from "../handler/roles";

export const Employees: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const employeesHandler = new EmployeesHandler();
  const rolesHandler = new RolesHandler();

  const [roles, setRoles] = useState<any[]>([]);

  const [roleOptions, setRoleOptions] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    role_id: "",
    role_name: "",
    phone: "",
    email: "",
  });

  const handleOpenModal = (employee?: Employee) => {
    if (employee) {
      setEditingEmployee(employee);
      setFormData({
        name: employee.name,
        role_id: employee.role_id,
        role_name: employee.role_name,
        phone: employee.phone,
        email: employee.email,
      });
    } else {
      setEditingEmployee(null);
      setFormData({
        name: "",
        role_id: "",
        role_name: "",
        phone: "",
        email: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const employeeData = {
      name: formData.name,
      role_id: formData.role_id,
      role_name: formData.role_name,
      phone: formData.phone,
      email: formData.email,
    };

    try {
      let response = {
        success: false,
      };
      if (editingEmployee) {
        response = await employeesHandler.put({
          ...employeeData,
          id: editingEmployee.id,
        });
      } else {
        response = await employeesHandler.post(employeeData);
      }
      if (!response.success) {
        return;
      }
      loadEmployees();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving employee:", error);
    }
  };

  const handleDelete = async (employeeId: string) => {
    if (window.confirm("Are you sure you want to delete this employee?")) {
      try {
        await employeesHandler.delete({ id: employeeId });
        loadEmployees();
      } catch (error) {
        console.error("Error deleting employee:", error);
      }
    }
  };

  const loadEmployees = async () => {
    try {
      const response = await employeesHandler.get({});
      if (response.success) {
        setEmployees(response.data.items || []);
      }
    } catch (error) {
      console.error("Error loading employees:", error);
    }
  };

  const loadRoles = async () => {
    try {
      const response = await rolesHandler.get({});
      if (response.success) {
        setRoles(response.data.items || []);

        let roles = response.data.items || [];
        setRoleOptions(
          roles.map((role: any) => ({ value: role.id, label: role.name }))
        );
      }
    } catch (error) {
      console.error("Error loading roles:", error);
    }
  };

  useEffect(() => {
    loadEmployees();
    loadRoles();
  }, []);

  const columns = [
    {
      key: "name",
      header: "Employee Name",
      mobileLabel: "Name",
      showInMobile: true,
    },
    {
      key: "role_name",
      header: "Role",
      mobileLabel: "Role",
      showInMobile: true,
      render: (value: string) => (
        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
          {value}
        </span>
      ),
    },
    {
      key: "phone",
      header: "Phone Number",
      mobileLabel: "Phone",
      showInMobile: true,
    },
    {
      key: "email",
      header: "Email ID",
      mobileLabel: "Email",
      showInMobile: false, // Hide in mobile to save space
    },
  ];

  return (
    <Layout title="Employees">
      {/* Create/Edit Employee Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingEmployee ? "Edit Employee" : "Create New Employee"}
        size="md"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormField
            label="Employee Name"
            value={formData.name}
            onChange={(value) =>
              setFormData({ ...formData, name: value as string })
            }
            required
          />

          <FormField
            label="Employee Role"
            type="select"
            value={formData.role_id}
            onChange={(value) =>
              setFormData({
                ...formData,
                role_id: value as string,
                role_name:
                  roleOptions.find((role) => role.value == value)?.label || "",
              })
            }
            options={roleOptions}
            required
          />

          <FormField
            label="Phone Number"
            type="tel"
            value={formData.phone}
            onChange={(value) =>
              setFormData({ ...formData, phone: value as string })
            }
            required
          />

          <FormField
            label="Email ID"
            type="email"
            value={formData.email}
            onChange={(value) =>
              setFormData({ ...formData, email: value as string })
            }
            required
          />

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingEmployee ? "Update Employee" : "Create Employee"}
            </Button>
          </div>
        </form>
      </Modal>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">All Employees</h2>
          <Button
            onClick={() => handleOpenModal()}
            icon={Plus}
            iconPosition="left"
          >
            Add New Employee
          </Button>
        </div>

        {/* Employees Table */}
        <Table
          columns={columns}
          data={employees}
          mobileCardTitle={(employee) => employee.name}
          mobileCardSubtitle={(employee) => employee.role_name}
          actions={(employee) => (
            <>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleOpenModal(employee)}
                icon={Edit}
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDelete(employee.id)}
                icon={Trash2}
                className="text-red-600 hover:text-red-700"
              />
            </>
          )}
        />
      </div>
    </Layout>
  );
};
