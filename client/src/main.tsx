import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./shared/api/queryClient";
import { TooltipProvider } from "@/shared/ui/components/tooltip";
import { Toaster } from "@/shared/ui/components/toaster";

console.log("🏁 main.tsx: Starting application render");

createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      {console.log("🏁 main.tsx: About to render App component")}
      <App />
      <Toaster />
    </TooltipProvider>
  </QueryClientProvider>
);

console.log("🏁 main.tsx: Application render setup complete");
