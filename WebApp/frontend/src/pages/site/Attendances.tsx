import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Layout } from "../../components/Layout/Layout";
import {
  Plus,
  ChevronLeft,
  ChevronRight,
  SearchIcon,
  Trash2,
  Edit,
  PlusCircle,
  RotateCwIcon,
  CheckCircle,
} from "lucide-react";
import { Button } from "../../components/Common/Button";
import { Modal } from "../../components/Common/Modal";
import { Vendor } from "../../types";
import { Table } from "../../components/Common/Table";
import { FormField } from "../../components/Common/FormField";
import Utils from "../../helpers/utils";
import VendorsHandler from "../../handler/vendors";
import AttendancesHandler from "../../handler/attendances";
import LaboursMasterHandler from "../../handler/master_labours";

export const Attendances: React.FC = () => {
  const [activeAttendanceTab, setActiveAttendanceTab] = useState<
    "all" | "vendor_labour" | "my_labour"
  >("all");

  const attendanceTabs = [
    {
      id: "all",
      label: "All",
    },
    {
      id: "vendor_labour",
      label: "Vendor Labour",
    },
    {
      id: "my_labour",
      label: "My Labour",
    },
  ];

  const { siteId } = useParams();

  const vendorsHandler = new VendorsHandler();
  const laboursMasterHandler = new LaboursMasterHandler();
  const attendancesHandler = new AttendancesHandler();

  const [isLabourModalOpen, setIsLabourModalOpen] = useState(false);
  const [editingLabour, setEditingLabour] = useState<any>(null);

  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState<any>(null);

  const [VendorMarkAttenModalOpen, setVendorMarkAttenModalOpen] =
    useState(false);
  const [VendorMarkAttenData, setVendorMarkAttenData] = useState<any>(null);

  const navigator = useNavigate();

  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [MasterLabours, setMasterLabours] = useState<any[]>([]);

  const [searchQuery, setSearchQuery] = useState<string>("");

  const LaboursOptions = MasterLabours.map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const SalaryTypeOptions = [
    {
      label: "Daily",
      value: "daily",
    },
    {
      label: "Monthly",
      value: "monthly",
    },
  ];

  const DateRef = useRef<HTMLInputElement>(null);
  const [CurrentDate, setCurrentDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [AttendanceSummary, setAttendanceSummary] = useState<any>({
    total_payable: 0,
    present: 0,
    halfday: 0,
    absent: 0,
  });

  const getCurrentDateMonth = (date: string) => {
    let _date = new Date(date).toString().split(" ");

    const day = _date[0];
    const month = _date[1];
    const date_no = _date[2];
    const year = _date[3];

    return {
      day,
      month,
      date_no,
      year,
    };
  };

  const triggerDateChange = () => {
    if (DateRef.current) DateRef.current.showPicker();
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;

    if (new Date(selectedDate) > new Date()) {
      alert("You can't go in future");
      return;
    } else setCurrentDate(selectedDate);
  };

  const handleMoveDate = (direction: "prev" | "next") => {
    let newDate = new Date(CurrentDate);

    if (direction == "prev") newDate.setDate(newDate.getDate() - 1);
    else newDate.setDate(newDate.getDate() + 1);

    let _newDate = newDate.toISOString().split("T")[0];

    if (new Date(_newDate) > new Date()) {
      alert("You can't go in future");
    } else {
      setCurrentDate(_newDate);
    }
  };

  const [vendorFormData, setVendorFormData] = useState({
    vendor_id: "",
    vendor_name: "",
    labours: [] as any[],
  });
  const [labourFormData, setLabourFormData] = useState({
    name: "",
    phone: "",
    type_id: "",
    type_name: "",
    max_unitrate: 0,
    salary_type: "daily",
    unitrate: 0,
    overtime_rate: 0,
  });

  const [AttendancesList, setAttendancesList] = useState<any[]>([]);

  const handleAttendanceTabChange = (id: string) => {
    setActiveAttendanceTab(id as any);
    loadAttendances(id);
  };

  const HandleAddVendorLabour = (e: any) => {
    e.preventDefault();

    setVendorFormData({
      ...vendorFormData,
      labours: [
        ...vendorFormData.labours,
        {
          id: Utils.getUniqueId(),
          labour_id: "",
          labour_name: "",
          max_unitrate: "",
        },
      ],
    });
  };

  const loadMasterLabours = async () => {
    try {
      const response = await laboursMasterHandler.get({});
      if (response.success) {
        setMasterLabours(response.data.items || []);
      }
    } catch (error) {
      console.error("Error loading labours:", error);
    }
  };

  const handleVendorSubmit = async (e: any) => {
    e.preventDefault();

    if (!vendorFormData.labours || vendorFormData.labours.length == 0) {
      alert("Please add at least one labour");
      return;
    }

    const payload = {
      site_id: siteId,
      type: "vendor_labour",
      vendor_id: vendorFormData.vendor_id,
      vendor_name: vendorFormData.vendor_name,
      labours: vendorFormData.labours || [],
    };

    try {
      let response = {
        success: false,
      };
      if (editingVendor) {
        response = await attendancesHandler.put({
          ...payload,
          id: editingVendor.id,
        });
      } else {
        response = await attendancesHandler.post(payload);
      }
      if (!response.success) {
        return;
      }
      handleClose(true);
    } catch (error) {
      console.error("Error saving employee:", error);
    }
  };

  const handleLabourSubmit = async (e: any) => {
    e.preventDefault();

    if (!labourFormData.name || labourFormData.name.length == 0) {
      alert("Please add labour name");
      return;
    }

    const payload = {
      site_id: siteId,
      type: "my_labour",

      name: labourFormData.name,
      phone: labourFormData.phone,
      type_id: labourFormData.type_id,
      type_name: labourFormData.type_name,
      max_unitrate: labourFormData.max_unitrate,
      salary_type: labourFormData.salary_type,
      unitrate: labourFormData.unitrate,
      overtime_rate: labourFormData.overtime_rate,
    };

    try {
      let response = {
        success: false,
      };
      if (editingLabour) {
        response = await attendancesHandler.put({
          ...payload,
          id: editingLabour.id,
        });
      } else {
        response = await attendancesHandler.post(payload);
      }
      if (!response.success) {
        return;
      }
      handleClose(true);
    } catch (error) {
      console.error("Error saving employee:", error);
    }
  };

  const handleAdd = (tab: string) => {
    if (tab == "vendor_labour" || tab == "all") {
      setEditingVendor(null);
      setIsVendorModalOpen(true);
    } else {
      setEditingLabour(null);
      setIsLabourModalOpen(true);
    }
  };

  const handleEdit = (attendance: any) => {
    if (attendance.type == "vendor_labour") {
      setEditingVendor(attendance);
      setIsVendorModalOpen(true);

      setVendorFormData({
        vendor_id: attendance.vendor_id,
        vendor_name: attendance.vendor_name,
        labours: attendance.labours || [],
      });
    } else {
      setEditingLabour(attendance);
      setIsLabourModalOpen(true);

      setLabourFormData({
        name: attendance.name,
        phone: attendance.phone,
        type_id: attendance.type_id,
        type_name: attendance.type_name,
        max_unitrate: attendance.max_unitrate,
        salary_type: attendance.salary_type,
        unitrate: attendance.unitrate,
        overtime_rate: attendance.overtime_rate,
      });
    }
  };

  const handleDelete = async (attendance: any) => {
    if (!confirm("Are you sure you want to delete this attendance?")) {
      return;
    }

    try {
      const response = await attendancesHandler.delete({
        id: attendance.id,
      });
      if (response.success) {
        loadAttendances();
      }
    } catch (error) {
      console.error("Error deleting attendance:", error);
    }
  };

  const handleClose = (reset: boolean = false) => {
    setIsVendorModalOpen(false);
    setVendorFormData({
      vendor_id: "",
      vendor_name: "",
      labours: [] as any[],
    });
    setIsLabourModalOpen(false);
    setLabourFormData({
      name: "",
      phone: "",
      type_id: "",
      type_name: "",
      max_unitrate: 0,
      salary_type: "daily",
      unitrate: 0,
      overtime_rate: 0,
    });

    setVendorMarkAttenModalOpen(false);
    setVendorMarkAttenData(null);

    if (reset) loadAttendances();
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

  const loadAttendances = async (type: string = "all") => {
    try {
      let payload: any = {
        site_id: siteId,
        date: CurrentDate,
        search: searchQuery,
      };

      if (type && type != "all") payload.type = type;

      const response = await attendancesHandler.get(payload);
      if (!response.success) {
        alert(response.message);
        return;
      }

      let records = response.data.items || [];

      let summary = {
        total_payable: 0,
        present: 0,
        halfday: 0,
        absent: 0,
        overtime: 0,
      };

      records = records.map((record: any) => {
        let total_payable = 0;

        if (record.type == "my_labour") {
          let unitrate = parseFloat(record.unitrate || 0);
          let attendance_records = record.attendance_records || {};

          if (attendance_records.status == "present") {
            summary.present += 1;
            total_payable += unitrate;
          }
          if (attendance_records.status == "halfday") {
            summary.halfday += 1;
            total_payable += unitrate / 2;
          }

          summary.absent += attendance_records.status == "absent" ? 1 : 0;
        }
        if (record.type == "vendor_labour") {
          let attendance_records = record.attendance_records || {};
          let labours = record.labours || [];

          for (let labour_id in attendance_records) {
            let labour = labours.find((l: any) => l.id == labour_id);

            if (!labour) {
              continue;
            }

            let unitrate = parseFloat(labour.unitrate || 0);
            let overtime_rate = parseFloat(labour.overtime_rate || 0);

            let total_present = parseInt(
              attendance_records[labour_id].present || 0
            );
            let total_halfday = parseInt(
              attendance_records[labour_id].halfday || 0
            );
            let total_overtime = parseInt(
              attendance_records[labour_id].overtime || 0
            );

            summary.present += total_present;
            summary.halfday += total_halfday;
            summary.overtime += total_overtime;

            total_payable += unitrate * total_present;
            total_payable += (unitrate * total_halfday) / 2;
            total_payable += overtime_rate * total_overtime;
          }
        }

        record.total_payable = total_payable;
        summary.total_payable += total_payable;

        return record;
      });

      setAttendanceSummary(summary);

      setAttendancesList(records);
    } catch (error) {
      console.error("Error loading attendances:", error);
    }
  };

  const markAttendance = async (id: string, data: any) => {
    if (!id || !data) {
      alert("Please re-select an attendance");
      return;
    }

    try {
      const response = await attendancesHandler.markAttendance({
        id: id,
        date: CurrentDate,
        data: data,
      });
      if (!response.success) {
        alert(response.message);
        return;
      }

      handleClose(true);
    } catch (error) {
      console.error("Error marking attendance:", error);
    }
  };

  const handleSearchFilter = (value: string) => {
    setSearchQuery(value);
  };

  useEffect(() => {
    loadVendors();
    loadMasterLabours();
    loadAttendances();
  }, []);

  useEffect(() => {
    loadAttendances();
  }, [CurrentDate, searchQuery]);

  const vendorOptions = vendors.map((v) => ({
    value: v.id,
    label: v.name,
  }));

  const columns = [
    {
      key: "sno",
      header: "S.No",
      mobileLabel: "S.No",
      showInMobile: false,
      maxWidth: "50px",
    },
    {
      key: "name",
      header: "Name",
      mobileLabel: "Name",
      showInMobile: false,
      maxWidth: "5px",
      render: (_: string, row: any) =>
        row.type == "vendor_labour" ? row.vendor_name : row.name,
    },
    {
      key: "category",
      header: "Category",
      mobileLabel: "Category",
      showInMobile: false,
      render: (_: string, row: any) =>
        row.type == "vendor_labour"
          ? row.labours?.map((l: any) => l.labour_name).join(" | ")
          : row.type_name,
    },
    {
      key: "total_payable",
      header: "To Pay",
      mobileLabel: "To Pay",
      showInMobile: true,
      render: (value: number) => `₹ ${value.toFixed(2)}`,
    },
    {
      key: "status",
      header: "Attendance status",
      maxWidth: "100px",
      mobileLabel: "Attendance status",
      mobileValueOnly: true,
      showInMobile: true,
      render: (_: string, attendance: any) => {
        return (
          <div className="w-full flex justify-end pt-2 border-t border-gray-300 md:w-max md:justify-start md:pt-0 md:border-0">
            {attendance.type == "vendor_labour" ? (
              <div className="flex items-center gap-4">
                {Object.keys(attendance.attendance_records).length > 0 ? (
                  <div className="flex items-center gap-1">
                    <CheckCircle className="w-5 h-5 text-green-700" />
                    <span className="text-sm text-green-700">Marked</span>
                  </div>
                ) : (
                  ""
                )}

                <Button
                  size="sm"
                  variant="primary_light"
                  onClick={() => {
                    setVendorMarkAttenData(attendance);
                    setVendorMarkAttenModalOpen(true);
                  }}
                  icon={
                    Object.keys(attendance.attendance_records).length > 0
                      ? RotateCwIcon
                      : Plus
                  }
                >
                  {Object.keys(attendance.attendance_records).length > 0
                    ? "Update"
                    : "Mark"}{" "}
                  Attendance
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2  ">
                <span
                  className={`px-2 py-1 rounded-md select-none border cursor-pointer bg-transperent ${
                    attendance?.attendance_records?.status == "present"
                      ? "border-green-700 bg-green-50 text-green-700"
                      : "border-gray-500 text-gray-700"
                  } `}
                  onClick={() =>
                    markAttendance(attendance.id, { status: "present" })
                  }
                >
                  Present
                </span>
                <span
                  className={`px-2 py-1 rounded-md select-none border cursor-pointer bg-transperent ${
                    attendance?.attendance_records?.status == "halfday"
                      ? "border-yellow-700 bg-yellow-50 text-yellow-700"
                      : "border-gray-500 text-gray-700"
                  } `}
                  onClick={() =>
                    markAttendance(attendance.id, { status: "halfday" })
                  }
                >
                  Halfday
                </span>
                <span
                  className={`px-2 py-1 rounded-md select-none border cursor-pointer bg-transperent ${
                    attendance?.attendance_records?.status == "absent"
                      ? "border-red-700 bg-red-50 text-red-700"
                      : "border-gray-500 text-gray-700"
                  } `}
                  onClick={() =>
                    markAttendance(attendance.id, { status: "absent" })
                  }
                >
                  Absent
                </span>
              </div>
            )}
          </div>
        );
      },
    },
  ];
  const payableColumns = [
    {
      key: "sno",
      header: "S.No",
      mobileLabel: "S.No",
      showInMobile: false,
      maxWidth: "50px",
    },
    {
      key: "name",
      header: "Name",
      mobileLabel: "Name",
      showInMobile: false,
      maxWidth: "5px",
      render: (_: string, row: any) =>
        row.type == "vendor_labour" ? row.vendor_name : row.name,
    },
    {
      key: "total_presents",
      header: "Total Presents",
      mobileLabel: "Total Presents",
      showInMobile: true,
    },
    {
      key: "total_halfdays",
      header: "Total Halfdays",
      mobileLabel: "Total Halfdays",
      showInMobile: true,
    },
    {
      key: "total_overtime",
      header: "Total OT Hrs",
      mobileLabel: "Total OT Hrs",
      showInMobile: true,
    },

    {
      key: "total_payable",
      header: "To Pay",
      mobileLabel: "To Pay",
      showInMobile: true,
      render: (value: number) => `₹ ${value.toFixed(2)}`,
    },
    {
      key: "status",
      header: "Status",
      mobileLabel: "Status",
      showInMobile: true,
    },
  ];

  const renderAttendance = () => {
    return (
      <>
        {/* Vendor Modal */}
        <Modal
          isOpen={isVendorModalOpen}
          onClose={() => handleClose()}
          title={editingVendor ? "Edit Vendor" : "Add Vendor"}
          size="lg"
        >
          <form onSubmit={handleVendorSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <FormField
                label="Vendor"
                type="select"
                value={vendorFormData.vendor_id}
                onChange={(value) => {
                  let selectedVendor = vendors.find((v) => v.id === value);
                  setVendorFormData({
                    ...vendorFormData,
                    vendor_id: value as string,
                    vendor_name: selectedVendor?.name || "",
                  });
                }}
                options={vendorOptions}
                required
              />

              <Button
                size="sm"
                variant="primary_light"
                onClick={() => {
                  navigator("/vendors");
                }}
                icon={Plus}
                className="w-max h-max"
              >
                Add{" "}
                {activeAttendanceTab === "vendor_labour" ? "Vendor" : "Labour"}
              </Button>
            </div>

            {vendorFormData.labours.length ? (
              <div className="flex flex-col gap-3 border-b border-gray-200 pb-4">
                <div className="flex justify-between items-center">
                  <span className="text-md font-semibold">Labours</span>
                  <div
                    className="flex items-center text-sm text-blue-700 cursor-pointer"
                    onClick={HandleAddVendorLabour}
                  >
                    <Plus className="w-4 h-4 text-blue-700" />
                    Add
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  {vendorFormData.labours.map((item, index) => (
                    <div key={index} className="flex gap-2 items-end">
                      <FormField
                        label={`Labour ${index + 1}`}
                        type="select"
                        options={LaboursOptions}
                        value={item.labour_id}
                        onChange={(value) => {
                          let labour = MasterLabours.find(
                            (labour) => labour.id === value
                          );
                          const newLabours = [...vendorFormData.labours];
                          newLabours[index].labour_id = labour?.id || "";
                          newLabours[index].labour_name = labour?.name || "";
                          newLabours[index].max_unitrate =
                            labour?.maxUnitAmount || "";
                          newLabours[index].unitrate =
                            labour?.maxUnitAmount || "";
                          setVendorFormData({
                            ...vendorFormData,
                            labours: newLabours,
                          });
                        }}
                        className="w-[60%]"
                      />
                      <FormField
                        label={`Unit Rate`}
                        type="number"
                        value={item.unitrate || item.max_unitrate || 0}
                        min={0}
                        max={item.max_unitrate || Infinity}
                        onChange={(value) => {
                          const newLabours = [...vendorFormData.labours];
                          if (value > item.max_unitrate)
                            value = item.max_unitrate;
                          newLabours[index].unitrate = value;
                          setVendorFormData({
                            ...vendorFormData,
                            labours: newLabours,
                          });
                        }}
                        className="w-[30%]"
                      />

                      <Trash2
                        className="w-5 h-5 text-red-700 cursor-pointer mb-2"
                        onClick={() => {
                          const newLabours = [...vendorFormData.labours];
                          newLabours.splice(index, 1);
                          setVendorFormData({
                            ...vendorFormData,
                            labours: newLabours,
                          });
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div
                className="flex items-center gap-1 cursor-pointer"
                onClick={HandleAddVendorLabour}
              >
                <Plus className="w-6 h-6 text-blue-700" />
                <span className="text-sm text-blue-700">Add Labour</span>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleClose()}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingVendor ? "Update Vendor" : "Save Vendor"}
              </Button>
            </div>
          </form>
        </Modal>

        {/* Vendor Mark Attendance Modal */}
        <Modal
          isOpen={VendorMarkAttenModalOpen}
          onClose={() => handleClose()}
          title={"Mark Attendance"}
          size="lg"
        >
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4 py-3 border-b border-gray-300">
              <span className="text-md">Vendor name:</span>
              <span className="text-md font-semibold">
                {VendorMarkAttenData?.vendor_name}
              </span>
            </div>

            <div className="flex flex-col gap-3 bg-gray-100 pb-4">
              <div className="grid grid-cols-4 gap-2 p-2 border-b border-gray-300">
                <span className="text-md">Labour's type</span>
                <span className="text-md">Full day</span>
                <span className="text-md">Half day</span>
                <span className="text-md">Overtime (hrs)</span>
              </div>
              <div className="flex flex-col gap-3">
                {VendorMarkAttenData?.labours.map(
                  (item: any, index: number) => (
                    <div
                      key={index}
                      className="grid grid-cols-4 gap-2 p-2 border-b border-gray-300"
                    >
                      <span className="text-md font-semibold">
                        {item.labour_name}
                      </span>

                      <FormField
                        type="number"
                        value={
                          VendorMarkAttenData?.attendance_records[item.id]
                            ?.present || 0
                        }
                        onChange={(value) => {
                          const newLabours = {
                            ...VendorMarkAttenData.attendance_records,
                            [item.id]: {
                              ...VendorMarkAttenData.attendance_records[
                                item.id
                              ],
                              present: value,
                            },
                          };
                          setVendorMarkAttenData({
                            ...VendorMarkAttenData,
                            attendance_records: newLabours,
                          });
                        }}
                      />
                      <FormField
                        type="number"
                        value={
                          VendorMarkAttenData?.attendance_records[item.id]
                            ?.halfday || 0
                        }
                        onChange={(value) => {
                          const newLabours = {
                            ...VendorMarkAttenData.attendance_records,
                            [item.id]: {
                              ...VendorMarkAttenData.attendance_records[
                                item.id
                              ],
                              halfday: value,
                            },
                          };
                          setVendorMarkAttenData({
                            ...VendorMarkAttenData,
                            attendance_records: newLabours,
                          });
                        }}
                      />
                      <FormField
                        type="number"
                        value={
                          VendorMarkAttenData?.attendance_records[item.id]
                            ?.overtime_hours || 0
                        }
                        onChange={(value) => {
                          const newLabours = {
                            ...VendorMarkAttenData.attendance_records,
                            [item.id]: {
                              ...VendorMarkAttenData.attendance_records[
                                item.id
                              ],
                              overtime_hours: value,
                            },
                          };
                          setVendorMarkAttenData({
                            ...VendorMarkAttenData,
                            attendance_records: newLabours,
                          });
                        }}
                      />
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button
                className="w-full"
                onClick={() =>
                  markAttendance(
                    VendorMarkAttenData.id,
                    VendorMarkAttenData.attendance_records
                  )
                }
              >
                Mark Attendance
              </Button>
            </div>
          </div>
        </Modal>

        {/* Labour Modal */}
        <Modal
          isOpen={isLabourModalOpen}
          onClose={() => handleClose()}
          title={editingLabour ? "Edit Labour" : "Create new Labour"}
          size="lg"
        >
          <form onSubmit={handleLabourSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <FormField
                label="Name"
                type="text"
                value={labourFormData.name}
                onChange={(value) =>
                  setLabourFormData({ ...labourFormData, name: value })
                }
                required
              />
              <FormField
                label="Phone"
                type="tel"
                value={labourFormData.phone}
                onChange={(value) =>
                  setLabourFormData({ ...labourFormData, phone: value })
                }
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <FormField
                label="Labour type"
                type="select"
                value={labourFormData.type_id}
                onChange={(value) => {
                  let selectedLabour = MasterLabours.find(
                    (v) => v.id === value
                  );
                  setLabourFormData({
                    ...labourFormData,
                    type_id: value as string,
                    type_name: selectedLabour?.name || "",
                    max_unitrate: selectedLabour?.maxUnitAmount || 0,
                    unitrate: selectedLabour?.maxUnitAmount || 0,
                    overtime_rate: selectedLabour?.overtimeRate || 0,
                  });
                }}
                options={LaboursOptions}
                required
              />
              <FormField
                label="Salary type"
                type="select"
                value={labourFormData.salary_type}
                onChange={(value) => {
                  setLabourFormData({
                    ...labourFormData,
                    salary_type: value as string,
                  });
                }}
                options={SalaryTypeOptions}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
              <FormField
                label={`Labour's Salary /${labourFormData.salary_type}`}
                type="number"
                value={labourFormData.unitrate}
                min={0}
                max={labourFormData.max_unitrate || Infinity}
                onChange={(value) => {
                  if (value > labourFormData.max_unitrate)
                    value = labourFormData.max_unitrate;
                  setLabourFormData({
                    ...labourFormData,
                    unitrate: value as number,
                  });
                }}
                required
              />
              <FormField
                label={`Overtime wage/hr`}
                type="number"
                value={labourFormData.overtime_rate}
                onChange={(value) => {
                  setLabourFormData({
                    ...labourFormData,
                    overtime_rate: value as number,
                  });
                }}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => handleClose()}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editingVendor ? "Update Vendor" : "Save Vendor"}
              </Button>
            </div>
          </form>
        </Modal>

        <div className="flex flex-col gap-4">
          <div className="flex pb-4 border-b border-gray-200 gap-4 flex-col md:flex-row md:pb-0 md:items-center md:justify-between">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {attendanceTabs.map((tab) => {
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleAttendanceTabChange(tab.id)}
                    className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                      activeAttendanceTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            <div className="flex items-center justify-between gap-2 w-full  md:w-max md:justify-end">
              {(activeAttendanceTab == "all" ||
                activeAttendanceTab == "my_labour") && (
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => handleAdd("my_labour")}
                  icon={Plus}
                  className="w-full md:w-[max]"
                >
                  Add Labour
                </Button>
              )}
              {(activeAttendanceTab == "all" ||
                activeAttendanceTab == "vendor_labour") && (
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => handleAdd("vendor_labour")}
                  icon={Plus}
                  className="w-full md:w-auto"
                >
                  Add Vendor
                </Button>
              )}
            </div>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative flex items-center gap-2">
                <ChevronLeft
                  onClick={() => handleMoveDate("prev")}
                  className="w-5 h-5 text-gray-900 cursor-pointer"
                />

                <div
                  onClick={triggerDateChange}
                  className="px-2 py-1 text-center rounded-md bg-[#1CA372] flex flex-col items-center justify-center select-none cursor-pointer"
                >
                  <span className="text-md font-medium text-white">
                    {getCurrentDateMonth(CurrentDate).date_no}
                  </span>
                  <span className="text-sm text-white">
                    {getCurrentDateMonth(CurrentDate).day},{" "}
                    {getCurrentDateMonth(CurrentDate).month}
                  </span>
                </div>
                <ChevronRight
                  onClick={() => handleMoveDate("next")}
                  className="w-5 h-5 text-gray-900 cursor-pointer"
                />
                <input
                  ref={DateRef}
                  type="date"
                  value={CurrentDate}
                  onChange={handleDateChange}
                  className="absolute bottom-0 left-0 w-[0px] h-[0px] border-none outline-none"
                />
              </div>
              <div className="mobile-view-disable flex items-center gap-2 border border-gray-300 rounded-lg p-1 min-w-[200px]">
                <SearchIcon className="w-4 h-4 text-gray-900 cursor-pointer ml-2" />
                <input
                  type="text"
                  placeholder="Search"
                  className="h-[28px] text-sm border-none outline-none"
                  value={searchQuery}
                  onInput={(e) => handleSearchFilter(e.target?.value)}
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-md font-semibold text-gray-900">
                To pay: ₹{" "}
                {parseFloat(AttendanceSummary.total_payable).toFixed(2)}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 flex items-center gap-1 before:content-[''] before:block before:w-[10px] before:h-[10px] before:bg-blue-200">
                  {AttendanceSummary.present} Pre
                </span>
                <span className="text-xs text-gray-500 flex items-center gap-1 before:content-[''] before:block before:w-[10px] before:h-[10px] before:bg-yellow-200">
                  {AttendanceSummary.halfday} Hal
                </span>
                <span className="text-xs text-gray-500 flex items-center gap-1 before:content-[''] before:block before:w-[10px] before:h-[10px] before:bg-red-200">
                  {AttendanceSummary.absent} Abs
                </span>
              </div>
            </div>
          </div>

          <div className="w-full mt-4">
            <Table
              columns={columns}
              data={AttendancesList}
              mobileCardTitle={(attendance: any) =>
                attendance.type == "vendor_labour"
                  ? attendance.vendor_name
                  : attendance.name
              }
              mobileCardSubtitle={(attendance: any) =>
                attendance.type == "vendor_labour"
                  ? attendance.labours
                      ?.map((l: any) => l.labour_name)
                      .join(" | ")
                  : attendance.type_name
              }
              actions={(attendance) => (
                <>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      handleEdit(attendance);
                    }}
                    icon={Edit}
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDelete(attendance)}
                    icon={Trash2}
                    className="text-red-600 hover:text-red-700"
                  />
                </>
              )}
            />
          </div>
        </div>
      </>
    );
  };

  return (
    <Layout title="Attendances">
      <div className="flex flex-col gap-4">{renderAttendance()}</div>
    </Layout>
  );
};
