import { useLocation, Link } from "wouter";
import { ProxaLogo } from "@/lib/proxa-logo";
import { ProxaIcon } from "@/lib/proxa-icon";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

type SidebarLink = {
  href: string;
  label: string;
  icon: string;
  category?: string;
};

const links: SidebarLink[] = [
  { href: "/", label: "Dashboard", icon: "ri-dashboard-line", category: "Overview" },
  { href: "/employees", label: "Employee Directory", icon: "ri-team-line", category: "People" },
  { href: "/reviews", label: "Performance Reviews", icon: "ri-award-line", category: "People" },
  { href: "/goals", label: "Goals & OKRs", icon: "ri-flag-line", category: "Performance" },
  { href: "/one-on-one", label: "1:1 Meetings", icon: "ri-chat-1-line", category: "Performance" },
  { href: "/surveys", label: "Surveys", icon: "ri-survey-line", category: "Feedback" },
  { href: "/analytics", label: "Analytics", icon: "ri-bar-chart-box-line", category: "Insights" },
  { href: "/settings", label: "Settings", icon: "ri-settings-line", category: "Admin" },
];

export function Sidebar() {
  const [location] = useLocation();

  // Group links by category
  const linksByCategory = links.reduce((acc, link) => {
    const category = link.category || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(link);
    return acc;
  }, {} as Record<string, SidebarLink[]>);

  // Order categories
  const categoryOrder = ["Overview", "People", "Performance", "Feedback", "Insights", "Admin", "Other"];
  const sortedCategories = Object.keys(linksByCategory).sort(
    (a, b) => categoryOrder.indexOf(a) - categoryOrder.indexOf(b)
  );

  return (
    <div className="flex flex-shrink-0 h-full">
      <div className="flex flex-col w-64 border-r border-neutral-200 bg-white shadow-sm">
        {/* Logo */}
        <div className="flex items-center h-16 px-6 border-b border-neutral-100">
          <div className="flex items-center">
            <ProxaIcon className="h-8 w-8 mr-2" />
            <ProxaLogo className="h-6" />
          </div>
        </div>
        
        {/* Sidebar Links */}
        <div className="flex flex-col flex-1 overflow-y-auto">
          <nav className="flex-1 px-3 py-4">
            {sortedCategories.map((category) => (
              <div key={category} className="mb-6">
                <div className="px-3 mb-2">
                  <h3 className="text-xs font-medium uppercase tracking-wider text-slate-500">
                    {category}
                  </h3>
                </div>
                <div className="space-y-1">
                  {linksByCategory[category].map((link) => (
                    <Link href={link.href} key={link.href}>
                      <Button 
                        variant="ghost"
                        className={cn(
                          "sidebar-link justify-start w-full transition-all", 
                          location === link.href ? "active" : ""
                        )}
                      >
                        <i className={cn(link.icon, "mr-3 text-lg opacity-80")} />
                        {link.label}
                      </Button>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          <div className="mt-auto p-4">
            <Separator className="mb-4" />
            <div className="flex items-center px-2">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center mr-3">
                <i className="ri-user-line text-primary"></i>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">Ashley Johnson</p>
                <p className="text-xs text-slate-500">HR Director</p>
              </div>
              <Button variant="ghost" size="icon" className="ml-auto h-8 w-8">
                <i className="ri-more-2-fill"></i>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
