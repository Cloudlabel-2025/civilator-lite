import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Layout } from "../../components/Layout/Layout";
import { Button } from "../../components/Common/Button";
import { Modal } from "../../components/Common/Modal";
import { FormField } from "../../components/Common/FormField";
import FileUpload from "../../components/Common/UploadFiles";
import { Table } from "../../components/Common/Table";
import { Plus, Edit, Trash2, FileText, Landmark, Wallet } from "lucide-react";
import utils from "../../helpers/utils";
import PreviewFiles from "../../components/Common/PreviewFiles";
import { StatsCard } from "../../components/Common/StatsCard";
import PaymentsHandler from "../../handler/payments";
import EmployeesHandler from "../../handler/employees";
import BudgetAllocationsHandler from "../../handler/budget_allocations";
import { PermissionGuard } from "../../components/Common/PermissionGuard";

interface Payment {
  id: string;
  site_id: string;
  amount: number;
  payment_from: string;
  paid_at: number;
  payment_mode: string;
  transaction_id?: string;
  remarks?: string;
  attachments?: any[];
}

export const Payments: React.FC = () => {
  const { siteId } = useParams();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState<Payment | null>(null);
  const paymentsHandler = new PaymentsHandler();
  const CurrentDate = new Date().toISOString().split("T")[0];

  const [formData, setFormData] = useState({
    amount: "",
    payment_from: "client",
    paid_at: CurrentDate,
    payment_mode: "cash",
    transaction_id: "",
    remarks: "",
    attachments: [] as File[],
  });

  const [isAllocateModalOpen, setIsAllocateModalOpen] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]);
  const [allocateFormData, setAllocateFormData] = useState({
    employee_id: "",
    employee_name: "",
    amount: "",
    allocated_at: CurrentDate,
    remarks: "",
  });

  const budgetAllocationsHandler = new BudgetAllocationsHandler();
  const employeesHandler = new EmployeesHandler();

  const [StatsCardsData, setStatsCardsData] = useState<any[]>([
    {
      title: "Total Payments",
      value: 0,
      icon: Landmark,
      iconColor: "text-blue-600",
      borderColor: "border-blue-600",
    },
    {
      title: "Client Payments",
      value: 0,
      icon: Landmark,
      iconColor: "text-red-600",
      borderColor: "border-red-600",
    },
    {
      title: "My Payments",
      value: 0,
      icon: Landmark,
      iconColor: "text-green-600",
      borderColor: "border-green-600",
    },
    {
      title: "Budget Allocated",
      value: 0,
      icon: Wallet,
      iconColor: "text-purple-600",
      borderColor: "border-purple-600",
    },
  ]);

  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewFiles, setPreviewFiles] = useState<any[]>([]);

  const handleOpenModal = async (payment?: Payment) => {
    if (payment) {
      setEditingPayment(payment);
      setFormData({
        amount: payment.amount.toString(),
        payment_from: payment.payment_from,
        paid_at: new Date(parseInt(String(payment.paid_at)))
          .toISOString()
          .split("T")[0],
        payment_mode: payment.payment_mode,
        transaction_id: payment.transaction_id || "",
        remarks: payment.remarks || "",
        attachments: payment.attachments || [],
      });
    } else {
      setEditingPayment(null);
      setFormData({
        amount: "",
        payment_from: "client",
        paid_at: CurrentDate,
        payment_mode: "cash",
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
    formDataToSend.append("payment_from", formData.payment_from);
    formDataToSend.append("paid_at", new Date(formData.paid_at).getTime());
    formDataToSend.append("payment_mode", formData.payment_mode);
    formDataToSend.append("transaction_id", formData.transaction_id);
    formDataToSend.append("remarks", formData.remarks);

    formData.attachments.forEach((file) => {
      formDataToSend.append("attachments", file);
    });

    try {
      let response: any = { success: false };

      if (editingPayment) {
        formDataToSend.append("id", editingPayment.id);
        response = await paymentsHandler.put(formDataToSend);
      } else {
        response = await paymentsHandler.post(formDataToSend);
      }

      if (!response.success) {
        alert(response.message || "Error saving payment");
        return;
      }

      loadPayments();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving payment:", error);
    }
  };

  const handleDelete = async (payment: any) => {
    if (window.confirm("Are you sure you want to delete this entry?")) {
      try {
        if (payment.payment_from === "allocation") {
          await budgetAllocationsHandler.delete({ id: payment.id });
        } else {
          await paymentsHandler.delete({ id: payment.id });
        }
        loadPayments();
      } catch (error) {
        console.error("Error deleting entry:", error);
      }
    }
  };

  const handleAllocateOpen = async () => {
    try {
      const response = await employeesHandler.get({});
      if (response.success) {
        setEmployees(response.data.items || []);
      }
      setAllocateFormData({
        employee_id: "",
        employee_name: "",
        amount: "",
        allocated_at: CurrentDate,
        remarks: "",
      });
      setIsAllocateModalOpen(true);
    } catch (error) {
      console.error("Error loading employees:", error);
    }
  };

  const handleAllocateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const selectedEmployee = employees.find(emp => emp.id === allocateFormData.employee_id);
      const response = await budgetAllocationsHandler.post({
        ...allocateFormData,
        employee_name: selectedEmployee?.name || "",
        site_id: siteId,
        allocated_at: new Date(allocateFormData.allocated_at).getTime(),
      });

      if (response.success) {
        setIsAllocateModalOpen(false);
        loadPayments();
      } else {
        alert(response.message || "Error allocating budget");
      }
    } catch (error) {
      console.error("Error allocating budget:", error);
    }
  };

  const loadPayments = async () => {
    try {
      const response = await paymentsHandler.get({ site_id: siteId });
      const budgetResponse = await budgetAllocationsHandler.get({ site_id: siteId });

      if (response.success && budgetResponse.success) {
        let paymentItems = response.data.items || [];
        let budgetItems = budgetResponse.data.items || [];

        // Process payments
        paymentItems = await Promise.all(
          paymentItems.map(async (i: any) => {
            let attachments = i.attachments || [];
            attachments = await Promise.all(
              attachments.map(async (a: any) => {
                return await utils.urlToFile(a.url, a.name);
              })
            );
            return {
              ...i,
              attachments: attachments || [],
            };
          })
        );

        // Process budget allocations to match list structure
        const processedBudgets = budgetItems.map((b: any) => ({
          ...b,
          payment_from: 'allocation',
          paid_at: b.allocated_at, // Map for sorting/display
          remarks: b.remarks || `Allocated to ${b.employee_name}`,
        }));

        // Merge and sort by date descending
        const allItems = [...paymentItems, ...processedBudgets].sort((a, b) =>
          Number(b.paid_at) - Number(a.paid_at)
        );

        // Add S.No after sorting
        const finalItems = allItems.map((item, idx) => ({
          ...item,
          sno: idx + 1,
        }));

        let _statsCardsData = [...StatsCardsData];

        // 1. Budget Allocated (Purple Card)
        const totalAllocated = budgetItems.reduce((acc: number, cur: any) =>
          acc + (Number(cur.amount) || 0), 0);
        _statsCardsData[3].value = `₹${totalAllocated.toLocaleString()}`;

        // 2. Client Payments (Red Card) = Client + Return (Project revenue recognition)
        const clientTotal = paymentItems.reduce((acc: number, cur: any) => {
          if (cur.payment_from === 'client' || cur.payment_from === 'return') {
            return acc + (Number(cur.amount) || 0);
          }
          return acc;
        }, 0);
        _statsCardsData[1].value = `₹${clientTotal.toLocaleString()}`;

        // 3. My Payments (Green Card) = Self - Return (Net builder investment)
        const selfTotal = paymentItems.reduce((acc: number, cur: any) => {
          if (cur.payment_from === 'self') return acc + (Number(cur.amount) || 0);
          if (cur.payment_from === 'return') return acc - (Number(cur.amount) || 0);
          return acc;
        }, 0);
        _statsCardsData[2].value = `₹${selfTotal.toLocaleString()}`;

        // 4. Total Payments (Blue Card) = (Client + Self) - Allocated
        const grossCashIn = paymentItems.reduce((acc: number, cur: any) => {
          if (cur.payment_from === 'return') return acc; // Return is a deduction from builder investment, not total inflow
          return acc + (Number(cur.amount) || 0);
        }, 0);
        _statsCardsData[0].value = `₹${(grossCashIn - totalAllocated).toLocaleString()}`;

        setStatsCardsData(_statsCardsData);
        setPayments(finalItems);
      }
    } catch (error) {
      console.error("Error loading payments:", error);
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
    loadPayments();
    renderParamsAction();
  }, []);

  const getPaymentFromBadge = (type: string) => {
    const colors = {
      client: "bg-green-100 text-green-800",
      self: "bg-blue-100 text-blue-800",
      return: "bg-orange-100 text-orange-800",
      allocation: "bg-purple-100 text-purple-800",
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
      key: "payment_from",
      header: "Payment From",
      mobileLabel: "From",
      showInMobile: true,
      render: (value: string) => getPaymentFromBadge(value),
    },
    {
      key: "payment_mode",
      header: "Payment Mode",
      mobileLabel: "Mode",
      showInMobile: false,
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

  const paymentFromOptions = [
    { value: "client", label: "Client" },
    { value: "self", label: "Self" },
    { value: "return", label: "Return" },
  ];

  const paymentModeOptions = [
    { value: "cash", label: "Cash" },
    { value: "bank", label: "Bank Transfer" },
    { value: "cheque", label: "Cheque" },
    { value: "upi", label: "UPI" },
  ];

  return (
    <Layout title="Payments">
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
        title={editingPayment ? "Edit Payment" : "Create New Payment"}
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
              label="Payment From"
              type="select"
              value={formData.payment_from}
              onChange={(value) =>
                setFormData({ ...formData, payment_from: value as string })
              }
              options={paymentFromOptions}
              required
            />
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
              {editingPayment ? "Update Payment" : "Create Payment"}
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isAllocateModalOpen}
        onClose={() => setIsAllocateModalOpen(false)}
        title="Allocate Budget to Employee"
        size="lg"
      >
        <form onSubmit={handleAllocateSubmit} className="flex flex-col gap-4">
          <FormField
            label="Employee"
            type="select"
            value={allocateFormData.employee_id}
            onChange={(value) => setAllocateFormData({ ...allocateFormData, employee_id: value as string })}
            options={employees.map(emp => ({ value: emp.id, label: `${emp.name} (${emp.role_name})` }))}
            required
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Amount"
              type="number"
              value={allocateFormData.amount}
              onChange={(value) => setAllocateFormData({ ...allocateFormData, amount: value as string })}
              required
            />
            <FormField
              label="Date"
              type="date"
              value={allocateFormData.allocated_at}
              onChange={(value) => setAllocateFormData({ ...allocateFormData, allocated_at: value as string })}
              required
            />
          </div>
          <FormField
            label="Remarks"
            type="textarea"
            value={allocateFormData.remarks}
            onChange={(value) => setAllocateFormData({ ...allocateFormData, remarks: value as string })}
          />
          <div className="flex justify-end space-x-3 pt-6 border-t">
            <Button type="button" variant="outline" onClick={() => setIsAllocateModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Allocate</Button>
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
          <h2 className="text-xl font-semibold text-gray-900">Payments</h2>
          <div className="flex gap-2">
            <PermissionGuard module="payments" action="create">
              <Button
                onClick={() => handleAllocateOpen()}
                variant="outline"
                icon={Wallet}
                iconPosition="left"
              >
                Allocate Budget
              </Button>
            </PermissionGuard>
            <PermissionGuard module="payments" action="create">
              <Button
                onClick={() => handleOpenModal()}
                icon={Plus}
                iconPosition="left"
              >
                Add New
              </Button>
            </PermissionGuard>
          </div>
        </div>

        <Table
          columns={columns}
          data={payments}
          mobileCardTitle={(payment) => `₹${payment.amount.toLocaleString()}`}
          mobileCardSubtitle={(payment) =>
            `${payment.payment_from} • ${new Date(
              parseInt(payment.paid_at)
            ).toLocaleDateString()}`
          }
          actions={(payment) => (
            <>
              <PermissionGuard module="payments" action="edit">
                {payment.payment_from !== "allocation" && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleOpenModal(payment)}
                    icon={Edit}
                  />
                )}
              </PermissionGuard>
              <PermissionGuard module="payments" action="delete">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDelete(payment)}
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
