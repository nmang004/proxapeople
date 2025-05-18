import { useLocation, Link } from "wouter";
import { ProxaLogo } from "@/lib/proxa-logo";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type SidebarLink = {
  href: string;
  label: string;
  icon: string;
};

const links: SidebarLink[] = [
  { href: "/", label: "Dashboard", icon: "ri-dashboard-line" },
  { href: "/employees", label: "Employee Directory", icon: "ri-user-line" },
  { href: "/reviews", label: "Performance Reviews", icon: "ri-award-line" },
  { href: "/goals", label: "Goals & OKRs", icon: "ri-flag-line" },
  { href: "/one-on-one", label: "1:1 Meetings", icon: "ri-chat-1-line" },
  { href: "/surveys", label: "Surveys", icon: "ri-survey-line" },
  { href: "/analytics", label: "Analytics", icon: "ri-bar-chart-line" },
  { href: "/settings", label: "Settings", icon: "ri-settings-line" },
];

export function Sidebar() {
  const [location] = useLocation();

  return (
    <div className="flex flex-shrink-0 h-full">
      <div className="flex flex-col w-64 border-r border-neutral-200">
        {/* Logo */}
        <div className="flex items-center justify-center h-16 px-4 bg-white border-b border-neutral-200">
          <ProxaLogo className="h-8" />
        </div>
        
        {/* Sidebar Links */}
        <div className="flex flex-col flex-1 overflow-y-auto bg-white">
          <nav className="flex-1 px-2 py-4 space-y-1">
            {links.map((link) => (
              <Link href={link.href} key={link.href}>
                <Button 
                  variant="ghost"
                  className={cn(
                    "sidebar-link justify-start w-full", 
                    location === link.href && "active"
                  )}
                >
                  <i className={cn(link.icon, "mr-3 text-xl")} />
                  {link.label}
                </Button>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
