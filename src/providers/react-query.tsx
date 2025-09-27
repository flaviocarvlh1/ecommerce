"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuthStatus } from "@/action/use-auth-status";

function AuthStatusListener() {
  useAuthStatus();
  return null;
}

const queryClient = new QueryClient();

const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthStatusListener />
      {children}
    </QueryClientProvider>
  );
};

export default ReactQueryProvider;
