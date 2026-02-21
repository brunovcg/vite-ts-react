import type { Css } from "@/runtime/css.types";
import type { InputHTMLAttributes } from "react";
import "./UploadFile.component.css";
import { useUploadFile } from "./hooks/useUploadFile";
import { mergeClass } from "@/utils/class-names/ClassNames.util";

interface UploadFileProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  label?: string;
  inputCss?: Css;
  inputClassName?: string;
  css?: Css;
  className?: string;
  onChange?: (files: FileList | null) => void;
}

export function UploadFile({ label, id, css, className, inputCss, inputClassName, onChange, ...rest }: UploadFileProps) {
  const { isDragging, selectedFiles, handleDragEnter, handleDragLeave, handleDragOver, handleDrop, handleFileChange } = useUploadFile(onChange);

  const getFileNames = () => {
    if (!selectedFiles || selectedFiles.length === 0) return null;
    return Array.from(selectedFiles)
      .map((file) => file.name)
      .join(", ");
  };

  const fileCount = selectedFiles ? selectedFiles.length : 0;
  const fileCountText = fileCount === 0 ? "" : fileCount === 1 ? "1 file selected" : `${fileCount} files selected`;

  return (
    <label
      htmlFor={id}
      css={css}
      className={mergeClass(className, isDragging ? "dragging" : "")}
      data-css='UploadFile'
      data-component='UploadFile'
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      aria-label={label || "File upload"}
    >
      {label && <span className='label-text'>{label}</span>}

      <div className='upload-area' aria-hidden='true'>
        <span className='upload-text'>{getFileNames() || "Drag & drop files or click to browse"}</span>
      </div>

      {fileCount > 0 && (
        <span className='sr-only' role='status' aria-live='polite'>
          {fileCountText}
        </span>
      )}

      <input
        type='file'
        id={id}
        css={inputCss}
        className={mergeClass("file-input", inputClassName)}
        onChange={handleFileChange}
        aria-required={rest.required}
        aria-invalid={rest["aria-invalid"]}
        {...rest}
      />
    </label>
  );
}
