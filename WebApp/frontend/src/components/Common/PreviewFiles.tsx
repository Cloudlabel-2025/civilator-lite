import React from "react";
import { Modal } from "../Common/Modal";
interface PreviewFilesProps {
  isPreviewModalOpen: boolean;
  files: any[];
  setIsPreviewModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const PreviewFiles: React.FC<PreviewFilesProps> = ({
  isPreviewModalOpen,
  files,
  setIsPreviewModalOpen,
}) => {
  return (
    <>
      <Modal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        title={`Preview`}
        size="xl"
      >
        {files.map((file, index) => (
          <div key={index} className="w-full h-[500px]">
            <img
              className="w-full h-[500px] object-contain rounded-lg"
              src={typeof file == "string" ? file : URL.createObjectURL(file)}
              alt=""
            />
          </div>
        ))}
      </Modal>
    </>
  );
};

export default PreviewFiles;
