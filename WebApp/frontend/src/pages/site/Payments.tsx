import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Layout } from "../../components/Layout/Layout";
import { Button } from "../../components/Common/Button";
import { Modal } from "../../components/Common/Modal";
import { FormField } from "../../components/Common/FormField";
import FileUpload from "../../components/Common/UploadFiles";
import { Table } from "../../components/Common/Table";
import { Plus, Edit, Trash2, FileText, Landmark } from "lucide-react";
import utils from "../../helpers/utils";
import PreviewFiles from "../../components/Common/PreviewFiles";
import { StatsCard } from "../../components/Common/StatsCard";
import PaymentsHandler from "../../handler/payments";

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

  const handleDelete = async (paymentId: string) => {
    if (window.confirm("Are you sure you want to delete this payment?")) {
      try {
        await paymentsHandler.delete({ id: paymentId });
        loadPayments();
      } catch (error) {
        console.error("Error deleting payment:", error);
      }
    }
  };

  const loadPayments = async () => {
    try {
      const response = await paymentsHandler.get({
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

        let _statsCardsData = [...StatsCardsData];
        _statsCardsData[0].value = `₹${items
          .reduce((acc: number, cur: Payment) => acc + Number(cur.amount), 0)
          .toLocaleString()}`;

        _statsCardsData[1].value = `₹${items
          .reduce(
            (acc: number, cur: Payment) =>
              acc + (cur.payment_from === "client" ? Number(cur.amount) : 0),
            0
          )
          .toLocaleString()}`;

        _statsCardsData[2].value = `₹${items
          .reduce(
            (acc: number, cur: Payment) =>
              acc + (cur.payment_from === "self" ? Number(cur.amount) : 0),
            0
          )
          .toLocaleString()}`;

        setStatsCardsData(_statsCardsData);

        setPayments(items);
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
          <Button
            onClick={() => handleOpenModal()}
            icon={Plus}
            iconPosition="left"
          >
            Add New
          </Button>
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
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleOpenModal(payment)}
                icon={Edit}
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleDelete(payment.id)}
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
