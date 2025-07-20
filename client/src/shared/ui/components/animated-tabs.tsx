import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

interface TabItem {
  value: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

interface AnimatedTabsProps {
  items: TabItem[];
  defaultValue?: string;
  className?: string;
  tabsListClassName?: string;
  tabsTriggerClassName?: string;
  tabsContentClassName?: string;
  orientation?: "horizontal" | "vertical";
  variant?: "underline" | "boxed" | "pills";
}

export function AnimatedTabs({
  items,
  defaultValue,
  className,
  tabsListClassName,
  tabsTriggerClassName,
  tabsContentClassName,
  orientation = "horizontal",
  variant = "underline"
}: AnimatedTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue || items[0]?.value || "");

  const variants = {
    underline: {
      tabsList: "border-b border-border",
      tabsTrigger: "tab-underline data-[state=active]:text-primary data-[state=active]:after:w-full relative px-4 py-2",
    },
    boxed: {
      tabsList: "bg-muted p-1 rounded-lg",
      tabsTrigger: "data-[state=active]:bg-background rounded-md shadow-none data-[state=active]:text-primary px-4 py-2",
    },
    pills: {
      tabsList: "gap-2",
      tabsTrigger: "bg-transparent data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-4 py-2",
    }
  };

  return (
    <Tabs
      value={activeTab}
      onValueChange={setActiveTab}
      className={cn(
        "w-full", 
        orientation === "vertical" && "flex gap-8",
        className
      )}
    >
      <TabsList 
        className={cn(
          variants[variant].tabsList,
          orientation === "vertical" && "flex-col",
          tabsListClassName
        )}
      >
        {items.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className={cn(
              variants[variant].tabsTrigger,
              "flex items-center gap-2 transition-all duration-200",
              tabsTriggerClassName
            )}
          >
            {tab.icon}
            {tab.label}
            {variant === "pills" && tab.value === activeTab && (
              <motion.span
                layoutId="pill-highlight"
                className="absolute inset-0 bg-primary rounded-full -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </TabsTrigger>
        ))}
      </TabsList>

      <div className={cn("relative flex-1 overflow-hidden", tabsContentClassName)}>
        <AnimatePresence mode="wait">
          {items.map((tab) => (
            tab.value === activeTab && (
              <TabsContent
                key={tab.value}
                value={tab.value}
                forceMount
                asChild
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ 
                    duration: 0.3, 
                    ease: [0.22, 1, 0.36, 1]
                  }}
                  className="w-full"
                >
                  {tab.content}
                </motion.div>
              </TabsContent>
            )
          ))}
        </AnimatePresence>
      </div>
    </Tabs>
  );
}

export default AnimatedTabs;