import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Layout } from "../../components/Layout/Layout";
import { Button } from "../../components/Common/Button";
import { Modal } from "../../components/Common/Modal";
import { FormField } from "../../components/Common/FormField";
import FileUpload from "../../components/Common/UploadFiles";
import { Table } from "../../components/Common/Table";

import {
  Plus,
  Edit,
  Trash2,
  FileText,
  ShoppingBag,
  Package,
} from "lucide-react";
import { Vendor, Material as MasterMaterial } from "../../types";
import utils from "../../helpers/utils";
import PreviewFiles from "../../components/Common/PreviewFiles";
import { StatsCard } from "../../components/Common/StatsCard";
import VendorsHandler from "../../handler/vendors";
import InventoryHandler from "../../handler/inventory";
import MaterialsMasterHandler from "../../handler/master_materials";

export const Materials: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"procurement" | "inventory">(
    "procurement"
  );
  const tabs = [
    {
      id: "procurement",
      label: "Procurement",
      icon: ShoppingBag,
    },
    {
      id: "inventory",
      label: "Inventory",
      icon: Package,
    },
  ];
  const { siteId } = useParams();
  const [materials, setMaterials] = useState<any[]>([]);
  const [inventories, setInventories] = useState<any[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [masterMaterials, setMasterMaterials] = useState<MasterMaterial[]>([]);
  const [isProcurementModalOpen, setIsProcurementModalOpen] = useState(false);
  const [isInventoryModalOpen, setIsInventoryModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<any | null>(null);
  const [inventoryEditingMaterial, setInventoryEditingMaterial] =
    useState<any>(null);
  const inventoryHandler = new InventoryHandler();
  const vendorsHandler = new VendorsHandler();
  const materialsMasterHandler = new MaterialsMasterHandler();
  const CurrentDate = new Date().toISOString().split("T")[0];
  const [procurementFormData, setProcurementFormData] = useState({
    vendor_id: "",
    vendor_name: "",
    payment_type: "credit",
    purchased_at: CurrentDate,
    payment_mode: "cash",
    transaction_id: "",
    remarks: "",

    due_date: "",
    charges: 0,
    discount: 0,
    paid_amount: 0,
    materials: [] as any,

    attachments: [] as File[],
  });
  const [inventoryFormData, setInventoryFormData] = useState({
    material_id: "",
    material_name: "",
    material_unit: "",
    brand_id: "",
    brand_name: "",
    type: "",
    balance_quantity: 0,
    quantity: 0,
    unit_rate: 0,
    remarks: "",
  });

  const [SelectedAddInventoryMaterials, setSelectedAddInventoryMaterials] =
    useState<any>({});

  const [AddInventoryMaterialSearchQuery, setAddInventoryMaterialSearchQuery] =
    useState("");

  const [ProcurementStatsCardsData, setProcurementStatsCardsData] = useState<
    any[]
  >([
    {
      title: "Total Amount",
      value: 0,
      icon: ShoppingBag,
      iconColor: "text-blue-600",
      borderColor: "border-blue-600",
    },
    {
      title: "Balance Due",
      value: 0,
      icon: ShoppingBag,
      iconColor: "text-red-600",
      borderColor: "border-red-600",
    },
    {
      title: "Paid Amount",
      value: 0,
      icon: ShoppingBag,
      iconColor: "text-green-600",
      borderColor: "border-green-600",
    },
  ]);
  const [InventoryStatsCardsData, setInventoryStatsCardsData] = useState<any[]>(
    [
      {
        title: "In Stock",
        value: 0,
        icon: Package,
        iconColor: "text-green-600",
        borderColor: "border-green-600",
      },
      {
        title: "Out of Stock",
        value: 0,
        icon: Package,
        iconColor: "text-red-600",
        borderColor: "border-red-600",
      },
      {
        title: "Critical Stock",
        value: 0,
        icon: Package,
        iconColor: "text-yellow-600",
        borderColor: "border-yellow-600",
      },
    ]
  );

  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewFiles, setPreviewFiles] = useState<any[]>([]);

  const calculateMaterialAmount = (material: any) => {
    let subtotal =
      parseFloat(material.unitrate || 0) * parseFloat(material.quantity || 0);
    let tax_percent = parseInt(material.tax || 0);
    return subtotal + (subtotal * tax_percent) / 100;
  };
  const calculateMaterialsSubTotalAmount = (data: any) => {
    return data.materials.reduce((acc: any, curr: any) => {
      return acc + calculateMaterialAmount(curr);
    }, 0);
  };

  const calculateTotalAmount = (data: any) => {
    return (
      calculateMaterialsSubTotalAmount(data) +
      parseFloat(data.charges || 0) -
      parseFloat(data.discount || 0)
    );
  };

  const calculateBalanceDue = (data: any) => {
    return calculateTotalAmount(data) - parseFloat(data.paid_amount || 0);
  };

  const handleOpenProdurementModal = async (material?: any) => {
    if (material) {
      setEditingMaterial(material);
      setProcurementFormData({
        vendor_id: material.vendor_id,
        vendor_name: material.vendor_name,
        payment_type: material.payment_type,
        purchased_at: material.purchased_at || CurrentDate,
        payment_mode: material.payment_mode || "cash",
        transaction_id: material.transaction_id || "",
        remarks: material.remarks || "",
        materials: material.materials || [],
        due_date: material.due_date || "",
        discount: material.discount || 0,
        charges: material.charges || 0,
        paid_amount: material.paid_amount || 0,
        attachments: material.attachments || [],
      });
    } else {
      setEditingMaterial(null);
      setProcurementFormData({
        vendor_id: "",
        vendor_name: "",
        payment_type: "credit",
        purchased_at: CurrentDate,
        payment_mode: "cash",
        transaction_id: "",
        remarks: "",
        due_date: "",
        charges: 0,
        discount: 0,
        paid_amount: 0,
        materials: [],
        attachments: [],
      });
    }
    setIsProcurementModalOpen(true);
  };

  const handleOpenInventoryModal = async (material?: any) => {
    if (material) {
      let unit_rate =
        masterMaterials.filter(
          (item: any) => item.id === material.material_id
        )[0]?.maxUnitAmount || 0;

      setInventoryEditingMaterial(material);
      setInventoryFormData({
        material_id: material.material_id,
        material_name: material.material_name,
        material_unit: material.material_unit || "",
        brand_id: material.brand_id || "",
        brand_name: material.brand_name || "",
        type: "add_stock",
        unit_rate: unit_rate || 0,
        balance_quantity: material.balance_quantity || 0,
        quantity: material.quantity,
        remarks: material.remarks || "",
      });
    } else {
      setInventoryEditingMaterial(null);
      setInventoryFormData({
        material_id: "",
        material_name: "",
        material_unit: "",
        brand_id: "",
        brand_name: "",
        type: "add_stock",
        quantity: 0,
        unit_rate: 0,
        balance_quantity: 0,
        remarks: "",
      });
    }
    setIsInventoryModalOpen(true);
  };

  const handleProcurementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("site_id", String(siteId));

    formDataToSend.append("vendor_id", procurementFormData.vendor_id);
    formDataToSend.append("vendor_name", procurementFormData.vendor_name);
    formDataToSend.append("payment_type", procurementFormData.payment_type);
    formDataToSend.append("purchased_at", procurementFormData.purchased_at);
    formDataToSend.append("payment_mode", procurementFormData.payment_mode);
    formDataToSend.append("transaction_id", procurementFormData.transaction_id);
    formDataToSend.append("remarks", procurementFormData.remarks);
    formDataToSend.append("due_date", procurementFormData.due_date);

    formDataToSend.append("discount", String(procurementFormData.discount));
    formDataToSend.append("charges", String(procurementFormData.charges));
    formDataToSend.append(
      "paid_amount",
      String(procurementFormData.paid_amount)
    );
    formDataToSend.append(
      "materials",
      JSON.stringify(procurementFormData.materials)
    );

    procurementFormData.attachments.forEach((file) => {
      formDataToSend.append("attachments", file);
    });

    try {
      let response: any = { success: false };

      if (editingMaterial) {
        formDataToSend.append("id", editingMaterial.id);
        response = await inventoryHandler.put(formDataToSend);
      } else {
        response = await inventoryHandler.post(formDataToSend);
      }

      if (!response.success) {
        alert(response.message || "Error saving material");
        return;
      }

      loadMaterials();
      loadInventory();
      setIsProcurementModalOpen(false);
    } catch (error) {
      console.error("Error saving material:", error);
    }
  };

  const handleInventorySubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inventoryEditingMaterial) return;
    let payload = {
      site_id: siteId,
      id: inventoryEditingMaterial.id,
      material_id: inventoryFormData.material_id,
      material_name: inventoryFormData.material_name,
      material_unit: inventoryFormData.material_unit,
      brand_id: inventoryFormData.brand_id,
      brand_name: inventoryFormData.brand_name,
      type: inventoryFormData.type,
      quantity: inventoryFormData.quantity,
      amount:
        parseInt(String(inventoryFormData.quantity)) *
        parseInt(String(inventoryFormData.unit_rate)),
      unit_rate: inventoryFormData.unit_rate,
      remarks: inventoryFormData.remarks,
    };

    try {
      let response = await inventoryHandler.updateInventory(payload);

      if (!response.success) {
        alert(response.message || "Error saving material");
        return;
      }
      loadInventory();
      setIsInventoryModalOpen(false);
    } catch (error) {
      console.error("Error saving material:", error);
    }
  };

  const handleInventoryBulkAdd = async (e: React.FormEvent) => {
    e.preventDefault();

    let selected_materials = [];

    for (let key in SelectedAddInventoryMaterials) {
      let material = masterMaterials.find((i: any) => i.id == key);
      if (!material) continue;

      let quantity = parseInt(SelectedAddInventoryMaterials[key] || 0);
      let maxUnitAmount = parseInt(String(material.maxUnitAmount)) || 0;

      selected_materials.push({
        material_id: key,
        material_name: material.name,
        material_unit: material.unit,
        brand_id: material.brand_id,
        brand_name: material.brand_name,
        unit_rate: maxUnitAmount || 0,
        amount: maxUnitAmount * quantity,
        quantity: quantity,
      });
    }

    if (!selected_materials.length) {
      alert("Please select at least one material");
      return;
    }

    let payload = {
      site_id: siteId,
      materials: selected_materials,
    };

    try {
      let response = await inventoryHandler.updateInventoryBulk(payload);

      if (!response.success) {
        alert(response.message || "Error saving material");
        return;
      }
      loadInventory();
      setSelectedAddInventoryMaterials({});
      setIsInventoryModalOpen(false);
      setAddInventoryMaterialSearchQuery("");
    } catch (error) {
      console.error("Error saving material:", error);
    }
  };

  const handleProcurementDelete = async (materialId: string) => {
    if (window.confirm("Are you sure you want to delete this material?")) {
      try {
        await inventoryHandler.delete({ id: materialId });
        loadMaterials();
      } catch (error) {
        console.error("Error deleting material:", error);
      }
    }
  };

  const loadMaterials = async () => {
    try {
      const response = await inventoryHandler.get({
        site_id: siteId,
      });
      if (response.success) {
        let items = response.data.items || [];

        items = await Promise.all(
          items.map(async (i: any, idx: number) => {
            let attachments = i.attachments || [];
            attachments = await Promise.all(
              attachments.map(async (a: any) => {
                return await utils.urlToFile(a.url, a.name);
              })
            );
            return {
              sno: idx + 1,
              ...i,
              attachments: attachments || [],
            };
          })
        );

        let total_amount = 0;
        let total_paid = 0;
        let total_due = 0;

        items.forEach((i: any) => {
          total_amount += calculateTotalAmount(i);
          total_paid += parseFloat(i.paid_amount || 0);
          total_due += calculateBalanceDue(i);
        });

        let _ProcurementstatsCardsData = [...ProcurementStatsCardsData];

        _ProcurementstatsCardsData[0].value = `₹${total_amount.toFixed(0)}`;
        _ProcurementstatsCardsData[1].value = `₹${total_due.toFixed(0)}`;
        _ProcurementstatsCardsData[2].value = `₹${total_paid.toFixed(0)}`;

        setProcurementStatsCardsData(_ProcurementstatsCardsData);

        setMaterials(items);
      }
    } catch (error) {
      console.error("Error loading materials:", error);
    }
  };
  const loadInventory = async () => {
    try {
      const response = await inventoryHandler.getInventory({
        site_id: siteId,
      });
      if (response.success) {
        let items = response.data.items || [];

        items = items.map((i: any, idx: number) => ({
          ...i,
          sno: idx + 1,
        }));

        let _InventoryStatsCardsData = [...InventoryStatsCardsData];

        _InventoryStatsCardsData[0].value = `${items
          .reduce(
            (acc: number, cur: any) =>
              acc + (Number(cur.balance_quantity) > 0 ? 1 : 0),
            0
          )
          .toLocaleString()}`;

        _InventoryStatsCardsData[1].value = `${items
          .reduce(
            (acc: number, cur: any) =>
              acc + (Number(cur.balance_quantity) <= 0 ? 1 : 0),
            0
          )
          .toLocaleString()}`;

        _InventoryStatsCardsData[2].value = `${items
          .reduce(
            (acc: number, cur: any) =>
              acc + (Number(cur.balance_qty) <= 5 ? 1 : 0),
            0
          )
          .toLocaleString()}`;

        setInventoryStatsCardsData(_InventoryStatsCardsData);
        setInventories(items);
      }
    } catch (error) {
      console.error("Error loading materials:", error);
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
  const loadMasterMaterials = async () => {
    try {
      const response = await materialsMasterHandler.get({});
      if (response.success) {
        setMasterMaterials(response.data.items || []);
      }
    } catch (error) {
      console.error("Error loading materials:", error);
    }
  };

  const renderParamsAction = () => {
    const params = new URLSearchParams(window.location.search);
    let action = params.get("action");

    if (action == "add_procurement") {
      setIsProcurementModalOpen(true);
    } else if (action == "add_inventory") {
      setIsInventoryModalOpen(true);
    }
  };

  useEffect(() => {
    loadVendors();
    loadMaterials();
    loadInventory();
    loadMasterMaterials();

    renderParamsAction();
  }, []);

  const getPaymentTypeBadge = (type: string) => {
    const colors = {
      credit: "bg-red-100 text-red-800",
      debit: "bg-green-100 text-green-800",
    };
    return (
      <span
        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
          colors[type as keyof typeof colors]
        }`}
      >
        {type}
      </span>
    );
  };

  const procurementColumns = [
    {
      key: "sno",
      header: "S.No",
      mobileLabel: "S.No",
      showInMobile: false,
    },
    {
      key: "purchased_at",
      header: "Date",
      mobileLabel: "Date",
      showInMobile: true,
    },
    {
      key: "vendor_name",
      header: "Vendor",
      mobileLabel: "Vendor",
      showInMobile: true,
    },
    {
      key: "material",
      header: "Materials",
      mobileLabel: "Materials",
      showInMobile: true,
      render: (_: string, row: any) => {
        return row?.materials.length;
      },
    },
    {
      key: "total_amount",
      header: "Total Amount",
      mobileLabel: "Total Amount",
      showInMobile: true,
      render: (_: string, row: any) =>
        `₹${parseFloat(String(calculateTotalAmount(row))).toFixed(2)}`,
    },
    {
      key: "paid_amount",
      header: "Paid Amount",
      mobileLabel: "Paid Amount",
      showInMobile: true,
      render: (_: string, row: any) =>
        `₹${parseFloat(String(row.paid_amount)).toFixed(2)}`,
    },
    {
      key: "balance_due",
      header: "Balance Due",
      mobileLabel: "Balance Due",
      showInMobile: true,
      render: (_: string, row: any) =>
        `₹${parseFloat(String(calculateBalanceDue(row))).toFixed(2)}`,
    },
    {
      key: "due_date",
      header: "Due Date",
      mobileLabel: "Due Date",
      showInMobile: false,
    },
    {
      key: "payment_mode",
      header: "Payment Mode",
      mobileLabel: "Mode",
      showInMobile: false,
    },
    {
      key: "payment_type",
      header: "Type",
      mobileLabel: "Type",
      showInMobile: true,
      render: (value: string) => getPaymentTypeBadge(value),
    },
    {
      key: "attachments",
      header: "Files",
      mobileLabel: "Files",
      showInMobile: true,
      render: (value: string[]) =>
        value?.length ? (
          <div
            className="flex items-center gap-2 cursor-pointer hover:underline"
            onClick={() => {
              setPreviewFiles(value);
              setIsPreviewModalOpen(true);
            }}
          >
            <FileText className="w-4 h-4 text-blue-600" />
            <span className="text-xs text-blue-700">
              {value.length} file(s)
            </span>
          </div>
        ) : (
          "N/A"
        ),
    },
  ];
  const inventoryColumns = [
    {
      key: "sno",
      header: "S.No",
      mobileLabel: "S.No",
      showInMobile: false,
    },
    {
      key: "material_name",
      header: "Material",
      mobileLabel: "Material",
      showInMobile: true,
    },
    {
      key: "brand_name",
      header: "Brand",
      mobileLabel: "Brand",
      showInMobile: true,
    },
    {
      key: "purchased_quantity",
      header: "Total added",
      mobileLabel: "Total added",
      showInMobile: true,
      render: (value: number, row: any) =>
        `${value} ${row.material_unit || ""}`,
    },
    {
      key: "balance_quantity",
      header: "In stock qty",
      mobileLabel: "In stock qty",
      showInMobile: true,
      render: (value: number, row: any) =>
        `${value} ${row.material_unit || ""}`,
    },
    {
      key: "used_quantity",
      header: "Used from Stock",
      mobileLabel: "Used from Stock",
      showInMobile: true,
      render: (value: number, row: any) =>
        `${value} ${row.material_unit || ""}`,
    },
  ];

  const vendorOptions = vendors.map((v) => ({
    value: v.id,
    label: v.name,
  }));

  const masterMaterialOptions = masterMaterials.map((v) => ({
    value: v.id,
    label: v.name + ` (${v.brand_name})`,
  }));

  const gstOptions = [
    { value: "0", label: "0%" },
    { value: "5", label: "5%" },
    { value: "12", label: "12%" },
    { value: "18", label: "18%" },
    { value: "28", label: "28%" },
  ];

  const paymentModeOptions = [
    { value: "cash", label: "Cash" },
    { value: "bank", label: "Bank Transfer" },
    { value: "cheque", label: "Cheque" },
    { value: "upi", label: "UPI" },
  ];

  const paymentTypeOptions = [
    { value: "debit", label: "Debit" },
    { value: "credit", label: "Credit" },
  ];

  const renderProcurement = () => {
    return (
      <>
        <div className="mobile-view-disable flex justify-center gap-4 ">
          {ProcurementStatsCardsData.map((card) => (
            <StatsCard
              key={card.title}
              title={card.title}
              value={card.value}
              icon={card.icon}
              iconColor={card.iconColor}
              borderColor={card.borderColor}
              trend={card.trend}
            />
          ))}
        </div>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Purchase</h2>
          <Button
            onClick={() => handleOpenProdurementModal()}
            icon={Plus}
            iconPosition="left"
          >
            Purchase
          </Button>
        </div>

        <Table
          columns={procurementColumns}
          data={materials}
          mobileCardTitle={(material) => material.vendor_name}
          mobileCardSubtitle={(material) =>
            `${material.vendor_name} • ${material.purchased_at}`
          }
          actions={(material) => (
            <>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleOpenProdurementModal(material)}
                icon={Edit}
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleProcurementDelete(material.id)}
                icon={Trash2}
                className="text-red-600 hover:text-red-700"
              />
            </>
          )}
        />
      </>
    );
  };

  const handleAddProcurementMaterial = (e: any) => {
    e.preventDefault();
    let material = {
      id: utils.getUniqueId(),
      material_id: "",
      material_name: "",
      quantity: 0,
      unitrate: 0,
      max_unitrate: 0,
      material_unit: "",
      tax: 0,
    };
    setProcurementFormData({
      ...procurementFormData,
      materials: [...procurementFormData.materials, material],
    });
  };

  const handleDeleteProcurementMaterial = (id: string) => {
    setProcurementFormData({
      ...procurementFormData,
      materials: procurementFormData.materials.filter((m: any) => m.id !== id),
    });
  };

  const renderInventory = () => {
    return (
      <>
        <div className="mobile-view-disable flex justify-center gap-4 ">
          {InventoryStatsCardsData.map((card) => (
            <StatsCard
              key={card.title}
              title={card.title}
              value={card.value}
              icon={card.icon}
              iconColor={card.iconColor}
              borderColor={card.borderColor}
              trend={card.trend}
            />
          ))}
        </div>
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">Inventory</h2>
          <Button
            onClick={() => handleOpenInventoryModal()}
            icon={Plus}
            iconPosition="left"
          >
            Add Material
          </Button>
        </div>

        <Table
          columns={inventoryColumns}
          data={inventories}
          mobileCardTitle={(material) => material.material_name}
          mobileCardSubtitle={(material) =>
            `In stock: ${material.balance_quantity} ${
              material.material_unit || ""
            }`
          }
          actions={(material) => (
            <>
              <Button
                size="sm"
                variant="outline_primary"
                onClick={() => handleOpenInventoryModal(material)}
                icon={Plus}
              >
                Update
              </Button>
            </>
          )}
        />
      </>
    );
  };

  return (
    <Layout title="Materials">
      {isPreviewModalOpen && (
        <PreviewFiles
          isPreviewModalOpen={isPreviewModalOpen}
          files={previewFiles}
          setIsPreviewModalOpen={setIsPreviewModalOpen}
        />
      )}

      {/* Procurement Modal */}
      <Modal
        isOpen={isProcurementModalOpen}
        onClose={() => setIsProcurementModalOpen(false)}
        title={editingMaterial ? "Edit Purchase" : "Material Purchase"}
        size="lg"
      >
        <form
          onSubmit={handleProcurementSubmit}
          className="w-full flex flex-col gap-5"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Purchase Date"
              type="date"
              value={procurementFormData.purchased_at || CurrentDate}
              onChange={(value) =>
                setProcurementFormData({
                  ...procurementFormData,
                  purchased_at: value as string,
                })
              }
              required
            />
            <FormField
              label="Vendor"
              type="select"
              value={procurementFormData.vendor_id}
              onChange={(value) =>
                setProcurementFormData({
                  ...procurementFormData,
                  vendor_id: value as string,
                  vendor_name: vendors.find((v) => v.id === value)?.name || "",
                })
              }
              options={vendorOptions}
              required
            />
          </div>

          {procurementFormData.materials.length > 0 ? (
            <div className="w-full flex flex-col mb-4 border-b border-gray-400">
              <div className="flex items-center justify-between">
                <span className="text-md font-semibold text-gray-900">
                  Material Items
                </span>
                <Button
                  type="button"
                  variant="outline_primary"
                  icon={Plus}
                  onClick={handleAddProcurementMaterial}
                >
                  Add
                </Button>
              </div>
              <div className="flex flex-col gap-3">
                {procurementFormData.materials?.map((material: any) => (
                  <div
                    key={`material-${material.id}`}
                    className="flex flex-col gap-3 py-4 border-b border-dashed border-gray-200 last:border-b-0"
                  >
                    <div className="flex items-center gap-3">
                      <FormField
                        label="Material"
                        type="select"
                        value={material.material_id || ""}
                        max_label={`Total: ₹${parseFloat(
                          String(calculateMaterialAmount(material))
                        ).toFixed(2)}`}
                        onChange={(value) => {
                          let masterMaterial = masterMaterials.find(
                            (m) => m.id == value
                          );

                          setProcurementFormData({
                            ...procurementFormData,
                            materials: procurementFormData.materials.map(
                              (m: any) =>
                                m.id === material.id
                                  ? {
                                      ...m,
                                      material_id: value,
                                      material_name: masterMaterial?.name || "",
                                      brand_id: masterMaterial?.brand_id || "",
                                      brand_name:
                                        masterMaterial?.brand_name || "",
                                      material_unit: masterMaterial?.unit || "",
                                      unitrate:
                                        masterMaterial?.maxUnitAmount || "",
                                      max_unitrate:
                                        masterMaterial?.maxUnitAmount || "",
                                    }
                                  : m
                            ),
                          });
                        }}
                        options={masterMaterialOptions}
                        className="w-full"
                        required
                      />
                      <Trash2
                        className="w-5 h-5 text-red-600"
                        onClick={() =>
                          handleDeleteProcurementMaterial(material.id)
                        }
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <FormField
                        label="Quantity"
                        type="number"
                        value={material.quantity || 0}
                        onChange={(value) => {
                          setProcurementFormData({
                            ...procurementFormData,
                            materials: procurementFormData.materials.map(
                              (m: any) =>
                                m.id === material.id
                                  ? {
                                      ...m,
                                      quantity: value,
                                    }
                                  : m
                            ),
                          });
                        }}
                        required
                        className="w-full"
                      />
                      <FormField
                        label="Unit rate"
                        type="number"
                        value={material.unitrate || 0}
                        onChange={(value) => {
                          setProcurementFormData({
                            ...procurementFormData,
                            materials: procurementFormData.materials.map(
                              (m: any) =>
                                m.id === material.id
                                  ? {
                                      ...m,
                                      unitrate: value,
                                    }
                                  : m
                            ),
                          });
                        }}
                        required
                        className="w-full"
                      />
                      <FormField
                        label="GST %"
                        type="select"
                        value={material.tax || "0"}
                        onChange={(value) => {
                          setProcurementFormData({
                            ...procurementFormData,
                            materials: procurementFormData.materials.map(
                              (m: any) =>
                                m.id === material.id
                                  ? {
                                      ...m,
                                      tax: value,
                                    }
                                  : m
                            ),
                          });
                        }}
                        className="w-full"
                        options={gstOptions}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-col">
              <Button
                type="button"
                variant="primary_light"
                icon={Plus}
                className="w-full"
                onClick={handleAddProcurementMaterial}
              >
                Add Materials
              </Button>
            </div>
          )}

          <div className="flex flex-col gap-4 pb-4 border-b border-gray-300">
            <div className="grid grid-cols-2 gap-4 justify-between items-center">
              <span className="text-md font-medium">Sub Total</span>
              <span className="text-lg font-semibold">
                ₹
                {parseFloat(
                  String(calculateMaterialsSubTotalAmount(procurementFormData))
                ).toFixed(2)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 justify-between items-center">
              <span className="text-md font-medium">Discount (-)</span>
              <FormField
                type="number"
                value={procurementFormData.discount || 0}
                onChange={(value) => {
                  setProcurementFormData({
                    ...procurementFormData,
                    discount: value,
                  });
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 justify-between items-center ">
              <span className="text-md font-medium">Charges (+)</span>
              <FormField
                type="number"
                value={procurementFormData.charges || 0}
                onChange={(value) => {
                  setProcurementFormData({
                    ...procurementFormData,
                    charges: value,
                  });
                }}
              />
            </div>
          </div>
          <div className="flex flex-col gap-4 pb-4 border-b border-gray-300">
            <div className="grid grid-cols-2 gap-4 justify-between items-center">
              <span className="text-md font-medium">Total Amount</span>
              <span className="text-lg font-semibold">
                ₹
                {parseFloat(
                  String(calculateTotalAmount(procurementFormData))
                ).toFixed(2)}
              </span>
            </div>
            <div className="grid grid-cols-2 gap-4 justify-between items-center">
              <span className="text-md font-medium">Paid Amount</span>
              <FormField
                type="number"
                value={procurementFormData.paid_amount || 0}
                onChange={(value) => {
                  setProcurementFormData({
                    ...procurementFormData,
                    paid_amount: value,
                  });
                }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 justify-between items-center">
              <span className="text-md font-medium">Balance Due</span>
              <span className="text-lg font-semibold">
                ₹
                {parseFloat(
                  String(calculateBalanceDue(procurementFormData))
                ).toFixed(2)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Payment Mode"
              type="select"
              value={procurementFormData.payment_mode}
              onChange={(value) =>
                setProcurementFormData({
                  ...procurementFormData,
                  payment_mode: value as string,
                })
              }
              options={paymentModeOptions}
            />
            <FormField
              label="Payment Type"
              type="select"
              value={procurementFormData.payment_type}
              onChange={(value) =>
                setProcurementFormData({
                  ...procurementFormData,
                  payment_type: value as string,
                })
              }
              options={paymentTypeOptions}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Transaction ID (optional)"
              value={procurementFormData.transaction_id}
              onChange={(value) =>
                setProcurementFormData({
                  ...procurementFormData,
                  transaction_id: value as string,
                })
              }
            />
            <FormField
              label="Due Date"
              type="date"
              value={procurementFormData.due_date || ""}
              onChange={(value) =>
                setProcurementFormData({
                  ...procurementFormData,
                  due_date: value as string,
                })
              }
            />
          </div>

          <FormField
            label="Remarks"
            type="textarea"
            value={procurementFormData.remarks}
            onChange={(value) =>
              setProcurementFormData({
                ...procurementFormData,
                remarks: value as string,
              })
            }
          />

          <FileUpload
            label="Upload Files"
            type="multiple"
            files={procurementFormData.attachments}
            has_geodata={true}
            setFiles={(files: any) =>
              setProcurementFormData({
                ...procurementFormData,
                attachments: files,
              })
            }
          />

          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsProcurementModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {editingMaterial ? "Update Purchase" : "Purchase"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Inventory Update Modal */}
      <Modal
        isOpen={isInventoryModalOpen}
        onClose={() => {
          setSelectedAddInventoryMaterials({});
          setIsInventoryModalOpen(false);
          setAddInventoryMaterialSearchQuery("");
        }}
        title={inventoryEditingMaterial ? "Update Material" : "Add Material"}
        size="lg"
      >
        {inventoryEditingMaterial ? (
          <form
            onSubmit={handleInventorySubmit}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col gap-1 border-b border-gray-200 pb-4">
              <span className="font-bold">
                {inventoryFormData.material_name}
              </span>
              <span className="text-sm text-gray-500">
                {inventoryFormData.brand_name}
              </span>
              <span className="text-sm text-gray-900 ">
                In stock:{inventoryFormData.balance_quantity}
                <span className="ml-1">{inventoryFormData.material_unit}</span>
              </span>
            </div>

            <div className="flex gap-4">
              <FormField
                label="Use From Stock"
                value={inventoryFormData.type === "used_stock"}
                name="type"
                type="radio"
                onChange={(value) => {
                  setInventoryFormData({
                    ...inventoryFormData,
                    type: "used_stock",
                    quantity: Math.min(
                      inventoryFormData.quantity,
                      inventoryFormData.balance_quantity
                    ),
                  });
                }}
                label_right={true}
                className="flex items-center gap-2"
              />
              <FormField
                label="Add To Stock"
                value={inventoryFormData.type === "add_stock"}
                name="type"
                type="radio"
                onChange={(value) => {
                  setInventoryFormData({
                    ...inventoryFormData,
                    type: "add_stock",
                  });
                }}
                label_right={true}
                className="flex items-center gap-2"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Quantity"
                type="number"
                value={inventoryFormData.quantity || 0}
                value_label={inventoryFormData.material_unit || ""}
                max={inventoryFormData.balance_quantity || Infinity}
                onChange={(value) => {
                  setInventoryFormData({
                    ...inventoryFormData,
                    quantity:
                      inventoryFormData.type == "used_stock"
                        ? Math.min(
                            value as number,
                            inventoryFormData.balance_quantity || Infinity
                          )
                        : (value as number),
                  });
                }}
                required
              />
            </div>

            <FormField
              label="Remarks"
              type="textarea"
              value={procurementFormData.remarks}
              onChange={(value) =>
                setProcurementFormData({
                  ...procurementFormData,
                  remarks: value as string,
                })
              }
            />
            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsInventoryModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Update Material</Button>
            </div>
          </form>
        ) : (
          <form
            onSubmit={handleInventoryBulkAdd}
            className="flex flex-col gap-4"
          >
            {/* search bar */}

            <div className="flex gap-4">
              <FormField
                value={
                  Object.keys(SelectedAddInventoryMaterials).length ==
                  masterMaterials.length
                }
                name="select-all"
                type="checkbox"
                onChange={(_) => {
                  setAddInventoryMaterialSearchQuery("");
                  let value = !(
                    Object.keys(SelectedAddInventoryMaterials).length ==
                    masterMaterials.length
                  );

                  if (value) {
                    setSelectedAddInventoryMaterials(
                      masterMaterials.reduce(
                        (acc: any, material: any) => ({
                          ...acc,
                          [material.id]: 0,
                        }),
                        {}
                      )
                    );
                  } else {
                    setSelectedAddInventoryMaterials({});
                  }
                }}
                className="flex items-center gap-2"
                inputClass="!w-[18px] !h-[18px]"
              />
              <FormField
                type="text"
                placeholder="Search Material"
                value={AddInventoryMaterialSearchQuery}
                onChange={(value) =>
                  setAddInventoryMaterialSearchQuery(value as string)
                }
                className="w-full"
              />
            </div>
            <div className="flex-1 flex flex-col gap-4">
              {masterMaterials
                .filter(
                  (material: any) =>
                    !inventories.some(
                      (inv: any) => inv.material_id == material.id
                    )
                )
                .filter((material: any) =>
                  AddInventoryMaterialSearchQuery.length
                    ? material.name
                        .toLowerCase()
                        .includes(AddInventoryMaterialSearchQuery.toLowerCase())
                    : true
                )
                .map((material: any, idx: number) => (
                  <div key={`material-${material.id}`}>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-4">
                        <FormField
                          value={Object.keys(
                            SelectedAddInventoryMaterials
                          ).includes(material.id)}
                          name={`select-${material.id}`}
                          type="checkbox"
                          onChange={(_) => {
                            let value = !Object.keys(
                              SelectedAddInventoryMaterials
                            ).includes(material.id);

                            if (value) {
                              setSelectedAddInventoryMaterials({
                                ...SelectedAddInventoryMaterials,
                                [material.id]: 0,
                              });
                            } else {
                              let newSelectedAddInventoryMaterials = {
                                ...SelectedAddInventoryMaterials,
                              };
                              delete newSelectedAddInventoryMaterials[
                                material.id
                              ];
                              setSelectedAddInventoryMaterials(
                                newSelectedAddInventoryMaterials
                              );
                            }
                          }}
                          label_right={true}
                          className="flex items-center gap-2"
                          inputClass="!w-[18px] !h-[18px]"
                        />
                        <div className="flex flex-col">
                          <span className="text-md text-gray-900">
                            {material.name}
                          </span>
                          <span className="text-sm text-gray-500">
                            {material.brand_name}
                          </span>
                        </div>
                      </div>
                      {Object.keys(SelectedAddInventoryMaterials).includes(
                        material.id
                      ) && (
                        <div className="flex items-center gap-2 justify-end">
                          <FormField
                            label="Quantity"
                            value_label={material.unit || ""}
                            type="number"
                            value={SelectedAddInventoryMaterials[material.id]}
                            onChange={(value) => {
                              setSelectedAddInventoryMaterials({
                                ...SelectedAddInventoryMaterials,
                                [material.id]: value as number,
                              });
                            }}
                            required
                            inputClass="w-[100px]"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
            {masterMaterials.filter(
              (material: any) =>
                !inventories.some((inv: any) => inv.material_id == material.id)
            ).length <= 0 && (
              <div className="text-center text-gray-500">
                No new Materials found
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setAddInventoryMaterialSearchQuery("");
                  setSelectedAddInventoryMaterials({});
                  setIsInventoryModalOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit">Add Material</Button>
            </div>
          </form>
        )}
      </Modal>

      <div className="space-y-6">
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
                </button>
              );
            })}
          </nav>
        </div>

        {activeTab === "procurement" && renderProcurement()}
        {activeTab === "inventory" && renderInventory()}
      </div>
    </Layout>
  );
};
