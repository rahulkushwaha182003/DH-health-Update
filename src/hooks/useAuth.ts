import { useState, useEffect } from "react";
import { User, Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isAdminLoading, setIsAdminLoading] = useState(true);

  const checkAdminRole = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", userId)
        .eq("role", "admin")
        .maybeSingle();
      
      if (!error && data) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      console.error("[useAuth] checkAdminRole caught error:", error);
      setIsAdmin(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    let subscription: any = null;
    let timeoutId: any = null;
    let safetyTimeoutId: any = null;

    // Check if the current URL contains OAuth or password reset callback params
    const hasAuthParams = 
      window.location.hash.includes("access_token=") || 
      window.location.hash.includes("error_description=") ||
      window.location.search.includes("code=") ||
      window.location.search.includes("type=recovery");

    if (hasAuthParams) {
      // Set safety timeout to prevent permanent loading hang
      timeoutId = setTimeout(() => {
        if (isMounted) {
          setLoading(false);
        }
      }, 5000);
    }

    // Global safety timeout to ensure loader is released if Supabase hangs/deadlocks
    safetyTimeoutId = setTimeout(() => {
      if (isMounted) {
        setLoading(false);
        setIsAdminLoading(false);
      }
    }, 3000);
    const { data } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (!isMounted) return;

        // Clear the global safety timeout since we received an auth event
        if (safetyTimeoutId) {
          clearTimeout(safetyTimeoutId);
          safetyTimeoutId = null;
        }

        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          if (timeoutId) {
            clearTimeout(timeoutId);
            timeoutId = null;
          }
          setIsAdminLoading(true);
          // Run checkAdminRole in the background without blocking the core loading state
          checkAdminRole(currentSession.user.id).then(() => {
            if (isMounted) {
              setIsAdminLoading(false);
            }
          });
          setLoading(false);
        } else {
          // If there are auth params in the URL and the event is INITIAL_SESSION with no session,
          // we wait (hold loading state) for the SIGNED_IN event.
          const shouldHold = hasAuthParams && event === "INITIAL_SESSION";
          if (!shouldHold) {
            setIsAdmin(false);
            setIsAdminLoading(false);
            setLoading(false);
            if (timeoutId) {
              clearTimeout(timeoutId);
              timeoutId = null;
            }
          }
        }
      }
    );
    subscription = data.subscription;

    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      if (safetyTimeoutId) {
        clearTimeout(safetyTimeoutId);
        safetyTimeoutId = null;
      }
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setIsAdmin(false);
    setIsAdminLoading(false);
  };

  return { user, session, loading, isAdmin, isAdminLoading, signOut };
};
