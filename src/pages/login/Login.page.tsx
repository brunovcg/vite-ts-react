import { Button } from "@/components/button/Button";
import { Checkbox } from "@/components/checkbox/Checkbox";
import { Chip } from "@/components/chip/Chip";
import { DataList } from "@/components/data-list/DataList";
import { Input } from "@/components/input/Input";
import { Select } from "@/components/select/Select";
import type { Column } from "@/components/table/BaseTable";
import { Table } from "@/components/table/Table";
import { Tabs } from "@/components/tabs/Tabs";
import { TextArea } from "@/components/text-area/TextArea";
import type { PropsWithCss } from "@/runtime/css.types";
import { mergeCss } from "@/utils/class-names/ClassNames.util";
import { Form } from "react-router-dom";

// Sample data type
interface User extends Record<string, unknown> {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
  lastLogin: string;
}

function Component({ css }: PropsWithCss) {
  console.log(css);

  return <div css={mergeCss("background-primary", css)}>xxx</div>;
}

// Sample data
const sampleUsers: User[] = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Admin",
    status: "Active",
    createdAt: "2024-01-15T10:30:00Z",
    lastLogin: "2026-02-04T08:15:00Z",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "User",
    status: "Active",
    createdAt: "2024-02-20T14:45:00Z",
    lastLogin: "2026-02-03T16:30:00Z",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob.johnson@example.com",
    role: "Manager",
    status: "Inactive",
    createdAt: "2024-03-10T09:00:00Z",
    lastLogin: "2026-01-28T11:20:00Z",
  },
  {
    id: 4,
    name: "Alice Williams",
    email: "alice.williams@example.com",
    role: "User",
    status: "Active",
    createdAt: "2024-04-05T11:15:00Z",
    lastLogin: "2026-02-04T09:45:00Z",
  },
  {
    id: 5,
    name: "Charlie Brown",
    email: "charlie.brown@example.com",
    role: "Admin",
    status: "Active",
    createdAt: "2024-05-12T13:30:00Z",
    lastLogin: "2026-02-04T07:00:00Z",
  },
  {
    id: 6,
    name: "Diana Prince",
    email: "diana.prince@example.com",
    role: "Manager",
    status: "Active",
    createdAt: "2024-06-18T15:20:00Z",
    lastLogin: "2026-02-02T14:10:00Z",
  },
  {
    id: 7,
    name: "Ethan Hunt",
    email: "ethan.hunt@example.com",
    role: "User",
    status: "Inactive",
    createdAt: "2024-07-22T10:00:00Z",
    lastLogin: "2026-01-15T10:30:00Z",
  },
  {
    id: 8,
    name: "Fiona Green",
    email: "fiona.green@example.com",
    role: "User",
    status: "Active",
    createdAt: "2024-08-30T12:45:00Z",
    lastLogin: "2026-02-04T13:20:00Z",
  },
  {
    id: 9,
    name: "George Miller",
    email: "george.miller@example.com",
    role: "Admin",
    status: "Active",
    createdAt: "2024-09-14T16:10:00Z",
    lastLogin: "2026-02-03T18:45:00Z",
  },
  {
    id: 10,
    name: "Hannah Lee",
    email: "hannah.lee@example.com",
    role: "Manager",
    status: "Active",
    createdAt: "2024-10-25T08:30:00Z",
    lastLogin: "2026-02-04T12:00:00Z",
  },
  {
    id: 11,
    name: "Ian Malcolm",
    email: "ian.malcolm@example.com",
    role: "User",
    status: "Inactive",
    createdAt: "2024-11-08T14:20:00Z",
    lastLogin: "2026-01-20T09:15:00Z",
  },
  {
    id: 12,
    name: "Julia Roberts",
    email: "julia.roberts@example.com",
    role: "User",
    status: "Active",
    createdAt: "2024-12-01T11:00:00Z",
    lastLogin: "2026-02-04T10:30:00Z",
  },
];

// Define columns with custom cells, sorting, and filtering
const columns: Column<User>[] = [
  {
    header: "ID",
    accessor: "id",
    sortable: true,
  },
  {
    header: "Name",
    accessor: "name",
    sortable: true,
    filter: { type: "text" },
  },
  {
    header: "Email",
    accessor: "email",
    sortable: true,
    filter: { type: "text" },
  },
  {
    header: "Role",
    accessor: "role",
    sortable: true,
    filter: { type: "text" },
  },
  {
    header: "Status",
    alignCell: "center",
    alignHeader: "center",
    cell: (props) => {
      const status = props.row.status;
      const isActive = status === "Active";
      return <Chip color={isActive ? "success" : "error"}> {status}</Chip>;
    },
    sortable: true,
    filter: { type: "text" },
  },
  {
    header: "Created At",
    accessor: "createdAt",
    cell: Table.Cell.Date,
    filter: { type: "date" },
    sortable: true,
  },
  {
    accessor: "lastLogin",
    header: "Last Login",
    cell: Table.Cell.Date,
    sortable: true,
  },
];

export function Login() {
  const laoding = false;

  return (
    <div data-component='Login' css={["padding-xl"]}>
      <div css={["margin-bottom-lg"]}>
        <h1>Table Example - User Management</h1>
        <p css={["margin-top-sm"]}>This is a comprehensive example of the ClientTable component with sorting, filtering, pagination, and downloadable features.</p>
      </div>
      <Table.Client columns={columns} rows={sampleUsers} primaryKey='id' downloadable={true} />
      <div css={["margin-top-xl"]}>
        <div css={["margin-bottom-md"]}>
          <h2>DataList Example</h2>
          <p css={["margin-top-sm"]}>A native datalist example using the roles from the user data above.</p>
        </div>

        <Form onSubmit={console.log}>
          <Input name='name' id='name' label='Name' loading={laoding} required />
          <Select
            name='role'
            id='role'
            placeholder='Select a role'
            label='Role'
            options={Array.from(new Set(sampleUsers.map((u) => u.role))).map((role) => ({ label: role, value: role }))}
            loading={laoding}
            allowClear
          />
          <TextArea name='description' id='description' label='Description' loading={laoding} />
          <DataList
            id='role-search'
            name='role'
            label='Filter by Role'
            placeholder='Type or select a role...'
            options={Array.from(new Set(sampleUsers.map((u) => u.role))).map((role) => ({ label: role, value: role }))}
            loading={laoding}
          />
          <Button type='submit'>Submit</Button>
        </Form>
      </div>

      <Tabs
        id='tabtest'
        tabs={[
          { label: "Tab 1", id: "tab-1" },
          { label: "Tab 2", id: "tab-2" },
        ]}
      >
        <Tabs.Nav />
        <Tabs.Item id='tab-1'>Tab 1 Content</Tabs.Item>
        <Tabs.Item id='tab-2'>Tab 2 Content</Tabs.Item>
      </Tabs>
      <Component css={["color-error"]} />
      <Checkbox label='Checkbox' />
    </div>
  );
}
