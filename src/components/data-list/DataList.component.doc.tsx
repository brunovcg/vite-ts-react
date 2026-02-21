import { DataList, type DataListProps } from "./DataList.component";
import type { ComponentDoc } from "@/types/component-doc.types";

export const dataListDoc: ComponentDoc<DataListProps<string>> = {
  id: "data-list",
  name: "DataList",
  description: "An input with a list of suggestions.",
  component: DataList,
  args: {
    id: "data-list-demo",
    name: "data-list-demo",
    label: "Browser",
    placeholder: "Choose a browser...",
    options: [
      { label: "Chrome", value: "chrome" },
      { label: "Firefox", value: "firefox" },
      { label: "Safari", value: "safari" },
      { label: "Edge", value: "edge" },
    ],
    allowOutOfList: false,
    loading: false,
    disabled: false,
  },
  argTypes: {
    allowOutOfList: {
      type: "boolean",
    },
    loading: {
      type: "boolean",
    },
    disabled: {
      type: "boolean",
    },
  },
};
