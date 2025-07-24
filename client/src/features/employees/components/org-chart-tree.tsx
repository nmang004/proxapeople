import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronDown, 
  ChevronRight, 
  Mail, 
  Phone, 
  MapPin,
  Briefcase
} from "lucide-react";
import { 
  Avatar, 
  AvatarFallback, 
  AvatarImage 
} from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { User, Department } from "@shared/schema";

// Extended types for hierarchy - simplified for sample data
interface ExtendedUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  title?: string;
  profileImageUrl?: string;
  children?: ExtendedUser[];
  isExpanded?: boolean;
  level?: number;
  parentId?: number | null;
  // Optional User schema fields for compatibility
  role?: string;
  password?: string;
  jobTitle?: string;
  department?: string;
  managerId?: number | null;
  profileImage?: string;
  hireDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface OrgChartTreeProps {
  users: User[];
  departments: Department[];
  layout: "vertical" | "horizontal";
}

// Helper to build hierarchical structure
const buildHierarchy = (users: User[]): ExtendedUser[] => {
  // For now, use sample data for demonstration
  // In a real implementation, this would process actual user data
  
  // Create a map of users by ID for easy lookup
  const usersMap: Record<number, ExtendedUser> = {};
  
  // Sample data structure for the org chart
  return [
    {
      id: 1,
      firstName: "Sarah",
      lastName: "Johnson",
      email: "sarah.johnson@proxapeople.com",
      title: "Chief Executive Officer",
      profileImageUrl: "https://i.pravatar.cc/150?img=1",
      children: [
        {
          id: 2,
          firstName: "Michael",
          lastName: "Chen",
          email: "michael.chen@proxapeople.com",
          title: "Chief Technology Officer",
          profileImageUrl: "https://i.pravatar.cc/150?img=2",
          children: [
            {
              id: 5,
              firstName: "Emily",
              lastName: "Wilson",
              email: "emily.wilson@proxapeople.com",
              title: "Engineering Director",
                  profileImageUrl: "https://i.pravatar.cc/150?img=5",
              children: [
                {
                  id: 9,
                  firstName: "David",
                  lastName: "Martinez",
                  email: "david.martinez@proxapeople.com",
                  title: "Senior Software Engineer",
                          profileImageUrl: "https://i.pravatar.cc/150?img=9",
                  children: []
                },
                {
                  id: 10,
                  firstName: "Lisa",
                  lastName: "Wong",
                  email: "lisa.wong@proxapeople.com",
                  title: "Software Engineer",
                          profileImageUrl: "https://i.pravatar.cc/150?img=10",
                  children: []
                },
                {
                  id: 11,
                  firstName: "James",
                  lastName: "Taylor",
                  email: "james.taylor@proxapeople.com",
                  title: "Software Engineer",
                          profileImageUrl: "https://i.pravatar.cc/150?img=11",
                  children: []
                }
              ]
            },
            {
              id: 6,
              firstName: "Robert",
              lastName: "Garcia",
              email: "robert.garcia@proxapeople.com",
              title: "Product Director",
              profileImageUrl: "https://i.pravatar.cc/150?img=6",
              children: [
                {
                  id: 12,
                  firstName: "Sophia",
                  lastName: "Patel",
                  email: "sophia.patel@proxapeople.com",
                  title: "Product Manager",
                      profileImageUrl: "https://i.pravatar.cc/150?img=12",
                  children: []
                },
                {
                  id: 13,
                  firstName: "Daniel",
                  lastName: "Kim",
                  email: "daniel.kim@proxapeople.com",
                  title: "UX Designer",
                      profileImageUrl: "https://i.pravatar.cc/150?img=13",
                  children: []
                }
              ]
            }
          ]
        },
        {
          id: 3,
          firstName: "Jessica",
          lastName: "Thompson",
          email: "jessica.thompson@proxapeople.com",
          title: "Chief Marketing Officer",
          profileImageUrl: "https://i.pravatar.cc/150?img=3",
          children: [
            {
              id: 7,
              firstName: "Alex",
              lastName: "Rodriguez",
              email: "alex.rodriguez@proxapeople.com",
              title: "Marketing Director",
                  profileImageUrl: "https://i.pravatar.cc/150?img=7",
              children: [
                {
                  id: 14,
                  firstName: "Olivia",
                  lastName: "Davis",
                  email: "olivia.davis@proxapeople.com",
                  title: "Social Media Manager",
                          profileImageUrl: "https://i.pravatar.cc/150?img=14",
                  children: []
                },
                {
                  id: 15,
                  firstName: "Ryan",
                  lastName: "Smith",
                  email: "ryan.smith@proxapeople.com",
                  title: "Content Creator",
                          profileImageUrl: "https://i.pravatar.cc/150?img=15",
                  children: []
                }
              ]
            }
          ]
        },
        {
          id: 4,
          firstName: "Thomas",
          lastName: "Williams",
          email: "thomas.williams@proxapeople.com",
          title: "Chief Financial Officer",
          profileImageUrl: "https://i.pravatar.cc/150?img=4",
          children: [
            {
              id: 8,
              firstName: "Natalie",
              lastName: "Brown",
              email: "natalie.brown@proxapeople.com",
              title: "Finance Director",
                  profileImageUrl: "https://i.pravatar.cc/150?img=8",
              children: [
                {
                  id: 16,
                  firstName: "William",
                  lastName: "Lee",
                  email: "william.lee@proxapeople.com",
                  title: "Financial Analyst",
                          profileImageUrl: "https://i.pravatar.cc/150?img=16",
                  children: []
                },
                {
                  id: 17,
                  firstName: "Emma",
                  lastName: "Clark",
                  email: "emma.clark@proxapeople.com",
                  title: "Accountant",
                          profileImageUrl: "https://i.pravatar.cc/150?img=17",
                  children: []
                }
              ]
            }
          ]
        }
      ]
    }
  ];
};

const TreeNode: React.FC<{
  node: ExtendedUser;
  departments: Department[];
  layout: "vertical" | "horizontal";
  onToggle: (id: number) => void;
  expanded: boolean;
  level: number;
}> = ({ node, departments, layout, onToggle, expanded, level }) => {
  const hasChildren = node.children && node.children.length > 0;
  const department = departments.find(d => d.name === node.department);

  const getInitials = (firstName?: string, lastName?: string) => {
    return `${firstName?.[0] || ''}${lastName?.[0] || ''}`;
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        delay: level * 0.1
      }
    }
  };

  // Connector positions change based on layout
  const connectorClass = layout === "vertical" 
    ? "absolute top-full left-1/2 w-[2px] -ml-[1px] bg-border" 
    : "absolute left-full top-1/2 h-[2px] -mt-[1px] bg-border";

  const nodeContainerClass = layout === "vertical"
    ? "flex flex-col items-center justify-start gap-8 relative"
    : "flex flex-row items-start justify-start gap-8 relative";

  const childrenContainerClass = layout === "vertical"
    ? "flex flex-row items-start justify-center gap-6 pt-8"
    : "flex flex-col items-start justify-center gap-6 pl-8";

  return (
    <div className={nodeContainerClass}>
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="relative"
      >
        <Card className="w-64 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1 focus:ring-2 focus:ring-primary/40 outline-none" tabIndex={0}>
          <CardContent className="p-4 relative">
            {/* Expansion Handle - always visible for parent nodes */}
            {hasChildren && (
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 absolute -right-3 -top-3 bg-background shadow-sm border z-10"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggle(node.id);
                }}
              >
                {expanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            )}
            
            <div 
              className="flex flex-col items-center text-center"
              onClick={() => hasChildren && onToggle(node.id)}
            >
              <div className="relative mb-3">
                <Avatar className="h-24 w-24 border-2 border-primary/20 shadow-md hover:border-primary/40 transition-all">
                  <AvatarImage src={node.profileImageUrl} alt={`${node.firstName} ${node.lastName}`} />
                  <AvatarFallback className="bg-primary/10 text-primary text-lg">
                    {getInitials(node.firstName, node.lastName)}
                  </AvatarFallback>
                </Avatar>
                
                {department && (
                  <Badge 
                    variant="secondary" 
                    className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 text-xs px-2 py-0.5 shadow-sm"
                  >
                    {department.name}
                  </Badge>
                )}
              </div>
              
              <h3 className="font-semibold text-base mt-1">{node.firstName} {node.lastName}</h3>
              <p className="text-sm text-muted-foreground font-medium">{node.title}</p>
              
              <div className="flex flex-row gap-2 mt-4 justify-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8 rounded-full bg-background/50 hover:bg-primary/5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Mail className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>{node.email}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8 rounded-full bg-background/50 hover:bg-primary/5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Phone className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>+1 (555) 123-4567</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8 rounded-full bg-background/50 hover:bg-primary/5"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <Briefcase className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      <p>View profile</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              {hasChildren && (
                <div className="text-xs text-muted-foreground mt-3">
                  {expanded ? 'Click to collapse' : 'Click to expand'}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        {/* Connector lines to children */}
        {hasChildren && expanded && (
          <>
            {/* Vertical line down from parent (for vertical layout) or horizontal line to the right (for horizontal) */}
            <div 
              className={connectorClass}
              style={layout === "vertical" ? { height: "2rem" } : { width: "2rem" }}
            />
          </>
        )}
      </motion.div>
      
      {/* Children */}
      <AnimatePresence>
        {hasChildren && expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className={childrenContainerClass}
          >
            {node.children?.map(child => (
              <div key={child.id} className="relative">
                {/* Horizontal connector line (for vertical layout) or vertical line (for horizontal) */}
                {layout === "vertical" && (
                  <div className="absolute top-0 left-1/2 w-[2px] -ml-[1px] bg-border h-8 -mt-8" />
                )}
                {layout === "horizontal" && (
                  <div className="absolute left-0 top-1/2 h-[2px] -ml-8 bg-border w-8" />
                )}
                
                <TreeNode
                  node={child}
                  departments={departments}
                  layout={layout}
                  onToggle={onToggle}
                  expanded={!!child.isExpanded}
                  level={level + 1}
                />
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default function OrgChartTree({ users, departments, layout }: OrgChartTreeProps) {
  // Instead of processing real user data, we're using our sample hierarchy
  const hierarchy = useMemo(() => buildHierarchy(users), [users]);
  
  // State to track expanded nodes
  const [expandedNodes, setExpandedNodes] = useState<Record<number, boolean>>({
    1: true, // Start with root expanded
    2: true, // Also expand first level
    3: true,
    4: true
  });
  
  // Toggle node expansion
  const toggleNode = (id: number) => {
    setExpandedNodes(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  // Process hierarchy to include expansion state
  const processedHierarchy = useMemo(() => {
    const processNode = (node: ExtendedUser): ExtendedUser => {
      return {
        ...node,
        isExpanded: !!expandedNodes[node.id],
        children: node.children?.map(processNode)
      };
    };
    
    return hierarchy.map(processNode);
  }, [hierarchy, expandedNodes]);

  return (
    <div className="w-full h-full overflow-auto">
      <div className="flex items-center justify-center min-h-full">
        <div className={`py-10 px-6 ${layout === "vertical" ? "pt-20" : "pl-20"}`}>
          {processedHierarchy.map(rootNode => (
            <TreeNode
              key={rootNode.id}
              node={rootNode}
              departments={departments}
              layout={layout}
              onToggle={toggleNode}
              expanded={!!rootNode.isExpanded}
              level={0}
            />
          ))}
        </div>
      </div>
    </div>
  );
}