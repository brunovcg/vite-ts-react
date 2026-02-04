import { ServerTable } from "./ServerTable";
import { ClientTable } from "./ClientTable";
import { cellsTable } from "./cells/CellsTable";

export const Table = {
  Server: ServerTable,
  Client: ClientTable,
  Cell: cellsTable,
};

// Re-export types for convenience
export type { Column } from "./BaseTable";
export type { ServerTableProps, Paginated } from "./ServerTable";
export type { ClientTableProps } from "./ClientTable";
