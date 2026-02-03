import React, { useState, useEffect } from "react";
import { Layout } from "../components/Layout/Layout";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/Common/Button";
import { Modal } from "../components/Common/Modal";
import { FormField } from "../components/Common/FormField";
import { Plus, Edit, Trash2, MapPin, User, Calendar } from "lucide-react";
import { Site } from "../types";
import SitesHandler from "../handler/sites";
import EmployeesHandler from "../handler/employees";

export const Sites: React.FC = () => {
  const [sites, setSites] = useState<Site[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSite, setEditingSite] = useState<Site | null>(null);
  const sitesHandler = new SitesHandler();
  const employeesHandler = new EmployeesHandler();
  const navigate = useNavigate();

  const [employees, setEmployees] = useState<any[]>([]);
  const [SelectedEmployees, setSelectedEmployees] = useState<any[]>([]);

  const [ShowTeam, setShowTeam] = useState(false);
  const employeeOptions = employees.map((employee) => ({
    label: employee.name,
    value: employee.id,
  }));
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    clientName: "",
    clientPhone: "",
    estimateAmount: 0,
    startDate: "",
    endDate: "",
    address: "",
    team: [] as string[],
  });

  const handleOpenModal = (site?: Site) => {
    if (site) {
      setEditingSite(site);

      setSelectedEmployees(site.team || []);
      if (site?.team.length > 0) setShowTeam(true);
      setFormData({
        name: site.name,
        description: site.description,
        clientName: site.client.name,
        clientPhone: site.client.phone,
        estimateAmount: site.estimateAmount,
        startDate: site.startDate,
        endDate: site.endDate,
        address: site.address,
        team: site.team,
      });
    } else {
      setEditingSite(null);
      setFormData({
        name: "",
        description: "",
        clientName: "",
        clientPhone: "",
        estimateAmount: 0,
        startDate: "",
        endDate: "",
        address: "",
        team: [],
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const siteData = {
      name: formData.name,
      description: formData.description,
      client: {
        name: formData.clientName,
        phone: formData.clientPhone,
      },
      estimateAmount: formData.estimateAmount,
      startDate: formData.startDate,
      endDate: formData.endDate,
      address: formData.address,
      team: SelectedEmployees,
      status: editingSite?.status || "planning",
    };

    try {
      let response = {
        success: false,
      };

      if (editingSite) {
        response = await sitesHandler.put({ ...siteData, id: editingSite.id });
      } else {
        response = await sitesHandler.post(siteData);
      }

      if (!response.success) {
        return;
      }
      setIsModalOpen(false);
      loadSites();
    } catch (error) {
      console.error("Error saving site:", error);
    }
  };

  const handleDelete = async (siteId: string) => {
    if (window.confirm("Are you sure you want to delete this site?")) {
      try {
        await sitesHandler.delete({ id: siteId });
        loadSites();
      } catch (error) {
        console.error("Error deleting site:", error);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ongoing":
        return "bg-orange-100 text-orange-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "planning":
        return "bg-blue-100 text-blue-800";
      case "on-hold":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleAddEmployee = (id: string) => {
    let employee = employees.filter((opt: any) => opt.id == id)[0];
    if (!employee) return;

    let selectedEmployees = [...SelectedEmployees];
    let employee_index = selectedEmployees.findIndex(
      (item) => item.id == employee.id
    );
    if (employee_index == -1) {
      selectedEmployees.push(employee);
    }

    setSelectedEmployees(selectedEmployees);
  };

  const HandleRemoveEmployee = (id: any) => {
    let _SelectedEmployees = [...SelectedEmployees];
    let employee_index = _SelectedEmployees.findIndex((item) => item.id == id);
    if (employee_index == -1) return;
    _SelectedEmployees.splice(employee_index, 1);
    setSelectedEmployees(_SelectedEmployees);
  };

  const loadSites = async () => {
    try {
      const response = await sitesHandler.get({});

      if (!response.success) {
        return;
      }

      let sites = response.data.items || [];

      setSites(sites);
    } catch (error) {
      console.error("Error loading sites:", error);
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

  const handleSiteClick = (site: any, e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.closest(".disable-parent-click")) {
      return;
    }
    navigate(`/site/${site.id}`);
  };

  useEffect(() => {
    loadSites();
  }, []);
  useEffect(() => {
    if (isModalOpen) loadEmployees();
  }, [isModalOpen]);

  return (
    <Layout title="Sites">
      {/* Create/Edit Site Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setShowTeam(false);
          setSelectedEmployees([]);
          setIsModalOpen(false);
        }}
        title={editingSite ? "Edit Site" : "Create New Site"}
        size="lg"
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Site Name"
              value={formData.name}
              onChange={(value) =>
                setFormData({ ...formData, name: value as string })
              }
              required
            />
            <FormField
              label="Total Estimate Amount (₹)"
              type="number"
              value={formData.estimateAmount}
              onChange={(value) =>
                setFormData({ ...formData, estimateAmount: value as number })
              }
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Start Date"
              type="date"
              value={formData.startDate}
              onChange={(value) =>
                setFormData({ ...formData, startDate: value as string })
              }
            />
            <FormField
              label="End Date"
              type="date"
              value={formData.endDate}
              onChange={(value) =>
                setFormData({ ...formData, endDate: value as string })
              }
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              label="Site Description"
              type="textarea"
              value={formData.description}
              onChange={(value) =>
                setFormData({ ...formData, description: value as string })
              }
            />
            <FormField
              label="Site Address"
              type="textarea"
              value={formData.address}
              onChange={(value) =>
                setFormData({ ...formData, address: value as string })
              }
            />
          </div>

          {/* Client Details */}
          <div className="border-t pt-4">
            <h4 className="text-lg font-medium text-gray-900 mb-4">
              Client Details
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="Client Name"
                value={formData.clientName}
                onChange={(value) =>
                  setFormData({ ...formData, clientName: value as string })
                }
              />
              <FormField
                label="Phone Number"
                type="tel"
                value={formData.clientPhone}
                onChange={(value) =>
                  setFormData({ ...formData, clientPhone: value as string })
                }
              />
            </div>
          </div>

          {!ShowTeam ? (
            <div
              className="flex items-center gap-1 cursor-pointer"
              onClick={() => setShowTeam(true)}
            >
              <Plus className="w-6 h-6 text-blue-700" />
              <span className="text-sm text-blue-700">Add Site Team</span>
            </div>
          ) : (
            <div className="border-t pt-4">
              <h4 className="text-lg font-medium text-gray-900 mb-4">
                Site Team
              </h4>
              <div className="flex flex-col gap-4">
                <FormField
                  label="ASSIGNED TO"
                  value={""}
                  type="select"
                  options={employeeOptions}
                  onChange={(value) => handleAddEmployee(value)}
                />
                <div className="flex flex-col gap-2">
                  {SelectedEmployees.map((employee: any) => (
                    <div
                      key={`employee-${employee.id}`}
                      className="flex items-center justify-between border border-gray-200 rounded-md p-2"
                    >
                      <div className="flex flex-col gap-1">
                        <div className="text-sm font-semibold text-gray-900">
                          {employee.name}
                        </div>
                        <div className="text-sm text-gray-700">
                          {employee.role_name}
                        </div>
                      </div>
                      <div className="h-[max-content] flex items-center justify-end">
                        <Trash2
                          className="w-4 h-4 cursor-pointer text-red-500"
                          onClick={() => HandleRemoveEmployee(employee.id)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

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
              {editingSite ? "Update Site" : "Create Site"}
            </Button>
          </div>
        </form>
      </Modal>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">All Sites</h2>
          <Button
            onClick={() => handleOpenModal()}
            icon={Plus}
            iconPosition="left"
          >
            Add New Site
          </Button>
        </div>

        {/* Sites Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sites.map((site) => (
            <div
              key={site.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 card-hover hover:border-blue-700 cursor-pointer"
              onClick={(e) => handleSiteClick(site, e)}
            >
              <div className="p-6">
                {/* Status Badge */}
                <div className="flex justify-between items-start mb-4">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                      site.status
                    )}`}
                  >
                    {site.status.replace("-", " ").toUpperCase()}
                  </span>
                  <div className="flex space-x-1">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleOpenModal(site)}
                      icon={Edit}
                      className="disable-parent-click"
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(site.id)}
                      icon={Trash2}
                      className="disable-parent-click text-red-600 hover:text-red-700"
                    />
                  </div>
                </div>

                {/* Site Info */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {site.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {site.description}
                </p>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{site.completionPercentage || 0}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${site.completionPercentage || 0}%` }}
                    ></div>
                  </div>
                </div>

                {/* Site Details */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <User className="w-4 h-4 mr-2" />
                    <span>{site.client.name}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2" />
                    <span>{site.address}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>
                      {new Date(site.startDate).toLocaleDateString()} -{" "}
                      {new Date(site.endDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};
