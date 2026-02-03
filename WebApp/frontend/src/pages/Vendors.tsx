import React, { useState, useEffect } from "react";
import { Layout } from "../components/Layout/Layout";
import { Button } from "../components/Common/Button";
import { Modal } from "../components/Common/Modal";
import { FormField } from "../components/Common/FormField";
import { Table } from "../components/Common/Table";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Vendor } from "../types";
import VendorsHandler from "../handler/vendors";

export const Vendors: React.FC = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);
  const vendorsHandler = new VendorsHandler();
  const [formData, setFormData] = useState({
    name: "",
    category: "Material" as "Material" | "Labour" | "Other",
    contactPersonName: "",
    contactPersonPhone: "",
    address: "",
    gstin: "",
    panNumber: "",
  });

  const handleOpenModal = (vendor?: Vendor) => {
    if (vendor) {
      setEditingVendor(vendor);
      setFormData({
        name: vendor.name,
        category: vendor.category,
        contactPersonName: vendor.contactPersonName,
        contactPersonPhone: vendor.contactPersonPhone,
        address: vendor.address,
        gstin: vendor.gstin,
        panNumber: vendor.panNumber,
      });
    } else {
      setEditingVendor(null);
      setFormData({
        name: "",
        category: "Material",
        contactPersonName: "",
        contactPersonPhone: "",
        address: "",
        gstin: "",
        panNumber: "",
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate GSTIN (15 digits)
    if (formData.gstin.length !== 15) {
      alert("GSTIN must be exactly 15 digits");
      return;
    }

    const vendorData = {
      name: formData.name,
      category: formData.category,
      contactPersonName: formData.contactPersonName,
      contactPersonPhone: formData.contactPersonPhone,
      address: formData.address,
      gstin: formData.gstin,
      panNumber: formData.panNumber,
    };

    try {
      let response: any = {
        success: false,
      };

      if (editingVendor) {
        response = await vendorsHandler.put({
          ...vendorData,
          id: editingVendor.id,
        });
      } else {
        response = await vendorsHandler.post(vendorData);
      }

      if (!response.success) {
        alert(response.message || "Error saving vendor");
        return;
      }

      loadVendors();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving vendor:", error);
    }
  };

  const handleDelete = async (vendorId: string) => {
    if (window.confirm("Are you sure you want to delete this vendor?")) {
      try {
        await vendorsHandler.delete({ id: vendorId });
        loadVendors();
      } catch (error) {
        console.error("Error deleting vendor:", error);
      }
    }
  };

  const loadVendors = async () => {
    try {
      const response = await vendorsHandler.get({});
      if (response.success) {
        setVendors(response.data.items || []);
      }
    } catch (error) {
      console.error("Error loading vendors:", error);
    }
  };

  useEffect(() => {
    loadVendors();
  }, []);

  const getCategoryBadge = (category: string) => {
    const colors = {
      Material: "bg-blue-100 text-blue-800",
      Labour: "bg-green-100 text-green-800",
      Other: "bg-gray-100 text-gray-800",
    };
    return (
      <span
        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          colors[category as keyof typeof colors]
        }`}
      >
        {category}
      </span>
    );
  };

  const columns = [
    {
      key: "name",
      header: "Vendor Name",
      mobileLabel: "Name",
      showInMobile: true,
    },
    {
      key: "category",
      header: "Category",
      mobileLabel: "Category",
      showInMobile: true,
      render: (value: string) => getCategoryBadge(value),
    },
    {
      key: "contactPerson",
      header: "Contact Person",
      mobileLabel: "Contact",
      showInMobile: true,
      render: (_, vendor: Vendor) => (
        <div>
          <div className="font-medium">{vendor.contactPersonName}</div>
          <div className="text-gray-500 text-sm">
            {vendor.contactPersonPhone}
          </div>
        </div>
      ),
    },
    {
      key: "address",
      header: "Address",
      mobileLabel: "Address",
      showInMobile: false, // Hide in mobile to save space
      render: (value: string) => (
        <div className="max-w-xs truncate" title={value}>
          {value}
        </div>
      ),
    },
    {
      key: "gstin",
      header: "GSTIN",
      mobileLabel: "GSTIN",
      showInMobile: true,
      render: (value: string) => (
        <span className="font-mono text-sm">{value}</span>
      ),
    },
  ];

  const categoryOptions = [
    { value: "Material", label: "Material" },
    { value: "Labour", label: "Labour" },
    { value: "Other", label: "Other" },
  ];

  return (
    <Layout title="Vendors">
      {/* Create/Edit Vendor Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingVendor ? "Edit Vendor" : "Create New Vendor"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Vendor Name"
              value={formData.name}
              onChange={(value) =>
                setFormData({ ...formData, name: value as string })
              }
              required
            />
            <FormField
              label="Category"
              type="select"
              value={formData.category}
              onChange={(value) =>
                setFormData({
                  ...formData,
                  category: value as "Material" | "Labour" | "Other",
                })
              }
              options={categoryOptions}
              required
            />
          </div>

          {/* Contact Person */}
          <div className="border-t pt-4">
            <h4 className="text-lg font-medium text-gray-900 mb-4">
              Contact Person
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Contact Person Name"
                value={formData.contactPersonName}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    contactPersonName: value as string,
                  })
                }
                required
              />
              <FormField
                label="Phone Number"
                type="tel"
                value={formData.contactPersonPhone}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    contactPersonPhone: value as string,
                  })
                }
                required
              />
            </div>
          </div>

          <FormField
            label="Business Address"
            type="textarea"
            value={formData.address}
            onChange={(value) =>
              setFormData({ ...formData, address: value as string })
            }
            required
          />

          {/* Financial Details */}
          <div className="border-t pt-4">
            <h4 className="text-lg font-medium text-gray-900 mb-4">
              Financial Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="GSTIN (15 digits)"
                value={formData.gstin}
                onChange={(value) =>
                  setFormData({ ...formData, gstin: value as string })
                }
                placeholder="15-digit GSTIN code"
                required
              />
              <FormField
                label="PAN Number"
                value={formData.panNumber}
                onChange={(value) =>
                  setFormData({ ...formData, panNumber: value as string })
                }
                required
              />
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
              {editingVendor ? "Update Vendor" : "Create Vendor"}
            </Button>
          </div>
        </form>
      </Modal>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">All Vendors</h2>
          <Button
            onClick={() => handleOpenModal()}
            icon={Plus}
            iconPosition="left"
          >
            Add New Vendor
          </Button>
        </div>

        {/* Vendors Table */}
        <Table
          columns={columns}
          data={vendors}
          mobileCardTitle={(vendor) => vendor.name}
          mobileCardSubtitle={(vendor) =>
            `${vendor.contactPersonName} • ${vendor.contactPersonPhone}`
          }
          actions={(vendor) => (
            <>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleOpenModal(vendor)}
                icon={Edit}
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDelete(vendor.id)}
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
