import { ServerTable } from "./instances/server-table/ServerTable.component";
import { cellsTable } from "./cells/CellsTable.component";
import { ClientTable } from "./instances/client-table/ClientTable.component";

export const Table = {
  Server: ServerTable,
  Client: ClientTable,
  Cell: cellsTable,
};

// Re-export types for convenience
export type { Column } from "./instances/base-table/BaseTable.component";
export type { ServerTableProps, Paginated } from "./instances/server-table/ServerTable.component";
export type { ClientTableProps } from "./instances/client-table/ClientTable.component";
