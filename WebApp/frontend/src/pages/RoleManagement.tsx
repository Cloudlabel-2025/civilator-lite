import React, { useState, useEffect } from "react";
import { Layout } from "../components/Layout/Layout";
import { Button } from "../components/Common/Button";
import { Modal } from "../components/Common/Modal";
import { FormField } from "../components/Common/FormField";
import { Table } from "../components/Common/Table";
import { Plus, Edit, Trash2, Shield } from "lucide-react";
import { Role } from "../types";
import RolesHandler from "../handler/roles";

export const RoleManagement: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState<Role | null>(null);
  const rolesHandler = new RolesHandler();
  const [formData, setFormData] = useState({
    name: "",
    permissions: {
      dashboard: { view: false, create: false, edit: false, delete: false },
      sites: { view: false, create: false, edit: false, delete: false },
      vendors: { view: false, create: false, edit: false, delete: false },
      employees: { view: false, create: false, edit: false, delete: false },
      masterDatabase: {
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      roleManagement: {
        view: false,
        create: false,
        edit: false,
        delete: false,
      },
      settings: { view: false, create: false, edit: false, delete: false },
    },
  });

  const handleOpenModal = (role?: Role) => {
    if (role) {
      setEditingRole(role);
      setFormData({
        name: role.name,
        permissions: { ...role.permissions },
      });
    } else {
      setEditingRole(null);
      setFormData({
        name: "",
        permissions: {
          dashboard: { view: false, create: false, edit: false, delete: false },
          sites: { view: false, create: false, edit: false, delete: false },
          vendors: { view: false, create: false, edit: false, delete: false },
          employees: { view: false, create: false, edit: false, delete: false },
          masterDatabase: {
            view: false,
            create: false,
            edit: false,
            delete: false,
          },
          roleManagement: {
            view: false,
            create: false,
            edit: false,
            delete: false,
          },
          settings: { view: false, create: false, edit: false, delete: false },
        },
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const roleData = {
      name: formData.name,
      permissions: formData.permissions,
    };

    try {
      let response: any = {
        success: false,
      };

      if (editingRole) {
        response = await rolesHandler.put({
          ...roleData,
          id: editingRole.id,
        });
      } else {
        response = await rolesHandler.post(roleData);
      }

      if (!response.success) {
        alert(response.message || "Error saving role");
        return;
      }

      loadRoles();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving role:", error);
    }
  };

  const handleDelete = async (roleId: string) => {
    if (window.confirm("Are you sure you want to delete this role?")) {
      try {
        await rolesHandler.delete({ id: roleId });
        loadRoles();
      } catch (error) {
        console.error("Error deleting role:", error);
      }
    }
  };

  const handlePermissionChange = (
    module: string,
    action: string,
    value: boolean
  ) => {
    setFormData({
      ...formData,
      permissions: {
        ...formData.permissions,
        [module]: {
          ...formData.permissions[module as keyof typeof formData.permissions],
          [action]: value,
        },
      },
    });
  };

  const loadRoles = async () => {
    try {
      const response = await rolesHandler.get({});
      if (response.success) {
        setRoles(response.data.items || []);
      }
    } catch (error) {
      console.error("Error loading roles:", error);
    }
  };

  useEffect(() => {
    loadRoles();
  }, []);

  const handleQuickSelect = (type: "all" | "none" | "viewOnly") => {
    const newPermissions = { ...formData.permissions };

    Object.keys(newPermissions).forEach((module) => {
      if (type === "all") {
        newPermissions[module as keyof typeof newPermissions] = {
          view: true,
          create: true,
          edit: true,
          delete: true,
        };
      } else if (type === "none") {
        newPermissions[module as keyof typeof newPermissions] = {
          view: false,
          create: false,
          edit: false,
          delete: false,
        };
      } else if (type === "viewOnly") {
        newPermissions[module as keyof typeof newPermissions] = {
          view: true,
          create: false,
          edit: false,
          delete: false,
        };
      }
    });

    setFormData({ ...formData, permissions: newPermissions });
  };

  const getPermissionSummary = (permissions: Role["permissions"]) => {
    const modules = Object.keys(permissions);
    const totalPermissions = modules.length * 4; // 4 actions per module
    const grantedPermissions = modules.reduce((count, module) => {
      const modulePerms = permissions[module as keyof typeof permissions];
      return count + Object.values(modulePerms).filter(Boolean).length;
    }, 0);

    return `${grantedPermissions}/${totalPermissions} permissions`;
  };

  const columns = [
    {
      key: "name",
      header: "Role Name",
      mobileLabel: "Role",
      showInMobile: true,
      render: (value: string) => (
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-blue-600" />
          <span className="font-medium">{value}</span>
        </div>
      ),
    },
    {
      key: "permissions",
      header: "Permissions Summary",
      mobileLabel: "Permissions",
      showInMobile: true,
      render: (value: Role["permissions"]) => (
        <span className="text-sm text-gray-600">
          {getPermissionSummary(value)}
        </span>
      ),
    },
  ];

  const moduleLabels = {
    dashboard: "Dashboard",
    sites: "Sites",
    vendors: "Vendors",
    employees: "Employees",
    masterDatabase: "Master Database",
    roleManagement: "Role Management",
    settings: "Settings",
  };

  const actionLabels = {
    view: "View",
    create: "Create",
    edit: "Edit",
    delete: "Delete",
  };

  return (
    <Layout title="Role Management">
      {/* Create/Edit Role Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingRole ? "Edit Role" : "Create New Role"}
        size="xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <FormField
            label="Role Name"
            value={formData.name}
            onChange={(value) =>
              setFormData({ ...formData, name: value as string })
            }
            required
          />

          {/* Quick Select Options */}
          <div className="border-t pt-4">
            <h4 className="text-lg font-medium text-gray-900 mb-4">
              Quick Select
            </h4>
            <div className="flex flex-wrap gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => handleQuickSelect("all")}
              >
                Select All
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => handleQuickSelect("viewOnly")}
              >
                View Only
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => handleQuickSelect("none")}
              >
                Clear All
              </Button>
            </div>
          </div>

          {/* Permissions Grid */}
          <div className="border-t pt-4">
            <h4 className="text-lg font-medium text-gray-900 mb-4">
              Permissions
            </h4>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 px-3 font-medium text-gray-900">
                      Module
                    </th>
                    {Object.entries(actionLabels).map(([action, label]) => (
                      <th
                        key={action}
                        className="text-center py-2 px-3 font-medium text-gray-900"
                      >
                        {label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(moduleLabels).map(([module, label]) => (
                    <tr key={module} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-3 font-medium text-gray-900">
                        {label}
                      </td>
                      {Object.keys(actionLabels).map((action) => (
                        <td key={action} className="py-3 px-3 text-center">
                          <input
                            type="checkbox"
                            checked={
                              formData.permissions[
                                module as keyof typeof formData.permissions
                              ][
                                action as keyof typeof formData.permissions.dashboard
                              ]
                            }
                            onChange={(e) =>
                              handlePermissionChange(
                                module,
                                action,
                                e.target.checked
                              )
                            }
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

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
              {editingRole ? "Update Role" : "Create Role"}
            </Button>
          </div>
        </form>
      </Modal>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Role Management
          </h2>
          <Button
            onClick={() => handleOpenModal()}
            icon={Plus}
            iconPosition="left"
          >
            Create New Role
          </Button>
        </div>

        {/* Roles Table */}
        <Table
          columns={columns}
          data={roles}
          mobileCardTitle={(role) => role.name}
          mobileCardSubtitle={(role) => getPermissionSummary(role.permissions)}
          actions={(role) => (
            <>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleOpenModal(role)}
                icon={Edit}
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDelete(role.id)}
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
