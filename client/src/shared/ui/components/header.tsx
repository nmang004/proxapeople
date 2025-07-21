import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { AnimatedButton } from "@/components/ui/animated-button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAuth } from "@/app/store/auth0-store";

interface HeaderProps {
  onOpenMobileSidebar: () => void;
}

export function Header({ onOpenMobileSidebar }: HeaderProps) {
  const { user, logout } = useAuth();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, title: "New review request", time: "5m ago" },
    { id: 2, title: "1:1 meeting reminder", time: "1h ago" },
    { id: 3, title: "Goal update from Sarah", time: "2h ago" }
  ]);
  
  return (
    <div className="relative z-10 flex-shrink-0 flex h-16 bg-white border-b border-neutral-200">
      <AnimatedButton 
        type="button" 
        variant="ghost"
        className="md:hidden px-4 border-r border-neutral-200 text-neutral-500 hover:bg-secondary/30 h-16 flex items-center justify-center"
        aria-label="Open sidebar"
        onClick={onOpenMobileSidebar}
      >
        <i className="ri-menu-line text-xl"></i>
      </AnimatedButton>
      
      {/* Search Bar */}
      <div className="flex-1 flex justify-between px-4 md:px-6">
        <div className="flex-1 flex items-center">
          <motion.div 
            className="w-full max-w-lg lg:max-w-xs"
            initial={{ width: "100%" }}
            animate={{ width: isSearchFocused ? "120%" : "100%" }}
            transition={{ duration: 0.3, ease: [0.4, 0.0, 0.2, 1] }}
          >
            <label htmlFor="search" className="sr-only">Search</label>
            <div className="relative">
              <motion.div 
                className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                animate={{ 
                  color: isSearchFocused ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"
                }}
              >
                <i className="ri-search-line"></i>
              </motion.div>
              <Input 
                id="search" 
                className={cn(
                  "block w-full pl-10 pr-3 py-2 transition-all duration-200",
                  isSearchFocused && "ring-2 ring-primary/50 shadow-sm"
                )}
                placeholder="Search..." 
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
            </div>
          </motion.div>
        </div>
        
        {/* Right Nav Elements */}
        <div className="ml-4 flex items-center md:ml-6 space-x-4">
          {/* Notifications Button with Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <motion.button 
                className="p-1.5 rounded-full text-neutral-500 hover:text-neutral-800 hover:bg-secondary/50 relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <i className="ri-notification-3-line text-xl"></i>
                <motion.span 
                  className="absolute -top-1 -right-1 h-4 w-4 bg-danger rounded-full flex items-center justify-center text-xs text-white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ 
                    type: "spring",
                    stiffness: 500,
                    damping: 20,
                  }}
                >
                  {notifications.length}
                </motion.span>
              </motion.button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-72">
              <DropdownMenuLabel className="flex justify-between items-center">
                <span>Notifications</span>
                <span className="text-xs text-primary cursor-pointer hover:underline">Mark all as read</span>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <AnimatePresence>
                {notifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <DropdownMenuItem className="flex flex-col items-start py-2 cursor-pointer">
                      <div className="flex justify-between w-full">
                        <span className="font-medium">{notification.title}</span>
                        <span className="text-xs text-muted-foreground">{notification.time}</span>
                      </div>
                    </DropdownMenuItem>
                  </motion.div>
                ))}
              </AnimatePresence>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="justify-center text-primary">
                View all notifications
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Profile Dropdown */}
          <div className="ml-3 relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.button 
                  type="button" 
                  className="flex items-center max-w-xs text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Avatar className="h-8 w-8 border-2 border-transparent hover:border-primary/50 transition-all duration-200">
                    <AvatarImage src={user?.profileImage || ""} alt="Profile photo" />
                    <AvatarFallback>
                      {user?.firstName?.[0]}{user?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="ml-2 hidden md:block font-medium">
                    {user?.firstName} {user?.lastName}
                  </span>
                  <motion.i 
                    className="ri-arrow-down-s-line ml-1 hidden md:block"
                    animate={{ rotate: isSearchFocused ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  ></motion.i>
                </motion.button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5 mb-2">
                  <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="flex items-center cursor-pointer hover:bg-secondary/50 transition-all duration-150"
                  onClick={() => setLocation('/profile')}
                >
                  <i className="ri-user-line mr-2 text-primary/70"></i>
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="flex items-center cursor-pointer hover:bg-secondary/50 transition-all duration-150"
                  onClick={() => setLocation('/settings')}
                >
                  <i className="ri-settings-line mr-2 text-primary/70"></i>
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="flex items-center cursor-pointer hover:bg-secondary/50 transition-all duration-150"
                  onClick={logout}
                >
                  <i className="ri-logout-box-line mr-2 text-primary/70"></i>
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );
}
