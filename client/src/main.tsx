import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./shared/api/queryClient";
import { TooltipProvider } from "@/shared/ui/components/tooltip";
import { Toaster } from "@/shared/ui/components/toaster";
import { Auth0ProviderWrapper } from "@/features/auth/components/auth0-provider";


createRoot(document.getElementById("root")!).render(
  <Auth0ProviderWrapper>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <App />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  </Auth0ProviderWrapper>
);

