import React, { useState, useEffect } from "react";
import { Layout } from "../components/Layout/Layout";
import { Button } from "../components/Common/Button";
import { Modal } from "../components/Common/Modal";
import { FormField } from "../components/Common/FormField";
import { Table } from "../components/Common/Table";
import { Plus, Edit, Trash2, Package, Award, Users } from "lucide-react";
import { Material, Brand, LabourType } from "../types";
import { UnitOptions } from "../data/constants";
import MaterialsHandler from "../handler/master_materials";
import BrandsHandler from "../handler/master_brands";
import LaboursHandler from "../handler/master_labours";

export const MasterDatabase: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"materials" | "brands" | "labour">(
    "materials"
  );

  // API Handlers
  const materialsHandler = new MaterialsHandler();
  const brandsHandler = new BrandsHandler();
  const laboursHandler = new LaboursHandler();

  // Materials State
  const [materials, setMaterials] = useState<Material[]>([]);
  const [isMaterialModalOpen, setIsMaterialModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null);
  const [materialFormData, setMaterialFormData] = useState({
    name: "",
    description: "",
    unit: "",
    brand_id: "",
    brand_name: "",
    maxUnitAmount: 0,
  });

  // Brands State
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [brandFormData, setBrandFormData] = useState({
    name: "",
    description: "",
  });

  // Labour Types State
  const [labourTypes, setLabourTypes] = useState<LabourType[]>([]);
  const [isLabourModalOpen, setIsLabourModalOpen] = useState(false);
  const [editingLabour, setEditingLabour] = useState<LabourType | null>(null);
  const [labourFormData, setLabourFormData] = useState({
    name: "",
    maxUnitAmount: 0,
  });

  // Material Handlers
  const handleOpenMaterialModal = (material?: Material) => {
    if (material) {
      setEditingMaterial(material);
      setMaterialFormData({
        name: material.name,
        description: material.description,
        unit: material.unit,
        brand_id: material.brand_id,
        brand_name: material.brand_name,
        maxUnitAmount: material.maxUnitAmount,
      });
    } else {
      setEditingMaterial(null);
      setMaterialFormData({
        name: "",
        description: "",
        unit: "%",
        brand_id: "",
        brand_name: "",
        maxUnitAmount: 0,
      });
    }
    setIsMaterialModalOpen(true);
  };

  const handleMaterialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const materialData = {
      name: materialFormData.name,
      description: materialFormData.description,
      unit: materialFormData.unit,
      brand_id: materialFormData.brand_id,
      brand_name: materialFormData.brand_name,
      maxUnitAmount: materialFormData.maxUnitAmount,
    };

    try {
      if (editingMaterial) {
        await materialsHandler.put({ ...materialData, id: editingMaterial.id });
      } else {
        await materialsHandler.post(materialData);
      }
      loadMaterials();
      setIsMaterialModalOpen(false);
    } catch (error) {
      console.error("Error saving material:", error);
    }
  };

  const handleDeleteMaterial = async (materialId: string) => {
    if (window.confirm("Are you sure you want to delete this material?")) {
      try {
        await materialsHandler.delete({ id: materialId });
        loadMaterials();
      } catch (error) {
        console.error("Error deleting material:", error);
      }
    }
  };

  // Brand Handlers
  const handleOpenBrandModal = (brand?: Brand) => {
    if (brand) {
      setEditingBrand(brand);
      setBrandFormData({
        name: brand.name,
        description: brand.description,
      });
    } else {
      setEditingBrand(null);
      setBrandFormData({
        name: "",
        description: "",
      });
    }
    setIsBrandModalOpen(true);
  };

  const handleBrandSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const brandData = {
      name: brandFormData.name,
      description: brandFormData.description,
    };

    try {
      if (editingBrand) {
        await brandsHandler.put({ ...brandData, id: editingBrand.id });
      } else {
        await brandsHandler.post(brandData);
      }
      loadBrands();
      setIsBrandModalOpen(false);
    } catch (error) {
      console.error("Error saving brand:", error);
    }
  };

  const handleDeleteBrand = async (brandId: string) => {
    if (window.confirm("Are you sure you want to delete this brand?")) {
      try {
        await brandsHandler.delete({ id: brandId });
        loadBrands();
      } catch (error) {
        console.error("Error deleting brand:", error);
      }
    }
  };

  // Labour Type Handlers
  const handleOpenLabourModal = (labour?: LabourType) => {
    if (labour) {
      setEditingLabour(labour);
      setLabourFormData({
        name: labour.name,
        maxUnitAmount: labour.maxUnitAmount,
      });
    } else {
      setEditingLabour(null);
      setLabourFormData({
        name: "",
        maxUnitAmount: 0,
      });
    }
    setIsLabourModalOpen(true);
  };

  const handleLabourSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const labourData = {
      name: labourFormData.name,
      maxUnitAmount: labourFormData.maxUnitAmount,
    };

    try {
      if (editingLabour) {
        await laboursHandler.put({ ...labourData, id: editingLabour.id });
      } else {
        await laboursHandler.post(labourData);
      }
      loadLabourTypes();
      setIsLabourModalOpen(false);
    } catch (error) {
      console.error("Error saving labour type:", error);
    }
  };

  const handleDeleteLabour = async (labourId: string) => {
    if (window.confirm("Are you sure you want to delete this labour type?")) {
      try {
        await laboursHandler.delete({ id: labourId });
        loadLabourTypes();
      } catch (error) {
        console.error("Error deleting labour type:", error);
      }
    }
  };

  // Load functions
  const loadMaterials = async () => {
    try {
      const response = await materialsHandler.get({});
      if (response.success) {
        setMaterials(response.data.items || []);
      }
    } catch (error) {
      console.error("Error loading materials:", error);
    }
  };

  const loadBrands = async () => {
    try {
      const response = await brandsHandler.get({});
      if (response.success) {
        setBrands(response.data.items || []);
      }
    } catch (error) {
      console.error("Error loading brands:", error);
    }
  };

  const loadLabourTypes = async () => {
    try {
      const response = await laboursHandler.get({});
      if (response.success) {
        setLabourTypes(response.data.items || []);
      }
    } catch (error) {
      console.error("Error loading labour types:", error);
    }
  };

  useEffect(() => {
    loadMaterials();
    loadBrands();
    loadLabourTypes();
  }, []);

  // Table Columns
  const materialColumns = [
    {
      key: "name",
      header: "Material Name",
      mobileLabel: "Name",
      showInMobile: true,
    },
    {
      key: "brand_name",
      header: "Brand",
      mobileLabel: "Brand",
      showInMobile: false,
      render: (value: string) => (
        <div className="max-w-xs truncate" title={value}>
          {value}
        </div>
      ),
    },
    {
      key: "unit",
      header: "Unit",
      mobileLabel: "Unit",
      showInMobile: true,
    },
    {
      key: "maxUnitAmount",
      header: "Max Rate (₹)",
      mobileLabel: "Max Rate",
      showInMobile: true,
      render: (value: number) => `₹${value.toLocaleString()}`,
    },
  ];

  const brandOptions = brands.map((brand) => ({
    label: brand.name,
    value: brand.id,
  }));

  const brandColumns = [
    {
      key: "name",
      header: "Brand Name",
      mobileLabel: "Name",
      showInMobile: true,
    },
    {
      key: "description",
      header: "Description",
      mobileLabel: "Description",
      showInMobile: true,
      render: (value: string) => (
        <div className="max-w-xs truncate" title={value}>
          {value}
        </div>
      ),
    },
  ];

  const labourColumns = [
    {
      key: "name",
      header: "Labour Type",
      mobileLabel: "Type",
      showInMobile: true,
    },
    {
      key: "maxUnitAmount",
      header: "Max Amount (₹)",
      mobileLabel: "Max Amount",
      showInMobile: true,
      render: (value: number) => `₹${value.toLocaleString()}`,
    },
  ];

  const tabs = [
    {
      id: "materials",
      label: "Materials",
      icon: Package,
      count: materials.length,
    },
    { id: "brands", label: "Brands", icon: Award, count: brands.length },
    {
      id: "labour",
      label: "Labour Types",
      icon: Users,
      count: labourTypes.length,
    },
  ];

  return (
    <Layout title="Master Database">
      {/* Material Modal */}
      <Modal
        isOpen={isMaterialModalOpen}
        onClose={() => setIsMaterialModalOpen(false)}
        title={editingMaterial ? "Edit Material" : "Add New Material"}
        size="md"
      >
        <form
          onSubmit={handleMaterialSubmit}
          className="flex flex-col gap-4 h-full"
        >
          <FormField
            label="Material Name"
            value={materialFormData.name}
            onChange={(value) =>
              setMaterialFormData({
                ...materialFormData,
                name: value as string,
              })
            }
            required
          />
          <FormField
            label="Brand (Optional)"
            type="select"
            value={materialFormData.brand_id}
            onChange={(value) => {
              let selectedBrand = brands.find((v) => v.id == value);
              setMaterialFormData({
                ...materialFormData,
                brand_id: value as string,
                brand_name: selectedBrand?.name || "",
              });
            }}
            options={brandOptions}
          />

          <FormField
            label="Description"
            type="textarea"
            value={materialFormData.description}
            onChange={(value) =>
              setMaterialFormData({
                ...materialFormData,
                description: value as string,
              })
            }
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Unit"
              value={materialFormData.unit}
              type="select"
              options={UnitOptions}
              onChange={(value) =>
                setMaterialFormData({
                  ...materialFormData,
                  unit: value as string,
                })
              }
              className="w-full"
              required
            />
            <FormField
              label="Max Unit Rate (₹)"
              type="number"
              value={materialFormData.maxUnitAmount}
              onChange={(value) =>
                setMaterialFormData({
                  ...materialFormData,
                  maxUnitAmount: value as number,
                })
              }
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsMaterialModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingMaterial ? "Update Material" : "Add Material"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Brand Modal */}
      <Modal
        isOpen={isBrandModalOpen}
        onClose={() => setIsBrandModalOpen(false)}
        title={editingBrand ? "Edit Brand" : "Add New Brand"}
        size="md"
      >
        <form onSubmit={handleBrandSubmit} className="flex flex-col gap-4">
          <FormField
            label="Brand Name"
            value={brandFormData.name}
            onChange={(value) =>
              setBrandFormData({ ...brandFormData, name: value as string })
            }
            required
          />

          <FormField
            label="Description"
            type="textarea"
            value={brandFormData.description}
            onChange={(value) =>
              setBrandFormData({
                ...brandFormData,
                description: value as string,
              })
            }
          />

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsBrandModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingBrand ? "Update Brand" : "Add Brand"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Labour Type Modal */}
      <Modal
        isOpen={isLabourModalOpen}
        onClose={() => setIsLabourModalOpen(false)}
        title={editingLabour ? "Edit Labour Type" : "Add New Labour Type"}
        size="md"
      >
        <form onSubmit={handleLabourSubmit} className="flex flex-col gap-4">
          <FormField
            label="Labour Type Name"
            value={labourFormData.name}
            onChange={(value) =>
              setLabourFormData({ ...labourFormData, name: value as string })
            }
            placeholder="e.g., Mason, Carpenter, Electrician"
            required
          />

          <FormField
            label="Max Unit Amount (₹)"
            type="number"
            value={labourFormData.maxUnitAmount}
            onChange={(value) =>
              setLabourFormData({
                ...labourFormData,
                maxUnitAmount: value as number,
              })
            }
            required
          />

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsLabourModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingLabour ? "Update Labour Type" : "Add Labour Type"}
            </Button>
          </div>
        </form>
      </Modal>
      <div className="space-y-6">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                  <span className="bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Materials Tab */}
        {activeTab === "materials" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Materials</h2>
              <Button
                onClick={() => handleOpenMaterialModal()}
                icon={Plus}
                iconPosition="left"
              >
                Add Material
              </Button>
            </div>

            <Table
              columns={materialColumns}
              data={materials}
              mobileCardTitle={(material) => material.name}
              mobileCardSubtitle={(material) =>
                `${
                  material.unit
                } • Max: ₹${material.maxUnitAmount.toLocaleString()}`
              }
              actions={(material) => (
                <>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleOpenMaterialModal(material)}
                    icon={Edit}
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteMaterial(material.id)}
                    icon={Trash2}
                    className="text-red-600 hover:text-red-700"
                  />
                </>
              )}
            />
          </div>
        )}

        {/* Brands Tab */}
        {activeTab === "brands" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">Brands</h2>
              <Button
                onClick={() => handleOpenBrandModal()}
                icon={Plus}
                iconPosition="left"
              >
                Add Brand
              </Button>
            </div>

            <Table
              columns={brandColumns}
              data={brands}
              mobileCardTitle={(brand) => brand.name}
              mobileCardSubtitle={(brand) => brand.description}
              actions={(brand) => (
                <>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleOpenBrandModal(brand)}
                    icon={Edit}
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteBrand(brand.id)}
                    icon={Trash2}
                    className="text-red-600 hover:text-red-700"
                  />
                </>
              )}
            />
          </div>
        )}

        {/* Labour Types Tab */}
        {activeTab === "labour" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">
                Labour Types
              </h2>
              <Button
                onClick={() => handleOpenLabourModal()}
                icon={Plus}
                iconPosition="left"
              >
                Add Labour's Type
              </Button>
            </div>

            <Table
              columns={labourColumns}
              data={labourTypes}
              mobileCardTitle={(labour) => labour.name}
              mobileCardSubtitle={(labour) =>
                `Max: ₹${labour.maxUnitAmount.toLocaleString()}`
              }
              actions={(labour) => (
                <>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleOpenLabourModal(labour)}
                    icon={Edit}
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteLabour(labour.id)}
                    icon={Trash2}
                    className="text-red-600 hover:text-red-700"
                  />
                </>
              )}
            />
          </div>
        )}
      </div>
    </Layout>
  );
};
