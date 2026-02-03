import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Package,
  CheckSquare,
  ReceiptText,
  ShoppingBag,
  Contact2Icon,
  Landmark,
} from "lucide-react";

const QuickMenu: React.FC = () => {
  const navigate = useNavigate();

  const menuItems = [
    {
      id: "add-material",
      title: "Add Material",
      icon: Package,
      path: "/materials?action=add_inventory",
    },
    {
      id: "purchase-material",
      title: "Purchase Material",
      icon: ShoppingBag,
      path: "/materials?action=add_procurement",
    },
    {
      id: "add-task",
      title: "Add Task",
      icon: CheckSquare,
      path: "/tasks?action=add",
    },
    {
      id: "attendances",
      title: "Attendance",
      icon: Contact2Icon,
      path: "/attendances?action=add",
    },
    {
      id: "expenses",
      title: "Add Expenses",
      icon: ReceiptText,
      path: "/expenses?action=add",
    },
    {
      id: "payments",
      title: "Add Payments",
      icon: Landmark,
      path: "/payments?action=add",
    },
  ];

  const handleCardClick = (path: string) => {
    navigate(window.location.pathname + path);
  };

  return (
    <div className="p-4 overflow-y-auto">
      <h1 className="text-2xl font-bold mb-4">Quick Menu</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => handleCardClick(item.path)}
              className="bg-white rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition-shadow duration-200 border border-gray-200"
            >
              <div className="flex flex-col items-center text-center">
                <IconComponent className="w-12 h-12 text-blue-600 mb-3" />
                <h3 className="text-lg font-semibold text-gray-800">
                  {item.title}
                </h3>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default QuickMenu;
