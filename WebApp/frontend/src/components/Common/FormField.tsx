import React from "react";
import {
  Input,
  Select,
  Upload,
  InputNumber,
  Radio,
  Checkbox,
  DatePicker,
} from "antd";
import { clsx } from "clsx";
import dayjs from "dayjs";

interface FormFieldProps {
  label?: string;
  label_right?: boolean;
  type?:
    | "text"
    | "email"
    | "tel"
    | "number"
    | "date"
    | "textarea"
    | "select"
    | "radio"
    | "checkbox"
    | "range"
    | "daterange"
    | "file";
  value: string | number | any;
  name?: string;
  value_label?: string;
  max?: number;
  max_label?: string;
  min?: number;
  onChange: (value: any) => void;
  placeholder?: string;
  required?: boolean;
  readonly?: boolean;
  error?: string;
  options?: { value: string; label: string }[];
  rows?: number;
  multiple?: boolean;
  className?: string;
  inputClass?: string;
  allowClear?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
  label = "",
  label_right = false,
  type = "text",
  name = "",
  value,
  value_label = "",
  max_label = "",
  min = 0,
  max = Infinity,
  onChange,
  placeholder,
  required,
  error,
  multiple,
  readonly,
  options,
  rows = 3,
  className,
  inputClass = "",
  allowClear = true,
}) => {
  const renderInput = () => {
    const commonProps = {
      placeholder,
      disabled: readonly,
      status: error ? ("error" as const) : undefined,
      className: inputClass,
    };

    switch (type) {
      case "textarea":
        return (
          <Input.TextArea
            {...commonProps}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={rows}
            allowClear={allowClear}
          />
        );

      case "select":
        return (
          <Select
            {...commonProps}
            value={value}
            onChange={onChange}
            options={options}
            placeholder="Select..."
            style={{
              width: "100%",
              height: "42px",
            }}
            allowClear={allowClear}
          />
        );

      case "file":
        return (
          <Upload
            multiple={multiple}
            disabled={readonly}
            onChange={(info) => onChange(info.fileList)}
            className={inputClass}
          >
            <Input {...commonProps} readOnly />
          </Upload>
        );

      case "number":
        return (
          <InputNumber
            {...commonProps}
            value={value}
            onChange={onChange}
            min={min}
            max={max !== Infinity ? max : undefined}
            style={{ width: "100%", height: "42px" }}
          />
        );

      case "radio":
        return (
          <Radio
            checked={value}
            onChange={(e) => onChange(e.target.checked)}
            disabled={readonly}
            className={inputClass}
          >
            {label}
          </Radio>
        );

      case "checkbox":
        return (
          <Checkbox
            checked={value}
            onChange={(e) => onChange(e.target.checked)}
            disabled={readonly}
            className={inputClass}
          >
            {label}
          </Checkbox>
        );

      case "date":
        return (
          <DatePicker
            {...commonProps}
            value={value ? dayjs(value) : undefined}
            onChange={onChange}
            style={{ width: "100%", height: "42px" }}
            allowClear={allowClear}
          />
        );
      case "daterange":
        return (
          <DatePicker.RangePicker
            disabled={readonly}
            status={error ? ("error" as const) : undefined}
            className={inputClass}
            value={value ? value.map((v: any) => dayjs(v)) : undefined}
            onChange={onChange}
            style={{ width: "100%", height: "42px" }}
            allowClear={allowClear}
          />
        );

      default:
        return (
          <Input
            {...commonProps}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            style={{ width: "100%", height: "42px" }}
            allowClear={allowClear}
          />
        );
    }
  };

  return (
    <div className={clsx("relative", className)}>
      {!label_right && label && (
        <label className="absolute top-[-8px] z-10 left-3 bg-white px-2 block text-sm  text-gray-500 mb-1 whitespace-nowrap">
          {label + (value_label ? ` (${value_label})` : "")}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      {renderInput()}
      {(max_label || (max && max !== Infinity)) && (
        <div className="absolute top-[-12px] right-3 bg-white px-2 border border-gray-300 rounded-full flex justify-end gap-2 mt-1">
          <p className="text-xs text-gray-500">
            {max_label || `Max: ${max} ${value_label || ""}`}
          </p>
        </div>
      )}
      {label_right && label && (
        <label
          htmlFor={label}
          id={label}
          className="block text-sm font-medium text-gray-700 whitespace-nowrap"
        >
          {label + (value_label ? ` (${value_label})` : "")}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};
