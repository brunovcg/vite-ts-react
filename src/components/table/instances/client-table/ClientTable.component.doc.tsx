import { Table } from "../../Table.component";
import type { ComponentDoc } from "@/types/component-doc.types";
import type { Column } from "../../instances/base-table/BaseTable.component";
import type { ClientTableProps } from "./ClientTable.component";

interface RowData {
  id: number;
  name: string;
  role: string;
  status: string;
}

const columns: Column<RowData>[] = [
  { header: "ID", accessor: "id", sortable: true },
  { header: "Name", accessor: "name", sortable: true },
  { header: "Role", accessor: "role" },
  { header: "Status", accessor: "status" },
];

const data: RowData[] = [
  { id: 1, name: "Alice Johnson", role: "Admin", status: "Active" },
  { id: 2, name: "Bob Smith", role: "User", status: "Inactive" },
  { id: 3, name: "Charlie Brown", role: "User", status: "Active" },
];

export const clientTableDoc: ComponentDoc<ClientTableProps<RowData>> = {
  id: "table-client",
  name: "Table.Client",
  description: "A client-side table with sorting and pagination.",
  component: Table.Client,
  args: {
    columns: columns,
    rows: data,
    primaryKey: "id",
    downloadable: true,
  },
  argTypes: {
    downloadable: { type: "boolean" },
    columns: { type: "object" },
    rows: { type: "object" },
  },
};
