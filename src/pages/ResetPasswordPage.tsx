import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/SEOHead";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Lock, Loader2, CheckCircle2, Eye, EyeOff, AlertCircle } from "lucide-react";
import logo from "@/assets/diagnostics-hub-logo.png";

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);
  const [success, setSuccess] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const setupRecovery = async () => {
      try {
        // 1. Check URL query params for exchangeable code (PKCE)
        const searchParams = new URLSearchParams(window.location.search);
        const code = searchParams.get("code");
        if (code) {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code);
          if (error) {
            console.error("[ResetPassword] exchangeCodeForSession error:", error);
            if (isMounted) setErrorMessage(error.message);
          } else if (data.session && isMounted) {
            setIsRecovery(true);
            setCheckingSession(false);
            return;
          }
        }

        // 2. Check URL hash for error description
        const hash = window.location.hash;
        if (hash.includes("error_description=")) {
          const hashParams = new URLSearchParams(hash.substring(1));
          const errDesc = hashParams.get("error_description");
          if (isMounted) {
            setErrorMessage(decodeURIComponent(errDesc?.replace(/\+/g, " ") || "The reset link has expired or is invalid."));
            setCheckingSession(false);
            return;
          }
        }

        // 3. Check URL hash for type=recovery or access_token
        if (hash.includes("type=recovery") || hash.includes("access_token=")) {
          if (isMounted) setIsRecovery(true);
        }

        // 4. Check active session
        const { data: { session } } = await supabase.auth.getSession();
        if (session && isMounted) {
          setIsRecovery(true);
        } else if (!code && !hash.includes("access_token=") && isMounted) {
          // Give 2 seconds for background session parsing before showing error
          setTimeout(async () => {
            if (!isMounted) return;
            const { data: { session: retrySession } } = await supabase.auth.getSession();
            if (retrySession) {
              setIsRecovery(true);
            } else {
              setErrorMessage("No active password reset session found. Please click the reset link in your email or request a new one.");
            }
            setCheckingSession(false);
          }, 1500);
          return;
        }
      } catch (err: any) {
        console.error("[ResetPassword] setup exception:", err);
        if (isMounted) setErrorMessage(err?.message || "Failed to verify reset session.");
      } finally {
        if (isMounted) setCheckingSession(false);
      }
    };

    setupRecovery();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!isMounted) return;
      if (event === "PASSWORD_RECOVERY" || (event === "SIGNED_IN" && session)) {
        setIsRecovery(true);
        setErrorMessage(null);
        setCheckingSession(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast({ title: "Password too short", description: "Password must be at least 6 characters.", variant: "destructive" });
      return;
    }

    if (newPassword !== confirmPassword) {
      toast({ title: "Passwords don't match", description: "Please make sure your passwords match.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      // 10-second timeout guard to prevent UI from freezing
      const updatePromise = supabase.auth.updateUser({ password: newPassword });
      const timeoutPromise = new Promise<{ data: any; error: any }>((_, reject) =>
        setTimeout(() => reject(new Error("Update request timed out. Please try again.")), 10000)
      );

      const { error } = await Promise.race([updatePromise, timeoutPromise]);

      if (error) {
        toast({ title: "Update Failed", description: error.message, variant: "destructive" });
        setIsLoading(false);
      } else {
        setSuccess(true);
        setIsLoading(false);
        toast({ title: "Password Updated!", description: "Your password has been reset successfully." });
        // Clean background sign out without blocking UI
        supabase.auth.signOut().catch(() => {});
        setTimeout(() => navigate("/auth"), 2000);
      }
    } catch (err: any) {
      toast({ title: "Error", description: err?.message || "An unexpected error occurred.", variant: "destructive" });
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <SEOHead
        title="Reset Password"
        description="Reset your Diagnostics Hub account password."
        canonical="/reset-password"
        robots="noindex, nofollow"
      />
      <section className="py-12 md:py-16 bg-gradient-to-br from-primary/5 to-secondary/5 min-h-[calc(100vh-200px)]">
        <div className="container max-w-md px-4">
          <Card>
            <CardHeader className="text-center">
              <img 
                src={logo} 
                alt="Diagnostics Hub Logo" 
                className="h-20 w-20 mx-auto mb-4 rounded-full object-cover shadow-lg"
              />
              <CardTitle className="text-xl md:text-2xl">
                {success ? "Password Updated!" : errorMessage ? "Reset Link Problem" : "Set New Password"}
              </CardTitle>
              <CardDescription>
                {success 
                  ? "Redirecting you to login..." 
                  : errorMessage
                    ? errorMessage
                    : isRecovery 
                      ? "Enter your new password below" 
                      : "Verifying your password reset link..."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {success ? (
                <div className="text-center space-y-4">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="h-8 w-8 text-primary" />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Your password has been updated. You will be redirected to the login page.
                  </p>
                  <Button className="w-full" onClick={() => navigate("/auth")}>
                    Go to Login
                  </Button>
                </div>
              ) : errorMessage ? (
                <div className="text-center space-y-4 py-2">
                  <div className="h-14 w-14 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
                    <AlertCircle className="h-7 w-7 text-destructive" />
                  </div>
                  <p className="text-sm text-destructive font-medium">
                    {errorMessage}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Password reset links are single-use and expire quickly for security reasons.
                  </p>
                  <Button className="w-full" onClick={() => navigate("/auth")}>
                    Request New Reset Link
                  </Button>
                </div>
              ) : isRecovery ? (
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                  <div className="flex justify-center mb-2">
                    <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                      <Lock className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="new-password"
                        type={showNewPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none focus:text-foreground transition-colors"
                      >
                        {showNewPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="confirm-password"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        className="pl-10 pr-10"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none focus:text-foreground transition-colors"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Updating...</>
                    ) : (
                      "Set New Password"
                    )}
                  </Button>
                </form>
              ) : (
                <div className="text-center space-y-4 py-4">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                  <p className="text-sm text-muted-foreground">
                    Verifying your reset session...
                  </p>
                  <Button variant="outline" size="sm" onClick={() => navigate("/auth")}>
                    Back to Login
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default ResetPasswordPage;
