import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface NavMenuProps {
  items: NavItem[];
  className?: string;
  indicatorClassName?: string;
  animated?: boolean;
}

export function NavMenu({ 
  items, 
  className, 
  indicatorClassName,
  animated = true 
}: NavMenuProps) {
  const [location] = useLocation();
  const [activeIndex, setActiveIndex] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 0, left: 0 });
  const navRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLAnchorElement | null)[]>([]);
  
  useEffect(() => {
    // Find the index of the current active item
    const index = items.findIndex(item => item.href === location);
    if (index !== -1) {
      setActiveIndex(index);
      const currentItem = itemsRef.current[index];
      if (currentItem && navRef.current) {
        const navRect = navRef.current.getBoundingClientRect();
        const itemRect = currentItem.getBoundingClientRect();
        
        setDimensions({
          width: itemRect.width,
          left: itemRect.left - navRect.left
        });
      }
    }
  }, [location, items]);

  return (
    <div className={cn("relative", className)} ref={navRef}>
      <div className="flex space-x-1">
        {items.map((item, index) => (
          <Link 
            key={item.href} 
            href={item.href}
            ref={el => itemsRef.current[index] = el}
          >
            <a className={cn(
              "px-4 py-2 rounded-md text-sm font-medium transition-colors",
              location === item.href 
                ? "text-primary" 
                : "text-muted-foreground hover:text-foreground hover:bg-secondary/50",
              "flex items-center gap-2"
            )}>
              {item.icon}
              {item.label}
            </a>
          </Link>
        ))}
      </div>
      
      {animated && activeIndex !== null && (
        <motion.div
          className={cn(
            "absolute bottom-0 h-0.5 bg-primary rounded-full",
            indicatorClassName
          )}
          initial={false}
          animate={{
            width: dimensions.width,
            left: dimensions.left,
            opacity: 1
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30
          }}
        />
      )}
    </div>
  );
}

export default NavMenu;