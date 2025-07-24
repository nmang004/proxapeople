import { User, Department } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight, Users, Building2, MousePointer } from "lucide-react";
import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface OrgChartTreeProps {
  users: User[];
  departments: Department[];
  layout: "vertical" | "horizontal";
}

interface TreeNode {
  user: User;
  children: TreeNode[];
  level: number;
  departmentGroup?: string;
}

// Department color mapping for visual distinction
const departmentColors: Record<string, string> = {
  'Executive': 'bg-purple-100 text-purple-800 border-purple-300',
  'Operations': 'bg-blue-100 text-blue-800 border-blue-300',
  'Shared Services': 'bg-green-100 text-green-800 border-green-300',
  'Sales': 'bg-orange-100 text-orange-800 border-orange-300',
  'Websites': 'bg-indigo-100 text-indigo-800 border-indigo-300',
  'Search': 'bg-pink-100 text-pink-800 border-pink-300',
  'Account Management': 'bg-yellow-100 text-yellow-800 border-yellow-300',
  'Content': 'bg-red-100 text-red-800 border-red-300',
  'Project Management': 'bg-teal-100 text-teal-800 border-teal-300',
};

export default function OrgChartTree({ users, departments, layout }: OrgChartTreeProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<number>>(new Set());
  const [selectedDepartment, setSelectedDepartment] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [hoveredUserId, setHoveredUserId] = useState<number | null>(null);
  const [focusedUserId, setFocusedUserId] = useState<number | null>(null);
  const [visibleNodes, setVisibleNodes] = useState<Set<number>>(new Set());
  const nodeRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);
  const intersectionObserver = useRef<IntersectionObserver | null>(null);
  
  // Build the organizational tree structure with levels
  const buildTree = useMemo(() => {
    const userMap = new Map<number, User>();
    const childrenMap = new Map<number, User[]>();
    
    // Create maps for easier lookup
    users.forEach(user => {
      userMap.set(user.id, user);
      childrenMap.set(user.id, []);
    });
    
    // Group users by their manager and sort by department
    users.forEach(user => {
      if (user.managerId && childrenMap.has(user.managerId)) {
        childrenMap.get(user.managerId)!.push(user);
      }
    });
    
    // Sort children by department and name
    childrenMap.forEach((children, managerId) => {
      children.sort((a, b) => {
        if (a.department !== b.department) {
          return a.department.localeCompare(b.department);
        }
        return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
      });
    });
    
    // Build tree recursively with levels
    const buildNode = (user: User, level: number = 0): TreeNode => ({
      user,
      children: (childrenMap.get(user.id) || []).map(child => buildNode(child, level + 1)),
      level,
      departmentGroup: user.department
    });
    
    // Find root users and sort them (Eric President first, then Erik CEO)
    const rootUsers = users
      .filter(user => !user.managerId || !userMap.has(user.managerId))
      .sort((a, b) => {
        if (a.jobTitle.includes('President')) return -1;
        if (b.jobTitle.includes('President')) return 1;
        return 0;
      });
    
    return rootUsers.map(user => buildNode(user, 0));
  }, [users]);
  
  const toggleNode = (nodeId: number) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };
  
  // Scroll to specific user in the org chart
  const scrollToUser = useCallback((userId: number, smooth: boolean = true) => {
    const element = nodeRefs.current.get(userId);
    if (element) {
      // First ensure the node is expanded if it has children
      const user = users.find(u => u.id === userId);
      if (user) {
        const hasChildren = users.some(u => u.managerId === userId);
        if (hasChildren && !expandedNodes.has(userId)) {
          setExpandedNodes(prev => new Set(Array.from(prev).concat(userId)));
          // Wait for expansion animation before scrolling
          setTimeout(() => {
            element.scrollIntoView({
              behavior: smooth ? 'smooth' : 'instant',
              block: 'center',
              inline: 'center'
            });
          }, 300);
        } else {
          element.scrollIntoView({
            behavior: smooth ? 'smooth' : 'instant',
            block: 'center',
            inline: 'center'
          });
        }
      }
      
      // Highlight the selected user
      setSelectedUserId(userId);
      setTimeout(() => setSelectedUserId(null), 2000); // Clear highlight after 2 seconds
    }
  }, [users, expandedNodes]);
  
  // Handle clicking on employee card
  const handleEmployeeClick = useCallback((user: User, hasChildren: boolean, event: React.MouseEvent) => {
    // Check for Ctrl/Cmd + Click for focus action
    if (event.ctrlKey || event.metaKey) {
      event.preventDefault();
      handleFocusOnNode(user.id);
      return;
    }
    
    if (hasChildren) {
      // If has children, expand/collapse and scroll to children
      toggleNode(user.id);
      setTimeout(() => {
        scrollToUser(user.id, true);
      }, 100);
    } else {
      // If no children, scroll to manager or highlight current
      if (user.managerId) {
        scrollToUser(user.managerId, true);
      } else {
        scrollToUser(user.id, true);
      }
    }
  }, [scrollToUser]);

  // Focus on a specific node (Ctrl+Click action)
  const handleFocusOnNode = useCallback((userId: number) => {
    setFocusedUserId(userId);
    
    // Center and zoom slightly on the focused node
    const element = nodeRefs.current.get(userId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      });
      
      // Expand children if they exist
      const user = users.find(u => u.id === userId);
      if (user) {
        const hasChildren = users.some(u => u.managerId === userId);
        if (hasChildren && !expandedNodes.has(userId)) {
          setExpandedNodes(prev => new Set(Array.from(prev).concat(userId)));
        }
      }
    }
    
    // Clear focus after 3 seconds
    setTimeout(() => setFocusedUserId(null), 3000);
  }, [users, expandedNodes]);

  // Handle expand/collapse button click
  const handleExpandToggle = useCallback((userId: number, event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    toggleNode(userId);
  }, []);

  // Mouse enter/leave handlers for hover effects
  const handleMouseEnter = useCallback((userId: number) => {
    setHoveredUserId(userId);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredUserId(null);
  }, []);

  // Virtualization: Setup intersection observer for performance
  useEffect(() => {
    if (!containerRef.current) return;

    // For large datasets (>50 nodes), enable virtualization
    if (users.length > 50) {
      intersectionObserver.current = new IntersectionObserver(
        (entries) => {
          const newVisibleNodes = new Set(visibleNodes);
          
          entries.forEach((entry) => {
            const userId = parseInt(entry.target.getAttribute('data-user-id') || '0');
            if (entry.isIntersecting) {
              newVisibleNodes.add(userId);
            } else {
              // Keep nodes in memory for a bit longer to prevent flickering
              setTimeout(() => {
                setVisibleNodes(prev => {
                  const updated = new Set(prev);
                  updated.delete(userId);
                  return updated;
                });
              }, 1000);
            }
          });
          
          setVisibleNodes(newVisibleNodes);
        },
        {
          root: containerRef.current,
          rootMargin: '50% 50% 50% 50%', // Load nodes before they're visible
          threshold: 0
        }
      );

      // Observe all existing nodes
      nodeRefs.current.forEach((node) => {
        if (intersectionObserver.current) {
          intersectionObserver.current.observe(node);
        }
      });
    } else {
      // For smaller datasets, show all nodes
      setVisibleNodes(new Set(users.map(u => u.id)));
    }

    return () => {
      if (intersectionObserver.current) {
        intersectionObserver.current.disconnect();
      }
    };
  }, [users.length, visibleNodes]);

  // Helper to check if a node should be rendered
  const shouldRenderNode = useCallback((userId: number) => {
    // Always render if dataset is small
    if (users.length <= 50) return true;
    
    // Always render root nodes and their direct children
    const user = users.find(u => u.id === userId);
    if (!user) return false;
    
    // Always render executives and their direct reports
    if (user.jobTitle.includes('President') || user.jobTitle.includes('CEO')) return true;
    if (user.managerId) {
      const manager = users.find(u => u.id === user.managerId);
      if (manager && (manager.jobTitle.includes('President') || manager.jobTitle.includes('CEO'))) {
        return true;
      }
    }
    
    // For other nodes, use intersection observer
    return visibleNodes.has(userId);
  }, [users, visibleNodes]);

  // Get role level for styling
  const getRoleLevel = (user: User): 'executive' | 'manager' | 'employee' => {
    if (user.jobTitle.includes('President') || user.jobTitle.includes('CEO')) return 'executive';
    if (user.jobTitle.includes('Manager') || user.jobTitle.includes('Dir.')) return 'manager';
    return 'employee';
  };
  
  // Render a single employee card with better styling
  const renderEmployeeCard = (node: TreeNode, hasChildren: boolean = false) => {
    const { user } = node;
    const roleLevel = getRoleLevel(user);
    const deptColor = departmentColors[user.department] || 'bg-gray-100 text-gray-800 border-gray-300';
    const isExpanded = expandedNodes.has(user.id);
    const isHighlighted = !selectedDepartment || selectedDepartment === user.department;
    const isSelected = selectedUserId === user.id;
    const isHovered = hoveredUserId === user.id;
    const isFocused = focusedUserId === user.id;
    
    const cardStyles = {
      executive: 'w-72 border-2 shadow-lg bg-gradient-to-br from-purple-50 to-white',
      manager: 'w-64 border-2 shadow-md bg-gradient-to-br from-blue-50 to-white',
      employee: 'w-56 border shadow-sm bg-white'
    };
    
    return (
      <div 
        ref={(el) => {
          if (el) nodeRefs.current.set(user.id, el);
        }}
        data-user-id={user.id}
        data-department={user.department}
        className={`relative transition-all duration-300 ${!isHighlighted ? 'opacity-40' : ''}`}
        onMouseEnter={() => handleMouseEnter(user.id)}
        onMouseLeave={handleMouseLeave}
      >
        <Card 
          role="treeitem"
          aria-expanded={hasChildren ? isExpanded : undefined}
          aria-level={node.level + 1}
          aria-label={`${user.firstName} ${user.lastName}, ${user.jobTitle}, ${user.department}${hasChildren ? `, manages ${node.children.length} direct reports` : ''}`}
          tabIndex={-1}
          className={`
            ${cardStyles[roleLevel]} 
            hover:shadow-xl transition-all cursor-pointer
            ${isSelected ? 'ring-4 ring-primary/50 ring-offset-2 shadow-2xl scale-105' : ''}
            ${isFocused ? 'ring-4 ring-blue-400/60 ring-offset-2 shadow-2xl scale-110 z-10' : ''}
            ${isHovered ? 'shadow-2xl scale-102 z-5' : ''}
            group relative
          `}
          onClick={(event) => handleEmployeeClick(user, hasChildren, event)}>
          
          {/* Click indicator */}
          <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="bg-primary text-white rounded-full p-1">
              <MousePointer className="h-3 w-3" />
            </div>
          </div>
          
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <Avatar className={`${roleLevel === 'executive' ? 'w-14 h-14' : 'w-12 h-12'}`}>
                {user.profileImage && (
                  <AvatarImage src={user.profileImage} alt={`${user.firstName} ${user.lastName}`} />
                )}
                <AvatarFallback className={`${roleLevel === 'executive' ? 'text-lg' : 'text-sm'} font-semibold`}>
                  {user.firstName[0]}{user.lastName[0]}
                </AvatarFallback>
              </Avatar>
              {hasChildren && (
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                </Button>
              )}
            </div>
            
            <div className="text-left">
              <h4 className={`font-semibold ${roleLevel === 'executive' ? 'text-base' : 'text-sm'} mb-1`}>
                {user.firstName} {user.lastName}
              </h4>
              <p className={`${roleLevel === 'executive' ? 'text-sm' : 'text-xs'} text-neutral-600 mb-2`}>
                {user.jobTitle}
              </p>
              <div className="flex items-center gap-2">
                <Badge className={`text-xs px-2 py-0.5 ${deptColor}`}>
                  {user.department}
                </Badge>
                {hasChildren && (
                  <span className="text-xs text-neutral-500 flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {node.children.length}
                  </span>
                )}
              </div>
            </div>
            
            {/* Interaction hint */}
            <div className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-60 transition-opacity">
              <span className="text-xs text-neutral-500">
                {hasChildren ? 'Click to expand/collapse' : 'Click to navigate'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  // Group children by department for better visualization
  const groupChildrenByDepartment = (children: TreeNode[]): Map<string, TreeNode[]> => {
    const groups = new Map<string, TreeNode[]>();
    children.forEach(child => {
      const dept = child.user.department;
      if (!groups.has(dept)) {
        groups.set(dept, []);
      }
      groups.get(dept)!.push(child);
    });
    return groups;
  };
  
  // Render tree node with better layout and virtualization
  const renderTreeNode = (node: TreeNode): JSX.Element => {
    const hasChildren = node.children.length > 0;
    const isExpanded = expandedNodes.has(node.user.id) || node.level === 0; // Always expand top level
    const departmentGroups = groupChildrenByDepartment(node.children);
    
    // Check if this node should be rendered (virtualization)
    const shouldRender = shouldRenderNode(node.user.id);
    
    return (
      <div key={node.user.id} className="relative">
        {/* Employee Card */}
        <div className="flex justify-center">
          {shouldRender ? (
            renderEmployeeCard(node, hasChildren)
          ) : (
            // Placeholder for non-visible nodes (virtualization)
            <div className="w-56 h-24 bg-gray-100 border border-gray-200 rounded-lg animate-pulse flex items-center justify-center">
              <div className="text-xs text-gray-400">Loading...</div>
            </div>
          )}
        </div>
        
        {/* Children - only render if expanded */}
        {hasChildren && isExpanded && (
          <div className="relative mt-4">
            {/* Vertical connector line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-8 bg-neutral-300 -top-0"></div>
            
            {/* Department Groups */}
            {departmentGroups.size === 1 ? (
              // Single department - simple layout
              <div className="relative pt-8">
                {node.children.length > 1 && (
                  <div className="absolute top-8 h-0.5 bg-neutral-300" 
                       style={{
                         left: node.children.length === 2 ? '25%' : '10%',
                         right: node.children.length === 2 ? '25%' : '10%'
                       }}>
                  </div>
                )}
                <div className={`flex justify-center gap-6 flex-wrap`}>
                  {node.children.map((child) => (
                    <div key={child.user.id} className="relative">
                      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-0.5 h-8 bg-neutral-300"></div>
                      {renderTreeNode(child)}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              // Multiple departments - group them visually
              <div className="relative pt-8 space-y-8">
                {Array.from(departmentGroups.entries()).map(([dept, deptChildren], idx) => (
                  <div key={dept} className="relative">
                    {/* Department label */}
                    <div className="text-center mb-4">
                      <Badge variant="outline" className="text-xs px-3 py-1">
                        <Building2 className="h-3 w-3 mr-1" />
                        {dept} ({deptChildren.length})
                      </Badge>
                    </div>
                    
                    {/* Department children */}
                    <div className="relative">
                      {deptChildren.length > 1 && (
                        <div className="absolute top-0 h-0.5 bg-neutral-300" 
                             style={{
                               left: deptChildren.length === 2 ? '25%' : '15%',
                               right: deptChildren.length === 2 ? '25%' : '15%'
                             }}>
                        </div>
                      )}
                      <div className="flex justify-center gap-4 flex-wrap">
                        {deptChildren.map((child) => (
                          <div key={child.user.id} className="relative">
                            <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-0.5 h-8 bg-neutral-300"></div>
                            {renderTreeNode(child)}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  const tree = buildTree;
  
  if (tree.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-neutral-500">No organizational data to display</p>
      </div>
    );
  }
  
  // Initialize expanded nodes for executives on first render
  if (expandedNodes.size === 0 && tree.length > 0) {
    const initialExpanded = new Set<number>();
    tree.forEach(node => {
      initialExpanded.add(node.user.id);
      // Also expand direct reports of executives
      node.children.forEach(child => {
        if (getRoleLevel(child.user) === 'manager') {
          initialExpanded.add(child.user.id);
        }
      });
    });
    setExpandedNodes(initialExpanded);
  }

  return (
    <div className="w-full h-full" role="tree" aria-label="Organization hierarchy">
      {/* Department Filter & Quick Navigation - Static UI outside canvas */}
      <div className="sticky top-0 z-10 bg-white border-b p-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Department Filter */}
          <div className="flex items-center gap-4 flex-wrap">
            <span className="text-sm font-medium">Filter by Department:</span>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={selectedDepartment === null ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedDepartment(null)}
              >
                All Departments
              </Button>
              {departments.map(dept => (
                <Button
                  key={dept.id}
                  variant={selectedDepartment === dept.name ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDepartment(dept.name)}
                  className={selectedDepartment === dept.name ? departmentColors[dept.name] : ''}
                >
                  {dept.name}
                </Button>
              ))}
            </div>
          </div>
          
          {/* Navigation Controls */}
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Quick Access:</span>
            <div className="flex gap-2">
              {/* Executive quick access */}
              {users.filter(u => getRoleLevel(u) === 'executive').map(exec => (
                <Button
                  key={exec.id}
                  variant="outline"
                  size="sm"
                  onClick={() => scrollToUser(exec.id)}
                  className="text-xs"
                >
                  {exec.firstName}
                </Button>
              ))}
              {/* Department managers quick access */}
              {users.filter(u => getRoleLevel(u) === 'manager' && u.jobTitle.includes('Manager')).slice(0, 2).map(manager => (
                <Button
                  key={manager.id}
                  variant="outline"
                  size="sm"
                  onClick={() => scrollToUser(manager.id)}
                  className="text-xs"
                >
                  {manager.firstName}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Chart Content - Only this gets transformed by parent */}
      <div className="flex-1 bg-neutral-50/30 overflow-hidden">
        {/* Company Structure */}
        <div className="text-center pt-8 pb-4">
          <h2 className="text-2xl font-bold text-neutral-800 mb-2">Rival Digital</h2>
          <p className="text-neutral-600">Organizational Structure</p>
        </div>
        
        {/* Render trees side by side for multiple roots */}
        <div className={`flex ${layout === 'horizontal' ? 'flex-row' : 'flex-col'} gap-16 justify-center items-start pb-8`}>
          {tree.map((rootNode) => (
            <div key={rootNode.user.id} className="flex-shrink-0">
              {renderTreeNode(rootNode)}
            </div>
          ))}
        </div>
      </div>
      
      {/* Legend - Static UI outside canvas */}
      <div className="absolute bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border max-w-xs pointer-events-auto">
        <h4 className="text-sm font-semibold mb-2">Legend</h4>
        <div className="space-y-2">
          {/* Role Levels */}
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-br from-purple-50 to-white border-2 border-purple-300 rounded"></div>
              <span>Executive</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gradient-to-br from-blue-50 to-white border-2 border-blue-300 rounded"></div>
              <span>Manager</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
              <span>Employee</span>
            </div>
          </div>
          
          {/* Interaction Guide */}
          <div className="border-t pt-2">
            <h5 className="text-xs font-semibold mb-1">Navigation:</h5>
            <div className="space-y-1 text-xs text-neutral-600">
              <div className="flex items-center gap-2">
                <MousePointer className="h-3 w-3" />
                <span>Use sidebar zoom controls</span>
              </div>
              <div className="flex items-center gap-2">
                <ChevronDown className="h-3 w-3" />
                <span>Click managers to expand</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}