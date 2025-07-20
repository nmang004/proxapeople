import React, { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Mail, Phone, UserPlus, ExternalLink } from "lucide-react";
import type { User, Department } from "@shared/schema";

interface OrgChartListProps {
  users: User[];
  departments: Department[];
}

// Extended user with parent relationship - simplified for sample data
interface ExtendedUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
  jobTitle?: string;
  manager?: string;
  department?: string;
  directReports?: number;
  title?: string;
  profileImageUrl?: string;
  // Optional User schema fields for compatibility
  password?: string;
  managerId?: number | null;
  profileImage?: string;
  hireDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

const OrgChartList = ({ users, departments }: OrgChartListProps) => {
  // Process the hierarchy data to a flat list with manager relationship
  const processedData = useMemo(() => {
    // In a real implementation, we would use the actual users data
    // For now, generating sample data for display
    const sampleData: ExtendedUser[] = [
      {
        id: 1,
        firstName: "Sarah",
        lastName: "Johnson",
        email: "sarah.johnson@proxapeople.com",
        password: "password123",
        role: "admin" as const,
        jobTitle: "Chief Executive Officer",
        managerId: null,
        profileImage: "https://i.pravatar.cc/150?img=1",
        hireDate: "2020-01-01",
        createdAt: "2025-01-01T00:00:00Z",
        updatedAt: "2025-01-01T00:00:00Z",
        title: "Chief Executive Officer",
        profileImageUrl: "https://i.pravatar.cc/150?img=1",
        department: "Executive",
        directReports: 3,
      },
      {
        id: 2,
        firstName: "Michael",
        lastName: "Chen",
        email: "michael.chen@proxapeople.com",
        password: "password123",
        role: "manager" as const,
        jobTitle: "Chief Technology Officer",
        managerId: 1,
        profileImage: "https://i.pravatar.cc/150?img=2",
        hireDate: "2020-02-01",
        createdAt: "2025-01-01T00:00:00Z",
        updatedAt: "2025-01-01T00:00:00Z",
        title: "Chief Technology Officer",
        profileImageUrl: "https://i.pravatar.cc/150?img=2",
        manager: "Sarah Johnson",
        department: "Engineering",
        directReports: 2,
      },
      {
        id: 3,
        firstName: "Jessica",
        lastName: "Thompson",
        email: "jessica.thompson@proxapeople.com",
        title: "Chief Marketing Officer",
        profileImageUrl: "https://i.pravatar.cc/150?img=3",
        manager: "Sarah Johnson",
        department: "Marketing",
        directReports: 1,
      },
      {
        id: 4,
        firstName: "Thomas",
        lastName: "Williams",
        email: "thomas.williams@proxapeople.com",
        title: "Chief Financial Officer",
        profileImageUrl: "https://i.pravatar.cc/150?img=4",
        manager: "Sarah Johnson",
        department: "Finance",
        directReports: 1,
      },
      {
        id: 5,
        firstName: "Emily",
        lastName: "Wilson",
        email: "emily.wilson@proxapeople.com",
        title: "Engineering Director",
        profileImageUrl: "https://i.pravatar.cc/150?img=5",
        manager: "Michael Chen",
        department: "Engineering",
        directReports: 3,
      },
      {
        id: 6,
        firstName: "Robert",
        lastName: "Garcia",
        email: "robert.garcia@proxapeople.com",
        title: "Product Director",
        profileImageUrl: "https://i.pravatar.cc/150?img=6",
        manager: "Michael Chen",
        department: "Product",
        directReports: 2,
      },
      {
        id: 7,
        firstName: "Alex",
        lastName: "Rodriguez",
        email: "alex.rodriguez@proxapeople.com",
        title: "Marketing Director",
        profileImageUrl: "https://i.pravatar.cc/150?img=7",
        manager: "Jessica Thompson",
        department: "Marketing",
        directReports: 2,
      },
      {
        id: 8,
        firstName: "Natalie",
        lastName: "Brown",
        email: "natalie.brown@proxapeople.com",
        title: "Finance Director",
        profileImageUrl: "https://i.pravatar.cc/150?img=8",
        manager: "Thomas Williams",
        department: "Finance",
        directReports: 2,
      },
      {
        id: 9,
        firstName: "David",
        lastName: "Martinez",
        email: "david.martinez@proxapeople.com",
        title: "Senior Software Engineer",
        profileImageUrl: "https://i.pravatar.cc/150?img=9",
        manager: "Emily Wilson",
        department: "Engineering",
        directReports: 0,
      },
      {
        id: 10,
        firstName: "Lisa",
        lastName: "Wong",
        email: "lisa.wong@proxapeople.com",
        title: "Software Engineer",
        profileImageUrl: "https://i.pravatar.cc/150?img=10",
        manager: "Emily Wilson",
        department: "Engineering",
        directReports: 0,
      },
      {
        id: 11,
        firstName: "James",
        lastName: "Taylor",
        email: "james.taylor@proxapeople.com",
        title: "Software Engineer",
        profileImageUrl: "https://i.pravatar.cc/150?img=11",
        manager: "Emily Wilson",
        department: "Engineering",
        directReports: 0,
      },
      {
        id: 12,
        firstName: "Sophia",
        lastName: "Patel",
        email: "sophia.patel@proxapeople.com",
        title: "Product Manager",
        profileImageUrl: "https://i.pravatar.cc/150?img=12",
        manager: "Robert Garcia",
        department: "Product",
        directReports: 0,
      },
      {
        id: 13,
        firstName: "Daniel",
        lastName: "Kim",
        email: "daniel.kim@proxapeople.com",
        title: "UX Designer",
        profileImageUrl: "https://i.pravatar.cc/150?img=13",
        manager: "Robert Garcia",
        department: "Product",
        directReports: 0,
      },
      {
        id: 14,
        firstName: "Olivia",
        lastName: "Davis",
        email: "olivia.davis@proxapeople.com",
        title: "Social Media Manager",
        profileImageUrl: "https://i.pravatar.cc/150?img=14",
        manager: "Alex Rodriguez",
        department: "Marketing",
        directReports: 0,
      },
      {
        id: 15,
        firstName: "Ryan",
        lastName: "Smith",
        email: "ryan.smith@proxapeople.com",
        title: "Content Creator",
        profileImageUrl: "https://i.pravatar.cc/150?img=15",
        manager: "Alex Rodriguez",
        department: "Marketing",
        directReports: 0,
      },
      {
        id: 16,
        firstName: "William",
        lastName: "Lee",
        email: "william.lee@proxapeople.com",
        title: "Financial Analyst",
        profileImageUrl: "https://i.pravatar.cc/150?img=16",
        manager: "Natalie Brown",
        department: "Finance",
        directReports: 0,
      },
      {
        id: 17,
        firstName: "Emma",
        lastName: "Clark",
        email: "emma.clark@proxapeople.com",
        title: "Accountant",
        profileImageUrl: "https://i.pravatar.cc/150?img=17",
        manager: "Natalie Brown",
        department: "Finance",
        directReports: 0,
      },
    ];
    
    return sampleData;
  }, [users, departments]);

  // Get user initials for avatar fallback
  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Employee Directory</h2>
        <Button size="sm">
          <UserPlus className="h-4 w-4 mr-2" />
          Add Employee
        </Button>
      </div>
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Employee</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Department</TableHead>
              <TableHead>Manager</TableHead>
              <TableHead>Direct Reports</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead className="w-20">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {processedData.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage 
                        src={user.profileImageUrl} 
                        alt={`${user.firstName} ${user.lastName}`} 
                      />
                      <AvatarFallback className="text-xs">
                        {getInitials(user.firstName, user.lastName)}
                      </AvatarFallback>
                    </Avatar>
                    <span>{user.firstName} {user.lastName}</span>
                  </div>
                </TableCell>
                <TableCell>{user.title}</TableCell>
                <TableCell>
                  <Badge variant="outline">{user.department}</Badge>
                </TableCell>
                <TableCell>
                  {user.manager ? (
                    <span className="text-sm">{user.manager}</span>
                  ) : (
                    <span className="text-sm text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={user.directReports ? "default" : "secondary"}
                    className="font-mono"
                  >
                    {user.directReports}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Mail className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{user.email}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Phone className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>+1 (555) 123-4567</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>View Profile</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default OrgChartList;