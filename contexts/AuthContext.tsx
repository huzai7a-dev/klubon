import { supabase } from "@/lib/supabase";
import profileService from "@/services/profile.service";
import { UserProfile } from "@/types";
import { Session, User } from "@supabase/supabase-js";
import { router } from "expo-router";
import {
  createContext,
  use,
  useEffect,
  useState,
  type PropsWithChildren,
} from "react";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isInitializing: boolean;
  signIn: (session: Session) => Promise<void>;
  signOut: () => Promise<void>;
  loadProfile: () => Promise<void>;
  updateProfileState: (profile: UserProfile) => void;
  updateUserProfile: (updates: Partial<UserProfile>) => Promise<void>;
  updateUserActivities: (activityIds: string[]) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  profile: null,
  isLoading: false,
  isInitializing: true,
  signIn: async () => { },
  signOut: async () => { },
  loadProfile: async () => { },
  updateProfileState: () => { },
  updateUserProfile: async () => { },
  updateUserActivities: async () => { },
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
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  const loadProfile = async () => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      const profileData = await profileService.getUserProfile(user.id);
      setProfile(profileData);
    } catch (error) {
      router.replace("/(auth)");
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (newSession: Session) => {
    setSession(newSession);
    setUser(newSession.user);

    if (newSession.user?.id) {
      setIsLoading(true);
      const profileData = await profileService.getUserProfile(
        newSession.user.id
      );
      setProfile(profileData);
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      setSession(null);
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfileState = (newProfile: UserProfile) => {
    setProfile(newProfile);
  };

  const updateUserProfile = async (updates: Partial<UserProfile>) => {
    if (!profile || !user) return;

    // 1. Optimistic Update
    setProfile((prev) => (prev ? { ...prev, ...updates } : null));

    try {
      // 2. Call Service
      const updatedProfile = await profileService.updateProfile(user.id, updates);

      // 3. Reconcile if needed (optional, but good practice)
      if (updatedProfile) {
        setProfile((prev) => (prev ? { ...prev, ...updatedProfile } : updatedProfile));
      }
    } catch (error) {
      console.error("Failed to update profile", error);
      // Revert on error? For now, we'll just log it. 
      // In a real app, you might want a toast notification.
    }
  };

  const updateUserActivities = async (activityIds: string[]) => {
    if (!user?.id) return;

    try {
      const success = await profileService.updateUserActivities(user.id, activityIds);
      if (success) {
        // Reload profile to get the full joined activity objects
        await loadProfile();
      }
    } catch (error) {
      console.error("Failed to update activities", error);
    }
  };

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      try {
        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        if (currentSession) {
          setSession(currentSession);
          setUser(currentSession.user);

          const profileData = await profileService.getUserProfile(
            currentSession.user.id
          );

          if (!mounted) return;

          setProfile(profileData);
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        if (mounted) {
          setIsInitializing(false);
        }
      }
    }

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (!mounted) return;

      if (newSession) {
        setSession(newSession);
        setUser(newSession.user);

        if (newSession.user?.id) {
          const profileData = await profileService.getUserProfile(
            newSession.user.id
          );
          if (mounted) {
            setProfile(profileData);
          }
        }
      } else {
        setSession(null);
        setUser(null);
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        profile,
        isLoading,
        isInitializing,
        signIn,
        signOut,
        loadProfile,
        updateProfileState,
        updateUserProfile,
        updateUserActivities,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
