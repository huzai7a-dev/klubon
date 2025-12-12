import { useStorageState } from "@/hooks/useStorageState";
import { createContext, use, type PropsWithChildren } from "react";

const AuthContext = createContext<{
  signIn: () => void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
  profileCompleted: boolean;
  setProfileCompleted: (value: boolean) => void;
}>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  isLoading: false,
  profileCompleted: false,
  setProfileCompleted: () => null,
});

// Use this hook to access the user info.
export function useSession() {
  const value = use(AuthContext);
  if (!value) {
    throw new Error("useSession must be wrapped in a <SessionProvider />");
  }

  return value;
}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState("session");
  const [[isProfileLoading, profileCompleted], setProfileCompleted] = useStorageState("profileCompleted");

  return (
    <AuthContext.Provider
      value={{
        signIn: () => {
          // Perform sign-in logic here
          setSession("xxx");
        },
        signOut: () => {
          setSession(null);
          setProfileCompleted("false");
        },
        session,
        isLoading,
        profileCompleted: profileCompleted === "true",
        setProfileCompleted: (value: boolean) => {
          setProfileCompleted(value ? "true" : "false");
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
