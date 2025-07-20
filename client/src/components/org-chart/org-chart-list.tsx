import { User, Department } from "@shared/schema";

interface OrgChartListProps {
  users: User[];
  departments: Department[];
}

// Placeholder org chart list component
export default function OrgChartList({ users, departments }: OrgChartListProps) {
  return (
    <div>
      <h3>Organization Chart List</h3>
      <p>Org chart list view to be implemented.</p>
      <p>Users: {users.length}, Departments: {departments.length}</p>
    </div>
  );
}