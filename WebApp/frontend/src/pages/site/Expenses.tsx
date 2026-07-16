import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Layout } from "../../components/Layout/Layout";
import { Button } from "../../components/Common/Button";
import { Modal } from "../../components/Common/Modal";
import { FormField } from "../../components/Common/FormField";
import FileUpload from "../../components/Common/UploadFiles";
import { Table } from "../../components/Common/Table";
import { Plus, Edit, Trash2, FileText, ReceiptText } from "lucide-react";
import { Expense, Vendor } from "../../types";
import utils from "../../helpers/utils";
import PreviewFiles from "../../components/Common/PreviewFiles";
import { StatsCard } from "../../components/Common/StatsCard";
import VendorsHandler from "../../handler/vendors";
import ExpensesHandler from "../../handler/expenses";
import BudgetAllocationsHandler from "../../handler/budget_allocations";
import { PermissionGuard } from "../../components/Common/PermissionGuard";
import { useAuth } from "../../hooks/AuthContext";

export const Expenses: React.FC = () => {
  const { siteId } = useParams();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const expensesHandler = new ExpensesHandler();
  const vendorsHandler = new VendorsHandler();
  const budgetAllocationsHandler = new BudgetAllocationsHandler();
  const user = JSON.parse(localStorage.getItem("userdetails") || "{}");
  const CurrentDate = new Date().toISOString().split("T")[0];
  const [formData, setFormData] = useState({
    amount: "",
    category: "vendor",
    party_id: "",
    party_name: "",
    paid_at: CurrentDate,
    payment_mode: "cash",
    payment_type: "credit",
    transaction_id: "",
    remarks: "",
    attachments: [] as File[],
  });

  const [StatsCardsData, setStatsCardsData] = useState<any[]>([
    {
      title: "Total Expenses",
      value: 0,
      icon: ReceiptText,
      iconColor: "text-blue-600",
      borderColor: "border-blue-600",
    },
    {
      title: "Budget Allocated",
      value: 0,
      icon: ReceiptText,
      iconColor: "text-purple-600",
      borderColor: "border-purple-600",
    },
  ]);

  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewFiles, setPreviewFiles] = useState<any[]>([]);

  const handleOpenModal = async (expense?: Expense) => {
    if (expense) {
      setEditingExpense(expense);
      setFormData({
        amount: expense.amount.toString(),
        category: expense.category,
        party_id: expense.party_id || "",
        party_name: expense.party_name || "",
        paid_at: new Date(parseInt(String(expense.paid_at)))
          .toISOString()
          .split("T")[0],
        payment_mode: expense.payment_mode,
        payment_type: expense.payment_type,
        transaction_id: expense.transaction_id || "",
        remarks: expense.remarks || "",
        attachments: expense.attachments || [],
      });
    } else {
      setEditingExpense(null);
      setFormData({
        amount: "",
        category: "vendor",
        party_id: "",
        party_name: "",
        paid_at: CurrentDate,
        payment_mode: "cash",
        payment_type: "credit",
        transaction_id: "",
        remarks: "",
        attachments: [],
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("site_id", String(siteId));
    formDataToSend.append("amount", formData.amount);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("party_id", formData.party_id);
    formDataToSend.append("party_name", formData.party_name);
    formDataToSend.append("paid_at", new Date(formData.paid_at).getTime());
    formDataToSend.append("payment_mode", formData.payment_mode);
    formDataToSend.append("payment_type", formData.payment_type);
    formDataToSend.append("transaction_id", formData.transaction_id);
    formDataToSend.append("remarks", formData.remarks);

    formData.attachments.forEach((file) => {
      formDataToSend.append("attachments", file);
    });
    try {
      let response: any = { success: false };

      if (editingExpense) {
        formDataToSend.append("id", editingExpense.id);
        response = await expensesHandler.put(formDataToSend);
      } else {
        response = await expensesHandler.post(formDataToSend);
      }

      if (!response.success) {
        alert(response.message || "Error saving expense");
        return;
      }

      loadExpenses();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving expense:", error);
    }
  };

  const handleDelete = async (expenseId: string) => {
    if (window.confirm("Are you sure you want to delete this expense?")) {
      try {
        await expensesHandler.delete({ id: expenseId });
        loadExpenses();
      } catch (error) {
        console.error("Error deleting expense:", error);
      }
    }
  };

  const loadExpenses = async () => {
    try {
      const response = await expensesHandler.get({
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

        // Fetch Budget Allocations to include in Expenses list
        const budgetResponse = await budgetAllocationsHandler.get({ site_id: siteId });
        let totalAllocated = 0;
        let formattedAllocations: any[] = [];

        if (budgetResponse.success) {
          const allocations = budgetResponse.data.items || [];
          const filteredAllocations = allocations.filter((a: any) => a.status === "accepted");

          totalAllocated = filteredAllocations.reduce((acc: number, cur: any) => acc + (Number(cur.amount) || 0), 0);

          formattedAllocations = filteredAllocations.map((a: any) => ({
            ...a,
            id: a.id || a._id,
            paid_at: String(new Date(a.accepted_at || a.created_at).getTime()),
            category: "Budget Update",
            category_label: "Budget Allocation",
            party_name: "Staff Wallet",
            payment_mode: "Transfer",
            payment_type: "debit",
            remarks: a.remarks || `Allocated for site work. Trans ID: ${a.transaction_id || 'N/A'}`,
            amount: Number(a.amount),
            is_budget: true
          }));
        }

        // Merge regular expenses and formatted budget allocations
        const allItems = [...items, ...formattedAllocations].sort((a, b) => {
          return Number(b.paid_at) - Number(a.paid_at);
        });

        // Re-assign SNO based on the new sorted order
        const finalizedList = allItems.map((item, idx) => ({
          ...item,
          sno: idx + 1
        }));

        // Calculate card values
        let _statsCardsData = [...StatsCardsData];
        const rawExpensesTotal = items.reduce((acc: number, cur: Expense) => acc + Number(cur.amount), 0);

        // Card 1: Total Actual Expenses (spent amount)
        _statsCardsData[0].value = `₹${rawExpensesTotal.toLocaleString()}`;

        // Card 2: Remaining Budget (Allocated - Expenses)
        _statsCardsData[1].title = "Remaining Budget";
        _statsCardsData[1].value = `₹${(totalAllocated - rawExpensesTotal).toLocaleString()}`;
        _statsCardsData[1].iconColor = "text-purple-600";
        _statsCardsData[1].borderColor = "border-purple-600";

        setStatsCardsData(_statsCardsData);
        setExpenses(finalizedList);
      }
    } catch (error) {
      console.error("Error loading expenses:", error);
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
  const renderParamsAction = () => {
    const params = new URLSearchParams(window.location.search);
    let action = params.get("action");

    if (action == "add") {
      setIsModalOpen(true);
    }
  };
  useEffect(() => {
    loadVendors();
    loadExpenses();
    renderParamsAction();
  }, []);

  const getPaymentTypeBadge = (type: string) => {
    const colors = {
      credit: "bg-red-100 text-red-800",
      debit: "bg-green-100 text-green-800",
    };
    return (
      <span
        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${colors[type as keyof typeof colors]
          }`}
      >
        {type}
      </span>
    );
  };

  const columns = [
    {
      key: "sno",
      header: "S.No",
      mobileLabel: "S.No",
      showInMobile: false,
    },
    {
      key: "amount",
      header: "Amount",
      mobileLabel: "Amount",
      showInMobile: true,
      render: (value: number) => `₹${value.toLocaleString()}`,
    },
    {
      key: "paid_at",
      header: "Date",
      mobileLabel: "Date",
      showInMobile: true,
      render: (value: any) => new Date(parseInt(value)).toLocaleDateString(),
    },
    {
      key: "category",
      header: "Category",
      mobileLabel: "Category",
      showInMobile: true,
      render: (value: string) => {
        const category = categoryOptions.find((c) => c.value === value);
        return category?.label || value;
      },
    },
    {
      key: "party_name",
      header: "Party",
      mobileLabel: "Party",
      showInMobile: true,
      render: (value: string) => value || "N/A",
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

  const categoryOptions = [
    { value: "salary", label: "Salary / Wages" },
    { value: "material", label: "Material Purchase" },
    { value: "rental", label: "Equipment Rental" },
    { value: "fuel", label: "Fuel & Transport" },
    { value: "maintenance", label: "Site Maintenance" },
    { value: "subcontractor", label: "Sub-contractor Payment" },
    { value: "petty_cash", label: "Petty Cash" },
    { value: "vendor_advance", label: "Advance to Vendor" },
    { value: "other", label: "Other" },
  ];

  const vendorOptions = vendors.map((v) => ({
    value: v.id,
    label: v.name,
  }));

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

  return (
    <Layout title="Expenses">
      {isPreviewModalOpen && (
        <PreviewFiles
          isPreviewModalOpen={isPreviewModalOpen}
          files={previewFiles}
          setIsPreviewModalOpen={setIsPreviewModalOpen}
        />
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingExpense ? "Edit Expense" : "Create New Expense"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Amount"
              type="number"
              value={formData.amount}
              onChange={(value) =>
                setFormData({ ...formData, amount: value as string })
              }
              required
            />
            <FormField
              label="Date"
              type="date"
              value={formData.paid_at || CurrentDate}
              onChange={(value) =>
                setFormData({ ...formData, paid_at: value as string })
              }
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Category"
              type="select"
              value={formData.category}
              onChange={(value) =>
                setFormData({ ...formData, category: value as string })
              }
              options={categoryOptions}
              required
            />
            {formData.category === "vendor_advance" && (
              <FormField
                label="Vendor"
                type="select"
                value={formData.party_id}
                onChange={(value) =>
                  setFormData({
                    ...formData,
                    party_id: value as string,
                    party_name: vendors.find((v) => v.id === value)?.name || "",
                  })
                }
                options={vendorOptions}
                required
              />
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Payment Mode"
              type="select"
              value={formData.payment_mode}
              onChange={(value) =>
                setFormData({ ...formData, payment_mode: value as string })
              }
              options={paymentModeOptions}
              required
            />
          </div>

          <FormField
            label="Transaction ID (optional)"
            value={formData.transaction_id}
            onChange={(value) =>
              setFormData({ ...formData, transaction_id: value as string })
            }
          />

          <FormField
            label="Remarks"
            type="textarea"
            value={formData.remarks}
            onChange={(value) =>
              setFormData({ ...formData, remarks: value as string })
            }
          />

          <FileUpload
            label="Upload Files"
            type="multiple"
            files={formData.attachments}
            has_geodata={true}
            setFiles={(files: any) =>
              setFormData({ ...formData, attachments: files })
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
              {editingExpense ? "Update Expense" : "Create Expense"}
            </Button>
          </div>
        </form>
      </Modal>
      <div className="space-y-6">
        <div className="mobile-view-disable flex justify-center gap-6 ">
          {StatsCardsData.map((card) => (
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
          <h2 className="text-xl font-semibold text-gray-900">Expenses</h2>
          <PermissionGuard module="expenses" action="create">
            <Button
              onClick={() => handleOpenModal()}
              icon={Plus}
              iconPosition="left"
            >
              Add New
            </Button>
          </PermissionGuard>
        </div>

        <Table
          columns={columns}
          data={expenses}
          mobileCardTitle={(expense) => `₹${expense.amount.toLocaleString()}`}
          mobileCardSubtitle={(expense) =>
            `${expense.category} • ${new Date(
              parseInt(expense.paid_at)
            ).toLocaleDateString()}`
          }
          actions={(expense) => (
            <>
              <PermissionGuard module="expenses" action="edit">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleOpenModal(expense)}
                  icon={Edit}
                />
              </PermissionGuard>
              <PermissionGuard module="expenses" action="delete">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(expense.id)}
                  icon={Trash2}
                  className="text-red-600 hover:text-red-700"
                />
              </PermissionGuard>
            </>
          )}
        />
      </div>
    </Layout>
  );
};
