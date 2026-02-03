import React, { useState, useRef } from "react";
import { Upload, Trash2 } from "lucide-react";
import Utils from "../../helpers/utils";
import { Modal } from "../Common/Modal";

interface FileUploadProps {
  label: string;
  files: any[];
  setFiles: any;
  type: string;
  has_geodata?: boolean;
  accept?: string;
  maxSize?: number;
}

const FileUpload: React.FC<FileUploadProps> = ({
  label,
  files,
  setFiles,
  has_geodata = false,
  type = "multiple",
  accept = "image/*",
  maxSize = 2 * 1024 * 1024, // 5MB default
}) => {
  const InputRef = useRef<HTMLInputElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPrevFiles, setSelectedPrevFiles] = useState<File[]>([]);

  const handleTrigger = () => {
    if (InputRef.current) InputRef.current.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles) {
      let newFiles: any = Array.from(selectedFiles);

      // Check file size
      const invalidFiles = newFiles.filter((file: any) => file.size > maxSize);
      if (invalidFiles.length > 0) {
        alert(
          `Files ${invalidFiles
            .map((f) => f.name)
            .join(", ")} exceed the maximum size of ${
            maxSize / (1024 * 1024)
          }MB`
        );
        return;
      }

      if (has_geodata) {
        newFiles = await Utils.addImageGeoData(newFiles);
      }

      setFiles([...files, ...newFiles]);
    }
  };

  const handleDelete = (index: number) => {
    let newFiles = [...files];

    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const handlePreview = (index: number) => {
    setSelectedPrevFiles([files[index]]);
    setIsModalOpen(true);
  };

  return (
    <>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Preview`}
        size="xl"
      >
        {selectedPrevFiles.map((file, index) => (
          <div key={index} className="w-full h-[500px]">
            <img
              className="w-full h-[500px] object-contain rounded-lg"
              src={URL.createObjectURL(file)}
              alt=""
            />
          </div>
        ))}
      </Modal>

      <div className="w-full flex flex-col">
        {label && (
          <div className="block text-sm font-medium text-gray-700 mb-3">
            {label}
          </div>
        )}
        <div className="w-full flex flex-wrap gap-2 items-center space-x-2">
          <div
            className="w-[100px] h-[100px] space-y-1 cursor-pointer flex flex-col items-center justify-center border border-dashed border-blue-700 rounded-lg"
            onClick={handleTrigger}
          >
            <input
              multiple={type == "multiple"}
              className="hidden"
              type="file"
              ref={InputRef}
              accept={accept}
              onChange={handleFileChange}
            />
            <Upload className="w-5 h-5 text-blue-700" />
            <div className="text-xs text-blue-700">Upload</div>
            <div className="text-xs text-blue-700">Max limit: 2MB</div>
          </div>
          {/* Render uploaded files */}
          {files.map((file, index) => (
            <div
              key={index}
              className="w-[100px] h-[100px] rounded-lg flex flex-col items-center relative border border-gray-400"
            >
              <img
                onClick={() => handlePreview(index)}
                className="w-[100px] h-[100px] object-cover rounded-lg"
                src={URL.createObjectURL(file)}
                alt=""
              />
              <div
                onClick={() => handleDelete(index)}
                className="absolute w-[24px] h-[24px] bg-red-500 top-[-5px] right-[-5px] rounded-full text-xs text-white cursor-pointer flex items-center justify-center"
              >
                <Trash2 className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default FileUpload;
