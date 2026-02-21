import { UploadFile } from "./UploadFile.component";
import type { ComponentDoc } from "@/types/component-doc.types";
import type { InputHTMLAttributes } from "react";
import type { Css } from "@/runtime/css.types";

interface UploadFileProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "onChange"> {
  label?: string;
  inputCss?: Css;
  inputClassName?: string;
  css?: Css;
  className?: string;
  onChange?: (files: FileList | null) => void;
}

export const uploadFileDoc: ComponentDoc<UploadFileProps> = {
  id: "upload-file",
  name: "UploadFile",
  description: "A file upload component with drag-and-drop support.",
  component: UploadFile,
  args: {
    id: "upload-demo",
    label: "Upload Files",
    multiple: false,
    disabled: false,
    required: false,
    accept: "",
  },
  argTypes: {
    id: {
      type: "text",
    },
    label: {
      type: "text",
    },
    multiple: {
      type: "boolean",
    },
    disabled: {
      type: "boolean",
    },
    required: {
      type: "boolean",
    },
    accept: {
      type: "text",
    },
  },
};
