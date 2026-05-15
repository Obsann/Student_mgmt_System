import { ReactNode } from "react";
import { AuthProvider, useAuth } from "./AuthContext";
import { DataProvider, useData } from "./DataContext";

// Shim hook that combines Auth and Data contexts for backward compatibility
// This prevents having to rewrite all 30+ imports immediately
export const useApp = () => {
  const auth = useAuth();
  const data = useData();
  
  return {
    ...auth,
    ...data,
  };
};

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <DataProvider>
        {children}
      </DataProvider>
    </AuthProvider>
  );
}
