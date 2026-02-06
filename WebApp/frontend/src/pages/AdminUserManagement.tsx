import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, LogOut } from "lucide-react";
import { Button } from "../components/Common/Button";
import { Modal } from "../components/Common/Modal";
import { FormField } from "../components/Common/FormField";
import { Table } from "../components/Common/Table";
import AdminHandler from "../handler/admin";
import { useAuth } from "../hooks/AuthContext";

export const AdminUserManagement: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const adminHandler = new AdminHandler();
  const { logout } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleOpenModal = (user?: any) => {
    if (user) {
      setEditingUser(user);
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone || "",
      });
    } else {
      setEditingUser(null);
      setFormData({
        name: "",
        email: "",
        phone: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const data = editingUser ? { ...formData, id: editingUser.id } : formData;
      const response = editingUser ? await adminHandler.put(data) : await adminHandler.post(data);

      if (response.success) {
        setIsModalOpen(false);
        loadUsers();
      }
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  const handleDelete = async (userId: string) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await adminHandler.delete({ id: userId });
        if (response.success) {
          loadUsers();
        }
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const loadUsers = async () => {
    try {
      const response = await adminHandler.get({});
      if (response.success) {
        setUsers(response.data.items || []);
      }
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const columns = [
    {
      key: "name",
      header: "Name",
      mobileLabel: "Name",
      showInMobile: true,
    },
    {
      key: "email",
      header: "Email",
      mobileLabel: "Email",
      showInMobile: true,
    },
    {
      key: "phone",
      header: "Phone",
      mobileLabel: "Phone",
      showInMobile: false,
    },
    {
      key: "created_at",
      header: "Created At",
      mobileLabel: "Created",
      showInMobile: true,
      render: (value: any) => new Date(value).toLocaleString(),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingUser ? "Edit User" : "Add New User"}
        size="md"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <FormField
            label="Name"
            value={formData.name}
            onChange={(value) =>
              setFormData({ ...formData, name: value as string })
            }
            required
          />
          <FormField
            label="Email"
            type="email"
            value={formData.email}
            onChange={(value) =>
              setFormData({ ...formData, email: value as string })
            }
            required
          />
          <FormField
            label="Phone"
            type="tel"
            value={formData.phone}
            onChange={(value) =>
              setFormData({ ...formData, phone: value as string })
            }
          />

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingUser ? "Update User" : "Add User"}
            </Button>
          </div>
        </form>
      </Modal>

      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-2">Manage parent users who can access the system</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => handleOpenModal()}
              icon={Plus}
              iconPosition="left"
            >
              Add New User
            </Button>
            <Button
              onClick={logout}
              icon={LogOut}
              iconPosition="left"
              variant="outline"
            >
              Logout
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <Table
            columns={columns}
            data={users}
            mobileCardTitle={(user) => user.name}
            mobileCardSubtitle={(user) => user.email}
            actions={(user) => (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleOpenModal(user)}
                  icon={Edit}
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(user.id)}
                  icon={Trash2}
                  className="text-red-600 hover:text-red-700"
                />
              </>
            )}
          />
        </div>
      </div>
    </div>
  );
};
