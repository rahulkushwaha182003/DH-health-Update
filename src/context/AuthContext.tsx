import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export interface UserProfile {
  id?: string;
  user_id?: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone?: string | null;
  address?: string | null;
  date_of_birth?: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  isAdminLoading: boolean;
  signOut: () => Promise<void>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  profile: null,
  isAdmin: false,
  loading: true,
  isAdminLoading: true,
  signOut: async () => {},
  refreshAuth: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isAdminLoading, setIsAdminLoading] = useState<boolean>(true);

  const fetchUserData = useCallback(async (u: User | null) => {
    if (!u) {
      setProfile(null);
      setIsAdmin(false);
      setIsAdminLoading(false);
      return;
    }

    setIsAdminLoading(true);
    try {
      const [roleRes, profileRes] = await Promise.all([
        supabase
          .from("user_roles")
          .select("role")
          .eq("user_id", u.id)
          .eq("role", "admin")
          .maybeSingle(),
        supabase
          .from("profiles")
          .select("first_name, last_name, email, phone, address, date_of_birth")
          .eq("user_id", u.id)
          .maybeSingle(),
      ]);

      setIsAdmin(!roleRes.error && !!roleRes.data);
      if (profileRes.data) {
        setProfile(profileRes.data as UserProfile);
      } else if (u) {
        // Fallback for OAuth users (e.g. Google) whose profile row was not created via email signup form
        const meta = u.user_metadata || {};
        const fullName = (meta.full_name || meta.name || "").trim();
        const nameParts = fullName.split(" ");
        const firstName = meta.given_name || nameParts[0] || u.email?.split("@")[0] || "User";
        const lastName = meta.family_name || (nameParts.length > 1 ? nameParts.slice(1).join(" ") : "");

        const oAuthProfile: UserProfile = {
          user_id: u.id,
          first_name: firstName,
          last_name: lastName,
          email: u.email || null,
        };
        setProfile(oAuthProfile);

        // Attempt silent background upsert into profiles table
        supabase
          .from("profiles")
          .upsert({
            user_id: u.id,
            first_name: firstName,
            last_name: lastName,
            email: u.email || null,
          })
          .then(() => {}, () => {});
      }
    } catch (err) {
      console.error("[AuthContext] Error checking user role/profile:", err);
      setIsAdmin(false);
    } finally {
      setIsAdminLoading(false);
    }
  }, []);

  const refreshAuth = useCallback(async () => {
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      if (currentSession?.user) {
        await fetchUserData(currentSession.user);
      } else {
        setProfile(null);
        setIsAdmin(false);
        setIsAdminLoading(false);
      }
    } catch (err) {
      console.error("[AuthContext] refreshAuth error:", err);
    }
  }, [fetchUserData]);

  useEffect(() => {
    let isMounted = true;

    const initAuth = async () => {
      try {
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        if (!isMounted) return;

        setSession(initialSession);
        setUser(initialSession?.user ?? null);

        if (initialSession?.user) {
          await fetchUserData(initialSession.user);
        } else {
          setIsAdmin(false);
          setIsAdminLoading(false);
          setProfile(null);
        }
      } catch (err) {
        console.error("[AuthContext] initAuth error:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, currentSession) => {
        if (!isMounted) return;

        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          // Defer DB calls to next event loop tick to avoid GoTrue auth lock deadlocks during updateUser
          setTimeout(() => {
            if (isMounted) {
              fetchUserData(currentSession.user);
            }
          }, 0);
        } else {
          setIsAdmin(false);
          setIsAdminLoading(false);
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [fetchUserData]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("[AuthContext] signOut error:", err);
    } finally {
      setUser(null);
      setSession(null);
      setProfile(null);
      setIsAdmin(false);
      setIsAdminLoading(false);
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isAdmin,
        loading,
        isAdminLoading,
        signOut,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
