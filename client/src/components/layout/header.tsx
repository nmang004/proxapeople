import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

export function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  
  return (
    <div className="relative z-10 flex-shrink-0 flex h-16 bg-white border-b border-neutral-200">
      <button 
        type="button" 
        className="md:hidden px-4 border-r border-neutral-200 text-neutral-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
        aria-label="Open sidebar"
      >
        <i className="ri-menu-line text-xl"></i>
      </button>
      
      {/* Search Bar */}
      <div className="flex-1 flex justify-between px-4 md:px-6">
        <div className="flex-1 flex items-center">
          <div className="w-full max-w-lg lg:max-w-xs">
            <label htmlFor="search" className="sr-only">Search</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="ri-search-line text-neutral-500"></i>
              </div>
              <Input 
                id="search" 
                className="block w-full pl-10 pr-3 py-2"
                placeholder="Search" 
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
        
        {/* Right Nav Elements */}
        <div className="ml-4 flex items-center md:ml-6 space-x-4">
          {/* Notifications Button */}
          <button className="p-1 rounded-full text-neutral-500 hover:text-neutral-800 relative">
            <i className="ri-notification-3-line text-xl"></i>
            <span className="absolute -top-1 -right-1 h-4 w-4 bg-danger rounded-full flex items-center justify-center text-xs text-white">3</span>
          </button>
          
          {/* Profile Dropdown */}
          <div className="ml-3 relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button 
                  type="button" 
                  className="flex items-center max-w-xs text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=32&h=32" alt="Profile photo" />
                    <AvatarFallback>AJ</AvatarFallback>
                  </Avatar>
                  <span className="ml-2 hidden md:block">Ashley Johnson</span>
                  <i className="ri-arrow-down-s-line ml-1 hidden md:block"></i>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <i className="ri-user-line mr-2"></i>
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <i className="ri-settings-line mr-2"></i>
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <i className="ri-logout-box-line mr-2"></i>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
