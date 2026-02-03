import React from "react";
import { DivideIcon as LucideIcon } from "lucide-react";
import { clsx } from "clsx";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "primary_light"
    | "secondary"
    | "outline"
    | "outline_primary"
    | "ghost"
    | "danger"
    | "success"
    | "warning";
  size?: "sm" | "md" | "lg";
  icon?: typeof LucideIcon;
  iconPosition?: "left" | "right";
  loading?: boolean;
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  loading = false,
  children = "",
  className,
  disabled,
  ...props
}) => {
  const baseClasses =
    "inline-flex whitespace-nowrap items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variantClasses = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500",
    primary_light:
      "bg-blue-50 text-blue-700 border border-blue-700 focus:ring-blue-500",
    secondary: "bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500",
    outline:
      "border border-gray-300 hover:bg-gray-50 text-gray-700 focus:ring-blue-500",
    outline_primary:
      "border border-transparent  text-blue-700 focus:ring-blue-500",
    ghost: "hover:bg-gray-100 text-gray-700 focus:ring-gray-500",
    danger: "bg-red-600 hover:bg-red-700 text-white focus:ring-red-500",
    success: "bg-green-600 hover:bg-green-700 text-white focus:ring-green-500",
    warning:
      "bg-yellow-600 hover:bg-yellow-700 text-white focus:ring-yellow-500",
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base",
  };

  const iconSize = {
    sm: "w-4 h-4",
    md: "w-4 h-4",
    lg: "w-5 h-5",
  };

  return (
    <button
      className={clsx(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        loading && "opacity-50 cursor-not-allowed",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
      )}
      {Icon && iconPosition === "left" && !loading && (
        <Icon className={clsx(iconSize[size], children && "mr-2")} />
      )}
      {children}
      {Icon && iconPosition === "right" && !loading && (
        <Icon className={clsx(iconSize[size], children && "ml-2")} />
      )}
    </button>
  );
};
