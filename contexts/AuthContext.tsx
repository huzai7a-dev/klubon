import React, { createContext, ReactNode, useContext, useState } from "react";

type AuthContextType = {
  isAuthenticated: boolean;
  signIn: (method?: string) => void;
  signOut: () => void;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  signIn: () => {},
  signOut: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  console.log(isAuthenticated, "isAuthenticated in AuthProvider");
  const signIn = (method?: string) => {
    console.log("Mock sign in with", method);
    // Simulate async auth, then set authenticated
    setIsAuthenticated(true);
  };

  const signOut = () => {
    console.log("Mock sign out");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
