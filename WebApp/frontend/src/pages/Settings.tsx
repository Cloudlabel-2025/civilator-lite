import React, { useState, useRef, useEffect } from "react";
import { Layout } from "../components/Layout/Layout";
import { Button } from "../components/Common/Button";
import { FormField } from "../components/Common/FormField";
import { User, Building, Smartphone, Copy, Check } from "lucide-react";
import { mockCustomerAppSettings } from "../data/mockData";
import SettingsHandler from "../handler/settings";

export const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "profile" | "company" | "customer"
  >("profile");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const settingsHandler = new SettingsHandler();
  const profilePhotoRef = useRef<HTMLInputElement>(null);
  const companyLogoRef = useRef<HTMLInputElement>(null);

  // Profile State
  const [profileData, setProfileData] = useState({
    name: "",
    phone: "",
    email: "",
    photo: "",
  });

  // Company State
  const [companyData, setCompanyData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    gstin: "",
    panNumber: "",
    website: "",
    logo: "",
  });

  // Customer App Settings State
  const [customerSettings, setCustomerSettings] = useState(
    mockCustomerAppSettings
  );

  useEffect(() => {
    loadProfileData();
    loadCompanyData();
  }, []);

  const loadProfileData = async () => {
    try {
      const response = await settingsHandler.get_profile();
      if (response.success && response.data) {
        setProfileData({
          name: response.data.name || "",
          phone: response.data.phone || "",
          email: response.data.email || "",
          photo: response.data.photo || "",
        });
      }
    } catch (error) {
      console.error("Error loading profile:", error);
    }
  };

  const loadCompanyData = async () => {
    try {
      const response = await settingsHandler.get_company();
      if (response.success && response.data) {
        setCompanyData({
          name: response.data.name || "",
          phone: response.data.phone || "",
          email: response.data.email || "",
          address: response.data.address || "",
          gstin: response.data.gstin || "",
          panNumber: response.data.panNumber || "",
          website: response.data.website || "",
          logo: response.data.logo || "",
        });
      }
    } catch (error) {
      console.error("Error loading company:", error);
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(",")[1]); // Remove data:image/jpeg;base64, prefix
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleProfilePhotoChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const base64 = await convertToBase64(file);
        setProfileData({ ...profileData, photo: base64 });
      } catch (error) {
        console.error("Error converting photo to base64:", error);
      }
    }
  };

  const handleCompanyLogoChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const base64 = await convertToBase64(file);
        setCompanyData({ ...companyData, logo: base64 });
      } catch (error) {
        console.error("Error converting logo to base64:", error);
      }
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        name: profileData.name,
        phone: profileData.phone,
        email: profileData.email,
        photo: profileData.photo || "",
      };

      const response = await settingsHandler.update_profile(payload);
      if (response.success) {
        alert("Profile updated successfully!");
      } else {
        alert("Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  const handleCompanySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (companyData.gstin.length !== 15) {
      alert("GSTIN must be exactly 15 digits");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: companyData.name || "",
        phone: companyData.phone || "",
        email: companyData.email || "",
        address: companyData.address || "",
        gstin: companyData.gstin || "",
        panNumber: companyData.panNumber || "",
        website: companyData.website || "",
        logo: companyData.logo || "",
      };

      const response = await settingsHandler.update_company(payload);
      if (response.success) {
        alert("Company updated successfully!");
      } else {
        alert("Failed to update company");
      }
    } catch (error) {
      console.error("Error updating company:", error);
      alert("Error updating company");
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Customer settings updated:", customerSettings);
  };

  const handleCompanyNameChange = (name: string) => {
    const subUrl = name
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .replace(/\s+/g, "-")
      .trim();

    setCustomerSettings({
      ...customerSettings,
      visibleCompanyName: name,
      subUrl: subUrl,
      portalUrl: `https://customer.civilator.aiseowrite.in/${subUrl}`,
    });
  };

  const copyPortalUrl = async () => {
    try {
      await navigator.clipboard.writeText(customerSettings.portalUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      const textArea = document.createElement("textarea");
      textArea.value = customerSettings.portalUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const tabs = [
    { id: "profile", label: "My Profile", icon: User },
    { id: "company", label: "Company", icon: Building },
    { id: "customer", label: "Customer App Settings", icon: Smartphone },
  ];

  return (
    <Layout title="Settings">
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
                </button>
              );
            })}
          </nav>
        </div>

        {/* My Profile Tab */}
        {activeTab === "profile" && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              My Profile
            </h3>
            <form
              onSubmit={handleProfileSubmit}
              className="flex flex-col gap-4"
            >
              <div className="flex items-center space-x-6 mb-6">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  {profileData.photo ? (
                    <img
                      src={`data:image/jpeg;base64,${profileData.photo}`}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    ref={profilePhotoRef}
                    onChange={handleProfilePhotoChange}
                    accept="image/jpeg,image/png,image/jpg"
                    className="hidden"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => profilePhotoRef.current?.click()}
                  >
                    Change Photo
                  </Button>
                  <p className="text-xs text-gray-500 mt-1">
                    JPG, PNG up to 2MB
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Full Name"
                  value={profileData.name}
                  onChange={(value) =>
                    setProfileData({ ...profileData, name: value as string })
                  }
                  required
                />
                <FormField
                  label="Phone Number"
                  type="tel"
                  value={profileData.phone}
                  onChange={(value) =>
                    setProfileData({ ...profileData, phone: value as string })
                  }
                  required
                />
              </div>

              <FormField
                label="Email Address"
                type="email"
                value={profileData.email}
                onChange={(value) =>
                  setProfileData({ ...profileData, email: value as string })
                }
                required
              />

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={loading}>
                  {loading ? "Updating..." : "Update Profile"}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Company Tab */}
        {activeTab === "company" && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Company Information
            </h3>
            <form
              onSubmit={handleCompanySubmit}
              className="flex flex-col gap-4"
            >
              <div className="flex items-center space-x-6 mb-6">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  {companyData.logo ? (
                    <img
                      src={`data:image/png;base64,${companyData.logo}`}
                      alt="Company Logo"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Building className="w-8 h-8 text-gray-400" />
                  )}
                </div>
                <div>
                  <input
                    type="file"
                    ref={companyLogoRef}
                    onChange={handleCompanyLogoChange}
                    accept="image/png,image/svg+xml"
                    className="hidden"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => companyLogoRef.current?.click()}
                  >
                    Upload Logo
                  </Button>
                  <p className="text-xs text-gray-500 mt-1">
                    PNG, SVG up to 2MB
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Company Name"
                  value={companyData.name}
                  onChange={(value) =>
                    setCompanyData({ ...companyData, name: value as string })
                  }
                  required
                />
                <FormField
                  label="Phone Number"
                  type="tel"
                  value={companyData.phone}
                  onChange={(value) =>
                    setCompanyData({ ...companyData, phone: value as string })
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Email Address"
                  type="email"
                  value={companyData.email}
                  onChange={(value) =>
                    setCompanyData({ ...companyData, email: value as string })
                  }
                  required
                />
                <FormField
                  label="Website URL"
                  value={companyData.website}
                  onChange={(value) =>
                    setCompanyData({ ...companyData, website: value as string })
                  }
                  placeholder="https://example.com"
                />
              </div>

              <FormField
                label="Business Address"
                type="textarea"
                value={companyData.address}
                onChange={(value) =>
                  setCompanyData({ ...companyData, address: value as string })
                }
                required
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="GSTIN (15 digits)"
                  value={companyData.gstin}
                  onChange={(value) =>
                    setCompanyData({ ...companyData, gstin: value as string })
                  }
                  placeholder="15-digit GSTIN code"
                  required
                />
                <FormField
                  label="PAN Number"
                  value={companyData.panNumber}
                  onChange={(value) =>
                    setCompanyData({
                      ...companyData,
                      panNumber: value as string,
                    })
                  }
                  required
                />
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit" disabled={loading}>
                  {loading ? "Updating..." : "Update Company Info"}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Customer App Settings Tab */}
        {activeTab === "customer" && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Customer App Settings
            </h3>
            <form
              onSubmit={handleCustomerSettingsSubmit}
              className="flex flex-col gap-4"
            >
              <FormField
                label="Visible Company Name"
                value={customerSettings.visibleCompanyName}
                onChange={(value) => handleCompanyNameChange(value as string)}
                placeholder="e.g., Archo Builders"
                required
              />

              <FormField
                label="Sub URL"
                value={customerSettings.subUrl}
                onChange={(value) =>
                  setCustomerSettings({
                    ...customerSettings,
                    subUrl: value as string,
                    portalUrl: `https://customer.civilator.aiseowrite.in/${value}`,
                  })
                }
                placeholder="e.g., archo-builders"
                required
              />

              <FormField
                label="Color Theme"
                value={customerSettings.colorTheme}
                onChange={(value) =>
                  setCustomerSettings({
                    ...customerSettings,
                    colorTheme: value as string,
                  })
                }
                placeholder="#3b82f6"
                required
              />

              {/* Customer Portal URL */}
              <div className="border-t pt-4">
                <h4 className="text-lg font-medium text-gray-900 mb-4">
                  Customer Portal URL
                </h4>
                <p className="text-sm text-gray-600 mb-3">
                  Share this URL with your customers to access their project
                  portal:
                </p>
                <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg border">
                  <code className="flex-1 text-sm font-mono text-gray-800 break-all">
                    {customerSettings.portalUrl}
                  </code>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={copyPortalUrl}
                    icon={copied ? Check : Copy}
                    className={copied ? "text-green-600" : ""}
                  >
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button type="submit">Update Settings</Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </Layout>
  );
};
