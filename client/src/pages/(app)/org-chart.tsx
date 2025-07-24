import { useState, useEffect, useCallback } from "react";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Search, Filter, Download, Printer, ZoomIn, ZoomOut, PanelLeft, Settings2, Share2, X, ArrowDown, ArrowRight, Minus, Plus, GitGraph, ListOrdered, RotateCcw, Maximize2, Move } from "lucide-react";
import { motion } from "framer-motion";
import OrgChartTree from "@/components/org-chart/org-chart-tree";
import OrgChartList from "@/components/org-chart/org-chart-list";
import OrgChartSettings from "@/components/org-chart/org-chart-settings";
import { User, Department } from "@shared/schema";

export default function OrgChart() {
  const [view, setView] = useState<"tree" | "list">("tree");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState<string>("all");
  const [showSidebar, setShowSidebar] = useState(window.innerWidth >= 768);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [showSettings, setShowSettings] = useState(false);
  const [chartLayout, setChartLayout] = useState<"vertical" | "horizontal">("vertical");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [panPosition, setPanPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  const [transformOrigin, setTransformOrigin] = useState({ x: 50, y: 50 }); // Transform origin as percentage
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedSearchIndex, setSelectedSearchIndex] = useState(-1);
  const [touchStartPos, setTouchStartPos] = useState({ x: 0, y: 0 });
  const [isPinching, setIsPinching] = useState(false);
  const [focusedNodeIndex, setFocusedNodeIndex] = useState(-1);
  const [keyboardNavMode, setKeyboardNavMode] = useState(false);
  
  // Monitor window resize
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (showSidebar && mobile) {
        setShowSidebar(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [showSidebar]);

  // Fetch users and departments data
  const { data: usersData, isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
    retry: false,
  });

  const { data: departmentsData, isLoading: departmentsLoading } = useQuery<Department[]>({
    queryKey: ["/api/departments"],
    retry: false,
  });

  // Ensure data is always arrays
  const users = Array.isArray(usersData) ? usersData : [];
  const departments = Array.isArray(departmentsData) ? departmentsData : [];

  const isLoading = usersLoading || departmentsLoading;

  // Filter users based on search term and department filter
  const filteredUsers = users.filter((user: User) => {
    const matchesSearch = searchTerm === "" || 
      (user.firstName && user.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.lastName && user.lastName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (user.jobTitle && user.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesDepartment = filterDepartment === "all" || user.department === filterDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  // Generate search results for autocomplete
  const generateSearchResults = useCallback((term: string) => {
    if (term.length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    const results = users.filter((user: User) => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      const lowerTerm = term.toLowerCase();
      return fullName.includes(lowerTerm) ||
             user.email?.toLowerCase().includes(lowerTerm) ||
             user.jobTitle?.toLowerCase().includes(lowerTerm) ||
             user.department?.toLowerCase().includes(lowerTerm);
    }).slice(0, 8); // Limit to 8 results

    setSearchResults(results);
    setShowSearchResults(results.length > 0);
  }, [users]);

  // Handle search input changes
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    generateSearchResults(value);
    setSelectedSearchIndex(-1);
  }, [generateSearchResults]);

  // Focus on a specific user from search results
  const focusOnUser = useCallback((user: User) => {
    // Find the user's element in the DOM and scroll to it
    const userId = user.id;
    
    // First, clear any filters that might hide this user
    if (filterDepartment !== "all" && filterDepartment !== user.department) {
      setFilterDepartment("all");
    }
    
    // Animate to the user with a smooth transition
    setTimeout(() => {
      const userElement = document.querySelector(`[data-user-id="${userId}"]`);
      if (userElement) {
        userElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center'
        });
        
        // Add a temporary highlight effect
        userElement.classList.add('ring-4', 'ring-blue-400', 'ring-offset-2');
        setTimeout(() => {
          userElement.classList.remove('ring-4', 'ring-blue-400', 'ring-offset-2');
        }, 2000);
      }
    }, 100);
    
    // Clear search
    setSearchTerm('');
    setShowSearchResults(false);
    setSelectedSearchIndex(-1);
  }, [filterDepartment]);

  // Handle keyboard navigation in search results
  const handleSearchKeyDown = useCallback((event: React.KeyboardEvent) => {
    if (!showSearchResults || searchResults.length === 0) return;
    
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setSelectedSearchIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        event.preventDefault();
        setSelectedSearchIndex(prev => 
          prev > 0 ? prev - 1 : searchResults.length - 1
        );
        break;
      case 'Enter':
        event.preventDefault();
        if (selectedSearchIndex >= 0 && selectedSearchIndex < searchResults.length) {
          focusOnUser(searchResults[selectedSearchIndex]);
        }
        break;
      case 'Escape':
        setShowSearchResults(false);
        setSelectedSearchIndex(-1);
        break;
    }
  }, [showSearchResults, searchResults, selectedSearchIndex, focusOnUser]);

  // Enhanced department filter with animation
  const handleDepartmentFilter = useCallback((deptId: string) => {
    setFilterDepartment(deptId);
    
    // If filtering to a specific department, animate the view to show that department
    if (deptId !== "all") {
      setTimeout(() => {
        const deptElements = document.querySelectorAll(`[data-department="${deptId}"]`);
        if (deptElements.length > 0) {
          deptElements[0].scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
          });
        }
      }, 300);
    }
  }, []);

  // Handle zoom in/out
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 10, 150));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 10, 50));
  };

  // Zoom to cursor position
  const handleZoomAtCursor = useCallback((delta: number, clientX: number, clientY: number, containerRect: DOMRect) => {
    const newZoomLevel = Math.max(50, Math.min(150, zoomLevel + delta));
    
    if (newZoomLevel !== zoomLevel) {
      // Calculate cursor position relative to container
      const cursorX = ((clientX - containerRect.left) / containerRect.width) * 100;
      const cursorY = ((clientY - containerRect.top) / containerRect.height) * 100;
      
      // Update transform origin to cursor position
      setTransformOrigin({ x: cursorX, y: cursorY });
      setZoomLevel(newZoomLevel);
    }
  }, [zoomLevel]);

  // Mouse wheel zoom handler
  const handleWheel = useCallback((event: WheelEvent) => {
    // Only zoom when Ctrl/Cmd is pressed to avoid hijacking page scroll
    if (event.ctrlKey || event.metaKey) {
      event.preventDefault();
      
      const container = document.getElementById('org-chart-viewport');
      if (container) {
        const rect = container.getBoundingClientRect();
        const delta = event.deltaY > 0 ? -10 : 10; // Invert for natural scroll direction
        handleZoomAtCursor(delta, event.clientX, event.clientY, rect);
      }
    }
  }, [handleZoomAtCursor]);

  // Add wheel event listener
  useEffect(() => {
    const container = document.getElementById('org-chart-viewport');
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
      return () => container.removeEventListener('wheel', handleWheel);
    }
  }, [handleWheel]);

  // Print org chart
  const handlePrint = () => {
    window.print();
  };

  // Download org chart as PNG
  const handleDownload = () => {
    // Implementation for downloading chart
    const element = document.getElementById('org-chart-canvas');
    if (element) {
      // Conversion to image and download logic would go here
      // For now, we'll just show an alert
      alert("Download functionality would capture the current org chart view as an image");
    }
  };

  // Reset zoom and pan to center
  const handleResetView = () => {
    setZoomLevel(100);
    setPanPosition({ x: 0, y: 0 });
    setTransformOrigin({ x: 50, y: 50 }); // Reset to center
  };

  // Zoom to fit the entire chart
  const handleZoomToFit = () => {
    // This would calculate the optimal zoom level to fit all content
    // For now, we'll set it to a reasonable default
    setZoomLevel(80);
    setPanPosition({ x: 0, y: 0 });
    setTransformOrigin({ x: 50, y: 50 }); // Reset to center
  };

  // Pan handlers for mouse interaction
  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    if (event.button !== 0) return; // Only left mouse button
    const target = event.target as HTMLElement;
    if (target.closest('button, .card, [role="button"], a')) return;
    
    setIsDragging(false);
    setLastPanPoint({ x: event.clientX, y: event.clientY });
    event.preventDefault();
  }, []);

  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (event.buttons !== 1) return;
    
    const deltaX = event.clientX - lastPanPoint.x;
    const deltaY = event.clientY - lastPanPoint.y;
    
    if (!isDragging && (Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5)) {
      setIsDragging(true);
    }
    
    if (isDragging || Math.abs(deltaX) > 5 || Math.abs(deltaY) > 5) {
      setPanPosition(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      setLastPanPoint({ x: event.clientX, y: event.clientY });
      event.preventDefault();
    }
  }, [lastPanPoint, isDragging]);

  const handleMouseUp = useCallback(() => {
    setTimeout(() => setIsDragging(false), 50);
  }, []);

  // Enhanced touch handlers for mobile with pinch-to-zoom
  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    const touches = event.touches;
    
    if (touches.length === 1) {
      // Single touch - panning
      const touch = touches[0];
      setLastPanPoint({ x: touch.clientX, y: touch.clientY });
      setTouchStartPos({ x: touch.clientX, y: touch.clientY });
      setIsDragging(false);
      setIsPinching(false);
    } else if (touches.length === 2) {
      // Two touches - pinch to zoom
      setIsPinching(true);
      setIsDragging(false);
      
      // Calculate initial distance for pinch zoom
      const touch1 = touches[0];
      const touch2 = touches[1];
      const distance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) + 
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      
      // Store initial distance and center point
      setTouchStartPos({ 
        x: distance, 
        y: (touch1.clientX + touch2.clientX) / 2 // Center X
      });
      
      // Set transform origin to pinch center
      const container = document.getElementById('org-chart-viewport');
      if (container) {
        const rect = container.getBoundingClientRect();
        const centerX = ((touch1.clientX + touch2.clientX) / 2 - rect.left) / rect.width * 100;
        const centerY = ((touch1.clientY + touch2.clientY) / 2 - rect.top) / rect.height * 100;
        setTransformOrigin({ x: centerX, y: centerY });
      }
    }
  }, []);

  const handleTouchMove = useCallback((event: React.TouchEvent) => {
    const touches = event.touches;
    
    if (touches.length === 1 && !isPinching) {
      // Single touch panning
      const touch = touches[0];
      const deltaX = touch.clientX - lastPanPoint.x;
      const deltaY = touch.clientY - lastPanPoint.y;
      
      // Only start dragging if moved enough from initial touch
      const totalMoveX = Math.abs(touch.clientX - touchStartPos.x);
      const totalMoveY = Math.abs(touch.clientY - touchStartPos.y);
      
      if (!isDragging && (totalMoveX > 10 || totalMoveY > 10)) {
        setIsDragging(true);
      }
      
      if (isDragging) {
        setPanPosition(prev => ({
          x: prev.x + deltaX,
          y: prev.y + deltaY
        }));
        setLastPanPoint({ x: touch.clientX, y: touch.clientY });
        event.preventDefault();
      }
    } else if (touches.length === 2 && isPinching) {
      // Pinch to zoom
      event.preventDefault();
      
      const touch1 = touches[0];
      const touch2 = touches[1];
      const currentDistance = Math.sqrt(
        Math.pow(touch2.clientX - touch1.clientX, 2) + 
        Math.pow(touch2.clientY - touch1.clientY, 2)
      );
      
      const initialDistance = touchStartPos.x;
      const scale = currentDistance / initialDistance;
      const newZoomLevel = Math.max(50, Math.min(150, zoomLevel * scale));
      
      // Only update if change is significant enough
      if (Math.abs(newZoomLevel - zoomLevel) > 2) {
        setZoomLevel(newZoomLevel);
        setTouchStartPos(prev => ({ ...prev, x: currentDistance }));
      }
    }
  }, [lastPanPoint, isDragging, isPinching, touchStartPos, zoomLevel]);

  const handleTouchEnd = useCallback((event: React.TouchEvent) => {
    if (event.touches.length === 0) {
      // All touches ended
      setTimeout(() => {
        setIsDragging(false);
        setIsPinching(false);
      }, 50);
    } else if (event.touches.length === 1 && isPinching) {
      // Went from two touches to one - continue with panning
      const touch = event.touches[0];
      setLastPanPoint({ x: touch.clientX, y: touch.clientY });
      setTouchStartPos({ x: touch.clientX, y: touch.clientY });
      setIsPinching(false);
    }
  }, [isPinching]);

  // Keyboard navigation for accessibility
  const handleGlobalKeyDown = useCallback((event: KeyboardEvent) => {
    // Only handle keyboard navigation when not in an input field
    if (event.target instanceof HTMLInputElement || event.target instanceof HTMLSelectElement) {
      return;
    }

    switch (event.key) {
      case 'Tab':
        // Enable keyboard navigation mode
        if (!keyboardNavMode) {
          setKeyboardNavMode(true);
          setFocusedNodeIndex(0);
        }
        break;
      case 'ArrowRight':
      case 'ArrowDown':
        if (keyboardNavMode) {
          event.preventDefault();
          setFocusedNodeIndex(prev => 
            prev < filteredUsers.length - 1 ? prev + 1 : 0
          );
        }
        break;
      case 'ArrowLeft':
      case 'ArrowUp':
        if (keyboardNavMode) {
          event.preventDefault();
          setFocusedNodeIndex(prev => 
            prev > 0 ? prev - 1 : filteredUsers.length - 1
          );
        }
        break;
      case 'Enter':
      case ' ':
        if (keyboardNavMode && focusedNodeIndex >= 0) {
          event.preventDefault();
          const focusedUser = filteredUsers[focusedNodeIndex];
          if (focusedUser) {
            focusOnUser(focusedUser);
          }
        }
        break;
      case 'Escape':
        setKeyboardNavMode(false);
        setFocusedNodeIndex(-1);
        break;
      case '+':
      case '=':
        if (keyboardNavMode) {
          event.preventDefault();
          handleZoomIn();
        }
        break;
      case '-':
      case '_':
        if (keyboardNavMode) {
          event.preventDefault();
          handleZoomOut();
        }
        break;
      case '0':
        if (keyboardNavMode) {
          event.preventDefault();
          handleResetView();
        }
        break;
    }
  }, [keyboardNavMode, focusedNodeIndex, filteredUsers, focusOnUser, handleZoomIn, handleZoomOut, handleResetView]);

  // Add keyboard event listener
  useEffect(() => {
    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [handleGlobalKeyDown]);

  // Scroll to focused node when keyboard navigation changes
  useEffect(() => {
    if (keyboardNavMode && focusedNodeIndex >= 0 && focusedNodeIndex < filteredUsers.length) {
      const focusedUser = filteredUsers[focusedNodeIndex];
      if (focusedUser) {
        const userElement = document.querySelector(`[data-user-id="${focusedUser.id}"]`);
        if (userElement) {
          userElement.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
            inline: 'center'
          });
        }
      }
    }
  }, [keyboardNavMode, focusedNodeIndex, filteredUsers]);

  return (
    <>
      <Helmet>
        <title>Organization Chart - Proxa People</title>
        <meta 
          name="description" 
          content="View and manage your organization's structure, reporting lines, and team hierarchies with Proxa People's interactive organization chart." 
        />
      </Helmet>

      <div className="flex flex-col h-full">
        <div className="flex flex-col md:flex-row md:items-center justify-between p-4 md:p-6 bg-background border-b space-y-3 md:space-y-0">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Organization Chart</h1>
            <p className="text-muted-foreground mt-1 text-sm md:text-base">
              Visualize your organization's structure and reporting lines
            </p>
          </div>
          <div className="flex items-center flex-wrap gap-2 justify-end">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowSidebar(!showSidebar)}
              className="flex md:hidden"
            >
              <PanelLeft className="h-4 w-4 mr-2" />
              Filter
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowSidebar(!showSidebar)}
              className="hidden md:flex"
            >
              <PanelLeft className="h-4 w-4 mr-2" />
              {showSidebar ? "Hide" : "Show"} Sidebar
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowSettings(!showSettings)}
              className={isMobile ? "w-10 p-0" : ""}
            >
              <Settings2 className={`h-4 w-4 ${!isMobile && "mr-2"}`} />
              {!isMobile && "Chart Settings"}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handlePrint}
              className={isMobile ? "w-10 p-0" : ""}
            >
              <Printer className={`h-4 w-4 ${!isMobile && "mr-2"}`} />
              {!isMobile && "Print"}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleDownload}
              className={isMobile ? "w-10 p-0" : ""}
            >
              <Download className={`h-4 w-4 ${!isMobile && "mr-2"}`} />
              {!isMobile && "Export"}
            </Button>
            <Button 
              variant={isMobile ? "outline" : "default"} 
              size="sm"
              className={isMobile ? "w-10 p-0" : ""}
            >
              <Share2 className={`h-4 w-4 ${!isMobile && "mr-2"}`} />
              {!isMobile && "Share"}
            </Button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Desktop Sidebar */}
          {showSidebar && !isMobile && (
            <div className="w-72 bg-muted/40 p-4 border-r overflow-y-auto">
              <div className="space-y-4">
                {/* Search */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Search</label>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Search by name, title, etc."
                      className="pl-8"
                      value={searchTerm}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      onKeyDown={handleSearchKeyDown}
                      onFocus={() => generateSearchResults(searchTerm)}
                      onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                    />
                    
                    {/* Search Results Dropdown */}
                    {showSearchResults && searchResults.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto">
                        {searchResults.map((user, index) => (
                          <div
                            key={user.id}
                            className={`p-3 cursor-pointer border-b last:border-b-0 transition-colors ${
                              index === selectedSearchIndex ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                            }`}
                            onClick={() => focusOnUser(user)}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-semibold">
                                {user.firstName[0]}{user.lastName[0]}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="font-medium text-sm truncate">
                                  {user.firstName} {user.lastName}
                                </div>
                                <div className="text-xs text-gray-500 truncate">
                                  {user.jobTitle} • {user.department}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Department Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Department</label>
                  <Select 
                    value={filterDepartment} 
                    onValueChange={handleDepartmentFilter}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Departments" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {!departmentsLoading && departments.map((dept: Department) => (
                        <SelectItem key={dept.id} value={dept.id.toString()}>{dept.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                {/* View Options */}
                <div>
                  <label className="text-sm font-medium mb-2 block">View</label>
                  <Tabs value={view} onValueChange={(v) => setView(v as "tree" | "list")} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="tree">Tree View</TabsTrigger>
                      <TabsTrigger value="list">List View</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {/* Zoom Controls (only for tree view) */}
                {view === "tree" && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Zoom: {zoomLevel}%</label>
                    <div className="flex items-center gap-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleZoomOut}
                        disabled={zoomLevel <= 50}
                      >
                        <ZoomOut className="h-4 w-4" />
                      </Button>
                      <div className="flex-1 bg-secondary h-2 rounded-full overflow-hidden">
                        <div 
                          className="bg-primary h-full" 
                          style={{ width: `${((zoomLevel - 50) / 100) * 100}%` }}
                        />
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleZoomIn}
                        disabled={zoomLevel >= 150}
                      >
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    {/* View Control Utilities */}
                    <div className="flex items-center gap-2 mt-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleZoomToFit}
                        className="flex-1"
                      >
                        <Maximize2 className="h-3 w-3 mr-1" />
                        Fit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={handleResetView}
                        className="flex-1"
                      >
                        <RotateCcw className="h-3 w-3 mr-1" />
                        Reset
                      </Button>
                    </div>
                  </div>
                )}

                {view === "tree" && (
                  <div>
                    <label className="text-sm font-medium mb-2 block">Layout</label>
                    <Tabs value={chartLayout} onValueChange={(v) => setChartLayout(v as "vertical" | "horizontal")} className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="vertical">Vertical</TabsTrigger>
                        <TabsTrigger value="horizontal">Horizontal</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>
                )}

                <Separator />

                {/* People Stats */}
                <div className="space-y-3">
                  <h3 className="text-sm font-medium">Organization Statistics</h3>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Card>
                      <CardContent className="p-3">
                        <div className="text-xs text-muted-foreground">Total Employees</div>
                        <div className="text-xl font-semibold">
                          {isLoading ? <Skeleton className="h-6 w-12" /> : users.length}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-3">
                        <div className="text-xs text-muted-foreground">Departments</div>
                        <div className="text-xl font-semibold">
                          {isLoading ? <Skeleton className="h-6 w-12" /> : departments.length}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-3">
                        <div className="text-xs text-muted-foreground">Direct Reports</div>
                        <div className="text-xl font-semibold">
                          {isLoading ? <Skeleton className="h-6 w-12" /> : "12"}
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="p-3">
                        <div className="text-xs text-muted-foreground">Managers</div>
                        <div className="text-xl font-semibold">
                          {isLoading ? <Skeleton className="h-6 w-12" /> : "8"}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Mobile Sidebar - Full Screen Overlay */}
          {showSidebar && isMobile && (
            <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-start">
              <div className="w-full max-w-[85vw] h-full bg-background shadow-lg overflow-y-auto animate-in slide-in-from-left">
                <div className="flex items-center justify-between border-b p-4">
                  <h3 className="font-semibold text-lg">Filters & Options</h3>
                  <Button variant="ghost" size="icon" onClick={() => setShowSidebar(false)}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                
                <div className="p-4 space-y-5">
                  {/* Search */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Search</label>
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input 
                        placeholder="Search by name, title, etc."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Department Filter */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">Department</label>
                    <Select 
                      value={filterDepartment} 
                      onValueChange={handleDepartmentFilter}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Departments" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Departments</SelectItem>
                        {!departmentsLoading && departments.map((dept: Department) => (
                          <SelectItem key={dept.id} value={dept.id.toString()}>{dept.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Separator />

                  {/* View Options */}
                  <div>
                    <label className="text-sm font-medium mb-2 block">View</label>
                    <Tabs value={view} onValueChange={(v) => setView(v as "tree" | "list")} className="w-full">
                      <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="tree">Tree View</TabsTrigger>
                        <TabsTrigger value="list">List View</TabsTrigger>
                      </TabsList>
                    </Tabs>
                  </div>

                  {/* Zoom Controls (only for tree view) */}
                  {view === "tree" && (
                    <div>
                      <label className="text-sm font-medium mb-2 block">Zoom: {zoomLevel}%</label>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleZoomOut}
                          disabled={zoomLevel <= 50}
                        >
                          <ZoomOut className="h-4 w-4" />
                        </Button>
                        <div className="flex-1 bg-secondary h-2 rounded-full overflow-hidden">
                          <div 
                            className="bg-primary h-full" 
                            style={{ width: `${((zoomLevel - 50) / 100) * 100}%` }}
                          />
                        </div>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleZoomIn}
                          disabled={zoomLevel >= 150}
                        >
                          <ZoomIn className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {/* View Control Utilities */}
                      <div className="flex items-center gap-2 mt-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleZoomToFit}
                          className="flex-1"
                        >
                          <Maximize2 className="h-3 w-3 mr-1" />
                          Fit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={handleResetView}
                          className="flex-1"
                        >
                          <RotateCcw className="h-3 w-3 mr-1" />
                          Reset
                        </Button>
                      </div>
                    </div>
                  )}

                  {view === "tree" && (
                    <div>
                      <label className="text-sm font-medium mb-2 block">Layout</label>
                      <Tabs value={chartLayout} onValueChange={(v) => setChartLayout(v as "vertical" | "horizontal")} className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="vertical">Vertical</TabsTrigger>
                          <TabsTrigger value="horizontal">Horizontal</TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>
                  )}

                  <Separator />

                  {/* People Stats */}
                  <div className="space-y-3">
                    <h3 className="text-sm font-medium">Organization Statistics</h3>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <Card>
                        <CardContent className="p-3">
                          <div className="text-xs text-muted-foreground">Total Employees</div>
                          <div className="text-xl font-semibold">
                            {isLoading ? <Skeleton className="h-6 w-12" /> : users.length}
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-3">
                          <div className="text-xs text-muted-foreground">Departments</div>
                          <div className="text-xl font-semibold">
                            {isLoading ? <Skeleton className="h-6 w-12" /> : departments.length}
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-3">
                          <div className="text-xs text-muted-foreground">Direct Reports</div>
                          <div className="text-xl font-semibold">
                            {isLoading ? <Skeleton className="h-6 w-12" /> : "12"}
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardContent className="p-3">
                          <div className="text-xs text-muted-foreground">Managers</div>
                          <div className="text-xl font-semibold">
                            {isLoading ? <Skeleton className="h-6 w-12" /> : "8"}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border-t sticky bottom-0 bg-background">
                  <Button onClick={() => setShowSidebar(false)} className="w-full">
                    Apply & Close
                  </Button>
                </div>
              </div>
              
              <div 
                className="flex-1 h-full" 
                onClick={() => setShowSidebar(false)}
              ></div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 overflow-auto p-6" style={{padding: view === "tree" ? '0' : '24px'}}>
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2">Loading organization data...</span>
              </div>
            ) : (
              <>
                <Tabs value={view} className="w-full h-full">
                  <TabsContent value="tree" className="mt-0 h-full">
                    {/* Viewport Container - Fixed size, handles overflow */}
                    <div 
                      id="org-chart-viewport"
                      role="application"
                      aria-label="Interactive organization chart"
                      aria-describedby="org-chart-instructions"
                      tabIndex={0}
                      className={`h-full bg-muted/10 border rounded-lg overflow-hidden relative ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} ${keyboardNavMode ? 'ring-2 ring-blue-500' : ''}`}
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseUp}
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={handleTouchEnd}
                    >
                      {/* Pan Instructions */}
                      <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-sm border pointer-events-none">
                        <div className="flex items-center gap-2 text-sm text-neutral-600">
                          <Move className="h-4 w-4" />
                          <span className="hidden md:inline">Drag to pan • Ctrl+Scroll to zoom • Click cards to interact</span>
                          <span className="md:hidden">Drag to pan • Pinch to zoom • Tap cards to interact</span>
                        </div>
                        {keyboardNavMode && (
                          <div className="text-xs text-blue-600 mt-1 font-medium">
                            Keyboard mode: Arrow keys to navigate • Enter to select • +/- to zoom • Esc to exit
                          </div>
                        )}
                      </div>
                      
                      {/* Screen Reader Instructions */}
                      <div id="org-chart-instructions" className="sr-only">
                        Interactive organization chart showing company hierarchy. 
                        Use Tab to enter keyboard navigation mode, then arrow keys to move between employees. 
                        Press Enter or Space to focus on an employee. Use + and - keys to zoom in and out. 
                        Press Escape to exit keyboard navigation mode.
                      </div>
                      
                      {/* Chart Canvas - Only this element gets zoom/pan transforms */}
                      <div
                        id="org-chart-canvas"
                        className="w-full h-full origin-center transition-transform duration-100"
                        style={{ 
                          transform: `scale(${zoomLevel / 100}) translate(${panPosition.x}px, ${panPosition.y}px)`,
                          transformOrigin: `${transformOrigin.x}% ${transformOrigin.y}%`
                        }}
                      >
                        <div className="p-8 min-w-full min-h-full">
                          <OrgChartTree 
                            users={filteredUsers} 
                            departments={departments}
                            layout={chartLayout}
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="list" className="mt-0">
                    <OrgChartList 
                      users={filteredUsers} 
                      departments={departments}
                    />
                  </TabsContent>
                </Tabs>
              </>
            )}
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <OrgChartSettings 
              onClose={() => setShowSettings(false)}
              chartLayout={chartLayout}
              setChartLayout={setChartLayout}
            />
          )}
        </div>
      </div>
    </>
  );
}