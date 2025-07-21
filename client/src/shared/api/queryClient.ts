import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { TokenManager } from "../auth/token-manager";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  console.log(`🌐 ApiRequest: ${method} ${url}`);
  
  // Wait for token to be available
  const token = await waitForToken();
  const headers: Record<string, string> = {};
  
  console.log('🔍 ApiRequest: Token available:', !!token);
  if (token) {
    console.log('🔍 ApiRequest: Token preview:', token.substring(0, 50) + '...');
  }
  
  if (data) {
    headers["Content-Type"] = "application/json";
  }
  
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
    console.log('📤 ApiRequest: Added Authorization header');
  } else {
    console.warn('⚠️ ApiRequest: No token available for request');
  }

  const res = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  console.log(`📥 ApiRequest: Response ${res.status} ${res.statusText} for ${method} ${url}`);
  
  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
// Helper function to wait for token with timeout
async function waitForToken(maxWaitMs = 10000): Promise<string | null> {
  const startTime = Date.now();
  
  while (Date.now() - startTime < maxWaitMs) {
    const token = TokenManager.getToken();
    if (token) {
      console.log('✅ Query: Token acquired after', Date.now() - startTime, 'ms');
      return token;
    }
    
    // Check every 100ms
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  console.warn('⚠️ Query: Timeout waiting for token after', maxWaitMs, 'ms');
  return null;
}

export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    console.log('🔍 Query starting for:', queryKey[0]);
    
    // Wait for token to be available
    const token = await waitForToken();
    const headers: Record<string, string> = {};
    
    console.log('🔍 Query: Token available:', !!token);
    if (token) {
      console.log('🔍 Query: Token preview:', token.substring(0, 50) + '...');
      headers["Authorization"] = `Bearer ${token}`;
      console.log('📤 Query: Sending request with token to:', queryKey[0]);
    } else {
      console.warn('⚠️ Query: No token available for request to:', queryKey[0]);
    }

    const res = await fetch(queryKey[0] as string, {
      headers,
      credentials: "include",
    });

    console.log(`📥 Query: Response ${res.status} ${res.statusText} for ${queryKey[0]}`);

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      console.log('🚫 Query: Returning null for 401 response');
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
