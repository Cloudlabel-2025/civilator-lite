import React, { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  title_children?: React.ReactNode;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export const SideDrawer: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title = "",
  title_children,
  children,
  size = "md",
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  };

  return (
    <div className="fixed inset-0 z-50">
      <div
        className="modal-mobile-overlay fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
        onClick={onClose}
      ></div>
      <div
        className={`modal-mobile-view absolute inset-0 top-0 left-[unset] right-0 inline-block w-full h-[100vh] ${sizeClasses[size]} overflow-y-auto text-left transition-all transform bg-white shadow-xl `}
      >
        {/* Header */}
        <div className="max-h-[80px] flex items-center justify-between p-2 pb-4 border-b border-gray-200">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          )}
          {title_children && title_children}
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="w-full h-[calc(100vh-80px)]">{children}</div>
      </div>
    </div>
  );
};
