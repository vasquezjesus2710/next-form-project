/**
 * FileInput Component
 *
 * Renders a file input with drag-and-drop support. Displays the selected file's name and size,
 * and simulates file upload progress. Integrates with Formik for form state management.
 */

import { faFile } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useField, useFormikContext } from "formik";
import React, { useRef, useState } from "react";
import ErrorMessage from "./ErrorMessage";
import RequiredAsterisk from "./RequiredAsterisk";
import Separator from "./Separator";

interface FileInputProps {
  label: string;
  required?: boolean;
  name: string;
}

const FileInput: React.FC<FileInputProps> = ({ label, ...props }) => {
  const { required } = props;
  const [field, meta] = useField(props);
  const { setFieldValue } = useFormikContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // State to manage drag-over styling
  const [dragging, setDragging] = useState(false);

  // State to store information about the selected file
  const [fileInfo, setFileInfo] = useState<{ name: string; size: number } | null>(null);

  // State to simulate and display upload progress
  const [uploadProgress, setUploadProgress] = useState(0);

  // Simulates file upload progress
  const simulateUpload = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setUploadProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
      }
    }, 20); // Adjust time interval to control speed of the animation
  };

  // Handles file selection via input change event
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = event.target;
    const file = files ? files[0] : null;
    setFieldValue(props.name, file); // Update Formik's state
    if (file) {
      setFileInfo({ name: file.name, size: file.size });
      setUploadProgress(0); // Reset progress
      simulateUpload(); // Simulate upload process
    }
  };

  // Opens the file input dialog
  const handleClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handles file drop
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setDragging(false); // Reset drag state
    const files = event.dataTransfer.files;
    if (files && files.length > 0) {
        const file = files[0];
        if (file) {
          setFileInfo({ name: file.name, size: file.size });
          setFieldValue(props.name, file);
        }
        setUploadProgress(0); // Reset progress
        simulateUpload(); // Simulate upload process
    }
};

// Manages drag-over state for styling
  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (!dragging) {
      setDragging(true);
    }
  };

  // Resets dragging state when dragging leaves the drop area
  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Title */}
      <div className="flex flex-col gap-4">
        <Separator/>
        <label className="font-bold text-sm leading-tight text-indigo-900" htmlFor={props.name}>
          {label}
          <RequiredAsterisk required={required} />
        </label>  
      </div>
             
      {/* File drop area */}
      <div
        className={`border border-grey-500 rounded-md p-4 flex flex-col items-center gap-4 ${dragging ? "bg-blue-100" : "bg-white"} cursor-pointer`}
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <div className="border border-grey-500 border-dashed flex flex-col gap-4 items-center justify-center rounded-md py-9 w-full">
          <FontAwesomeIcon icon={faFile} className="text-amber-500 h-5 w-5" />
          <h4 className="text-sm leading-tight">Drag & Drop Here or <span className="font-bold">Browse</span></h4>
        </div>
        <button type="button" className="text-white px-12 py-2 rounded-md bg-blue-950 w-fit">Upload Manifest</button>
      </div>

      {/* Hidden input */}
      <input type="file" className="hidden" ref={fileInputRef} onChange={handleChange} />

      {/* File info */}
      {fileInfo && (
          <div className="file-info flex gap-4 p-4 items-center border-t border-grey-500">
            <FontAwesomeIcon icon={faFile} className="text-amber-500 h-5 w-5" />
            <div className="grow">
              <div className="flex justify-between text-sm text-slate-500">
                <p className="text-sm">{fileInfo.name}</p>
                <p className="text-xs">{Math.round(fileInfo.size / 1024)} KB</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1 dark:bg-gray-700">
                <div className="bg-amber-500 h-1 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
              </div>
            </div>
          </div>
        )}

      <ErrorMessage touched={meta.touched} error={meta.error} />
    </div>
  );
};

export default FileInput;
