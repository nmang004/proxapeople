import { useState, useEffect } from "react";
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
import { Loader2, Search, Filter, Download, Printer, ZoomIn, ZoomOut, PanelLeft, Settings2, Share2, X, ArrowDown, ArrowRight, Minus, Plus, GitGraph, ListOrdered } from "lucide-react";
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

  // Handle zoom in/out
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 10, 150));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 10, 50));
  };

  // Print org chart
  const handlePrint = () => {
    window.print();
  };

  // Download org chart as PNG
  const handleDownload = () => {
    // Implementation for downloading chart
    const element = document.getElementById('org-chart-container');
    if (element) {
      // Conversion to image and download logic would go here
      // For now, we'll just show an alert
      alert("Download functionality would capture the current org chart view as an image");
    }
  };

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
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                {/* Department Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Department</label>
                  <Select 
                    value={filterDepartment} 
                    onValueChange={setFilterDepartment}
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
                      onValueChange={setFilterDepartment}
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
                    <div
                      id="org-chart-container"
                      className="h-full overflow-auto bg-muted/10 border rounded-lg" 
                      style={{ 
                        transform: `scale(${zoomLevel / 100})`,
                        transformOrigin: 'top center',
                        padding: '32px'
                      }}
                    >
                      <OrgChartTree 
                        users={filteredUsers} 
                        departments={departments}
                        layout={chartLayout}
                      />
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