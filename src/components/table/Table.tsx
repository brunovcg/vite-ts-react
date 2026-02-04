/**
 * @deprecated This file has been refactored into separate components.
 *
 * Please use the new structure:
 *
 * For server-side data fetching:
 * ```tsx
 * import { Table } from "@/components/table";
 *
 * <Table.Server
 *   columns={columns}
 *   primaryKey="id"
 *   service={async (pagination) => {
 *     // Fetch data from server
 *     return { data: [...], total: 100 };
 *   }}
 *   downloadable
 * />
 * ```
 *
 * For client-side data processing:
 * ```tsx
 * import { Table } from "@/components/table";
 *
 * <Table.Client
 *   columns={columns}
 *   primaryKey="id"
 *   rows={myData}
 *   downloadable
 * />
 * ```
 *
 * The new structure separates concerns:
 * - BaseTable.tsx: Pure UI component
 * - ServerTable.tsx: Server-side data fetching logic
 * - ClientTable.tsx: Client-side data processing logic
 * - index.ts: Exports Table.Server and Table.Client
 */

export {};
