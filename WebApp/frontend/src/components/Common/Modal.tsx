import React, { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
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
        className={`modal-mobile-view absolute inset-0 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 inline-block w-full h-[max-content] max-h-[calc(100vh-100px)] ${sizeClasses[size]} p-4 overflow-y-auto text-left transition-all transform bg-white shadow-xl rounded-lg`}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="pt-4">{children}</div>
      </div>
    </div>
  );
};
