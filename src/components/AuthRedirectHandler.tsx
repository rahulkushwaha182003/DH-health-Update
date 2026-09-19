import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

/**
 * AuthRedirectHandler
 * Handles cross-cutting authentication redirects:
 * 1. Automatically intercepts password reset tokens (type=recovery) regardless of which page Supabase redirects to,
 *    and immediately routes the user to /reset-password.
 * 2. Automatically intercepts OAuth access tokens (from Google login) landing on root or fallback URLs,
 *    and routes the user to their intended destination (or /dashboard).
 */
const AuthRedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // 1. Immediate URL check for Password Recovery tokens
    const hash = window.location.hash;
    const search = window.location.search;

    const isRecoveryUrl =
      hash.includes("type=recovery") ||
      search.includes("type=recovery") ||
      search.includes("error_code=otp_expired");

    if (isRecoveryUrl && location.pathname !== "/reset-password") {
      navigate(`/reset-password${search}${hash}`, { replace: true });
      return;
    }

    // 2. Check for OAuth callback access_token landing on homepage
    if (hash.includes("access_token=") && !hash.includes("type=recovery")) {
      if (location.pathname === "/" || location.pathname === "/auth") {
        let dest = "/dashboard";
        try {
          const stored = localStorage.getItem("oauth_redirect_to");
          if (stored) {
            localStorage.removeItem("oauth_redirect_to");
            dest = stored;
          }
        } catch {
          // LocalStorage fallback
        }

        // Allow Supabase client detectSessionInUrl to parse token, then navigate
        setTimeout(() => {
          navigate(dest, { replace: true });
        }, 300);
      }
    }

    // 3. Listen to Supabase Auth State Changes for global recovery events
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        if (window.location.pathname !== "/reset-password") {
          navigate("/reset-password", { replace: true });
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [location, navigate]);

  return null;
};

export default AuthRedirectHandler;
