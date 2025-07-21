import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell,
  ResponsiveTable
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Helmet } from 'react-helmet';
import { EmployeeForm } from "@/components/forms/employee-form";
import { User, Department } from "@shared/schema";

export default function EmployeeDirectory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [isEmployeeFormOpen, setIsEmployeeFormOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Partial<User> | undefined>(undefined);
  
  // Fetch users
  const { data: users, isLoading: isLoadingUsers, error: usersError } = useQuery<User[]>({
    queryKey: ['/api/users'],
  });
  
  // Fetch departments
  const { data: departmentsData, isLoading: isLoadingDepartments } = useQuery<Department[]>({
    queryKey: ['/api/departments'],
  });

  const filteredUsers = users?.filter(user => {
    const matchesSearch = (
      user.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.department.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    const matchesDepartment = departmentFilter === "all" || user.department === departmentFilter;
    
    return matchesSearch && matchesDepartment;
  });

  // Extract department names for form and filtering
  const departmentNames = departmentsData ? departmentsData.map(dept => dept.name) : [];
  
  // Also extract unique departments from users as a fallback
  const userDepartments = users ? Array.from(new Set(users.map(user => user.department))) : [];
  
  // Combine both sources of departments for a complete list
  const allDepartments = Array.from(new Set([...departmentNames, ...userDepartments]));
  
  // Loading state
  const isLoading = isLoadingUsers || isLoadingDepartments;
  const error = usersError;

  return (
    <>
      <Helmet>
        <title>Employee Directory | Proxa People Management</title>
        <meta name="description" content="Browse and manage your company's employee directory with detailed profiles and organization structure." />
      </Helmet>
      
      {/* Page Title */}
      <div className="mb-6">
        <h1 className="text-2xl font-heading font-semibold text-neutral-800">Employee Directory</h1>
        <p className="text-neutral-500 mt-1">View and manage your team members</p>
      </div>
      
      <Card className="shadow-sm mb-6">
        <CardContent className="pt-6">
          <div className="space-y-4 md:space-y-0 md:flex md:flex-wrap md:gap-4 md:justify-between">
            <div className="relative w-full md:w-64 order-1">
              <Input
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10"
              />
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"></i>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2 order-2 md:order-3">
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-full sm:w-[180px] h-10">
                  <SelectValue placeholder="Filter by Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {allDepartments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button 
                onClick={() => {
                  setSelectedEmployee(undefined);
                  setIsEmployeeFormOpen(true);
                }}
                className="w-full sm:w-auto h-10 px-4"
              >
                <i className="ri-add-line mr-2"></i>
                <span className="hidden sm:inline">Add Employee</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-sm">
        <CardHeader className="pb-0">
          <CardTitle className="text-lg font-heading font-medium text-neutral-800">Team Members</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="py-8 text-center">Loading employees...</div>
          ) : error ? (
            <div className="py-8 text-center text-red-500">Error loading employee data</div>
          ) : filteredUsers && filteredUsers.length > 0 ? (
            <ResponsiveTable
              data={filteredUsers}
              columns={[
                {
                  key: 'name',
                  label: 'Name',
                  render: (user) => (
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 sm:h-10 sm:w-10">
                        {user.profileImage && 
                          <AvatarImage src={user.profileImage} alt={`${user.firstName} ${user.lastName}`} />
                        }
                        <AvatarFallback className="text-xs sm:text-sm">{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-sm sm:text-base">{user.firstName} {user.lastName}</div>
                        <div className="text-xs sm:text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  )
                },
                {
                  key: 'jobTitle',
                  label: 'Job Title',
                  render: (user) => <span className="text-sm">{user.jobTitle}</span>
                },
                {
                  key: 'department',
                  label: 'Department',
                  render: (user) => <span className="text-sm">{user.department}</span>
                },
                {
                  key: 'manager',
                  label: 'Manager',
                  render: (user) => <span className="text-sm">{user.managerId ? "Has Manager" : "No Manager"}</span>
                },
                {
                  key: 'hireDate',
                  label: 'Hire Date',
                  render: (user) => <span className="text-sm">{user.hireDate ? new Date(user.hireDate).toLocaleDateString() : "N/A"}</span>
                },
                {
                  key: 'actions',
                  label: 'Actions',
                  render: (user) => (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="w-full sm:w-auto"
                      onClick={() => {
                        setSelectedEmployee(user);
                        setIsEmployeeFormOpen(true);
                      }}
                    >
                      <i className="ri-eye-line mr-1"></i>
                      View
                    </Button>
                  )
                }
              ]}
            >
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Manager</TableHead>
                    <TableHead>Hire Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map(user => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar>
                            {user.profileImage && 
                              <AvatarImage src={user.profileImage} alt={`${user.firstName} ${user.lastName}`} />
                            }
                            <AvatarFallback>{user.firstName[0]}{user.lastName[0]}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.firstName} {user.lastName}</div>
                            <div className="text-sm text-neutral-500">{user.email}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{user.jobTitle}</TableCell>
                      <TableCell>{user.department}</TableCell>
                      <TableCell>{user.managerId ? "Has Manager" : "No Manager"}</TableCell>
                      <TableCell>{user.hireDate ? new Date(user.hireDate).toLocaleDateString() : "N/A"}</TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => {
                            setSelectedEmployee(user);
                            setIsEmployeeFormOpen(true);
                          }}
                        >
                          <i className="ri-eye-line mr-1"></i>
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ResponsiveTable>
          ) : (
            <div className="py-8 text-center">No employees found matching your filters</div>
          )}
        </CardContent>
      </Card>
      {/* Employee Form Dialog */}
      {isEmployeeFormOpen && (
        <EmployeeForm
          open={isEmployeeFormOpen}
          onClose={() => setIsEmployeeFormOpen(false)}
          initialData={selectedEmployee}
          departments={allDepartments}
          managers={users?.filter(user => user.role === "manager" || user.role === "admin").map(user => ({
            id: user.id,
            name: `${user.firstName} ${user.lastName}`
          })) || []}
        />
      )}
    </>
  );
}
