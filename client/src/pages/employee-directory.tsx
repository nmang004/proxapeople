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
  TableCell
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
import { User } from "@/lib/types";
import { Helmet } from 'react-helmet';

export default function EmployeeDirectory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  
  const { data: users, isLoading, error } = useQuery<User[]>({
    queryKey: ['/api/users'],
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

  // Extract unique departments for filter
  const departments = users ? [...new Set(users.map(user => user.department))] : [];

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
          <div className="flex flex-wrap gap-4 justify-between">
            <div className="relative w-full md:w-64">
              <Input
                placeholder="Search employees..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"></i>
            </div>
            
            <div className="flex gap-2">
              <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.map(dept => (
                    <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button>
                <i className="ri-add-line mr-1"></i>
                Add Employee
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
                          <AvatarImage src={user.profileImage} alt={`${user.firstName} ${user.lastName}`} />
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
                      <Button variant="ghost" size="sm">
                        <i className="ri-eye-line mr-1"></i>
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="py-8 text-center">No employees found matching your filters</div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
