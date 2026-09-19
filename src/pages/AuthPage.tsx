import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/SEOHead";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Mail, Lock, Loader2, ArrowLeft, CheckCircle2, Eye, EyeOff } from "lucide-react";
import logo from "@/assets/diagnostics-hub-logo.png";

const AuthPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupPassword, setSignupPassword] = useState("");
  const [signupConfirmPassword, setSignupConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  
  // Password Visibility States
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Password Reset States
  const [showResetForm, setShowResetForm] = useState(() => searchParams.get("reset") === "true");
  const [resetEmail, setResetEmail] = useState("");
  const [resetSent, setResetSent] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const redirectTo = searchParams.get("redirect") || "/dashboard";

  useEffect(() => {
    // Check URL hash for OAuth errors
    const hash = window.location.hash;
    if (hash.includes("error_description=")) {
      const params = new URLSearchParams(hash.substring(1));
      const errorDesc = params.get("error_description");
      if (errorDesc) {
        toast({
          title: "Sign-In Error",
          description: decodeURIComponent(errorDesc.replace(/\+/g, " ")),
          variant: "destructive",
        });
        window.history.replaceState(null, "", window.location.pathname);
      }
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate(redirectTo, { replace: true });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        return;
      }
      if (session) {
        navigate(redirectTo, { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate, redirectTo, toast]);

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const origin = window.location.origin;
      const targetDestination = redirectTo && redirectTo !== "/" ? (redirectTo.startsWith("/") ? redirectTo : `/${redirectTo}`) : "";
      const targetRedirect = `${origin}${targetDestination}`;

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: targetRedirect,
          skipBrowserRedirect: true,
        },
      });

      if (error) {
        toast({
          title: "Google Sign-In Failed",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      if (data?.url) {
        // Validate if Google provider is enabled before browser redirect
        try {
          const resp = await fetch(data.url);
          if (resp.status >= 400) {
            const errData = await resp.json().catch(() => ({}));
            const msg = errData.msg || "Google Sign-In is not enabled yet in your Supabase project. Please configure Google provider in Supabase Dashboard.";
            toast({
              title: "Google Sign-In Not Configured",
              description: msg,
              variant: "destructive",
            });
            return;
          }
        } catch {
          // If fetch fails due to CORS or network, proceed to redirect
        }
        window.location.href = data.url;
      }
    } catch (error: any) {
      toast({
        title: "Google Sign-In Error",
        description: error?.message || "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginEmail,
        password: loginPassword,
      });

      if (error) {
        toast({
          title: "Login Failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome back!",
          description: "You have been logged in successfully.",
        });
        if (data?.session) {
          navigate(redirectTo, { replace: true });
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signupPassword !== signupConfirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    if (signupPassword.length < 6) {
      toast({
        title: "Password too short",
        description: "Password must be at least 6 characters.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: signupEmail,
        password: signupPassword,
        options: {
          emailRedirectTo: `${window.location.origin}${redirectTo}`,
          data: {
            first_name: firstName,
            last_name: lastName,
          },
        },
      });

      if (error) {
        if (error.message.includes("already registered")) {
          toast({
            title: "Account exists",
            description: "An account with this email already exists. Please log in instead.",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Signup Failed",
            description: error.message,
            variant: "destructive",
          });
        }
      } else {
        if (data?.session) {
          toast({
            title: "Welcome!",
            description: "Account created and logged in successfully.",
          });
          navigate(redirectTo, { replace: true });
        } else {
          toast({
            title: "Account created!",
            description: "Welcome to Diagnostics Hub. Please check your email or log in.",
          });
        }
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) {
      toast({ title: "Email Required", description: "Please enter your email address.", variant: "destructive" });
      return;
    }
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(resetEmail.trim(), {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) {
        toast({ title: "Reset Failed", description: error.message, variant: "destructive" });
      } else {
        setResetSent(true);
        toast({ 
          title: "Reset Link Sent!", 
          description: "We've sent a password reset link to your email." 
        });
      }
    } catch {
      toast({ title: "Error", description: "An unexpected error occurred.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const resetForgotPassword = () => {
    setShowResetForm(false);
    setResetSent(false);
    setResetEmail("");
  };

  if (showResetForm) {
    return (
      <Layout>
        <SEOHead
          title="Reset Password"
          description="Reset your Diagnostics Hub account password."
          canonical="/auth"
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
                <CardTitle className="text-xl md:text-2xl">Reset Password</CardTitle>
                <CardDescription>
                  {resetSent 
                    ? "We've sent a reset link to your email address" 
                    : "Enter your email to receive a password reset link"}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {resetSent ? (
                  <div className="space-y-6 text-center py-2">
                    <div className="h-16 w-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
                      <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                    </div>
                    
                    <div className="space-y-2">
                      <h3 className="font-bold text-lg text-foreground">Check Your Email</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        We've sent a password reset link to <strong className="text-foreground">{resetEmail}</strong>.
                      </p>
                      <p className="text-xs text-muted-foreground bg-muted/60 p-3 rounded-lg border border-border leading-relaxed">
                        Click the link in the email to reset your password. If you don't see it, please check your spam or junk folder.
                      </p>
                    </div>

                    <div className="space-y-3 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={handlePasswordReset}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Resending...</>
                        ) : (
                          "Resend Email Link"
                        )}
                      </Button>

                      <Button
                        type="button"
                        variant="ghost"
                        className="w-full"
                        onClick={resetForgotPassword}
                      >
                        <ArrowLeft className="h-4 w-4 mr-2" />Back to Login
                      </Button>
                    </div>

                    <div className="text-center pt-2 border-t text-xs text-muted-foreground">
                      <p>Need assistance? Contact support at</p>
                      <a href="tel:+917649885936" className="font-bold text-primary hover:underline">+91 7649885936</a>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handlePasswordReset} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="reset-email">Email Address</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="reset-email"
                          type="email"
                          placeholder="your@email.com"
                          className="pl-10"
                          value={resetEmail}
                          onChange={(e) => setResetEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Sending...</>
                      ) : (
                        <><Mail className="h-4 w-4 mr-2" />Send Reset Link</>
                      )}
                    </Button>
                    <Button type="button" variant="ghost" className="w-full" onClick={resetForgotPassword}>
                      <ArrowLeft className="h-4 w-4 mr-2" />Back to Login
                    </Button>

                    <div className="text-center pt-2 border-t text-xs text-muted-foreground">
                      <p>Need assistance? Contact support at</p>
                      <a href="tel:+917649885936" className="font-bold text-primary hover:underline">+91 7649885936</a>
                    </div>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </section>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEOHead
        title="Patient Login & Register"
        description="Login or create an account with Diagnostics Hub to view test reports and manage appointments."
        canonical="/auth"
        robots="noindex, nofollow"
      />
      <section className="py-12 md:py-16 bg-gradient-to-br from-primary/5 to-secondary/5 min-h-[calc(100vh-200px)]">
        <div className="container max-w-md px-4">
          <Card>
            <CardHeader className="text-center pb-4">
              <img 
                src={logo} 
                alt="Diagnostics Hub Logo" 
                className="h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 mx-auto mb-3 rounded-full object-cover shadow-lg border-4 border-primary/20"
              />
              <CardTitle className="text-xl md:text-2xl text-primary">Diagnostics Hub</CardTitle>
              <CardDescription className="text-sm">
                Access your appointments, test results, and health records
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="signup">Sign Up</TabsTrigger>
                </TabsList>

                <TabsContent value="login">
                  <div className="mt-4 space-y-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      disabled={isLoading || isGoogleLoading}
                      onClick={handleGoogleLogin}
                    >
                      {isGoogleLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Connecting to Google...
                        </>
                      ) : (
                        <>
                          <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                          </svg>
                          Continue with Google
                        </>
                      )}
                    </Button>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
                      </div>
                    </div>
                  </div>
                  <form onSubmit={handleLogin} className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="your@email.com"
                          className="pl-10"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="login-password"
                          type={showLoginPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pl-10 pr-10"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowLoginPassword(!showLoginPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none focus:text-foreground transition-colors"
                        >
                          {showLoginPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Signing in...
                        </>
                      ) : (
                        "Sign In"
                      )}
                    </Button>
                    <Button 
                      type="button"
                      variant="link" 
                      className="w-full text-primary"
                      onClick={() => setShowResetForm(true)}
                    >
                      Forgot Password?
                    </Button>
                  </form>
                </TabsContent>

                <TabsContent value="signup">
                  <div className="mt-4 space-y-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      disabled={isLoading || isGoogleLoading}
                      onClick={handleGoogleLogin}
                    >
                      {isGoogleLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Connecting to Google...
                        </>
                      ) : (
                        <>
                          <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                          </svg>
                          Sign up with Google
                        </>
                      )}
                    </Button>
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">Or register with email</span>
                      </div>
                    </div>
                  </div>
                  <form onSubmit={handleSignup} className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first-name">First Name</Label>
                        <Input
                          id="first-name"
                          placeholder="John"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name">Last Name</Label>
                        <Input
                          id="last-name"
                          placeholder="Doe"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-email">Email</Label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="your@email.com"
                          className="pl-10"
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="signup-password">Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="signup-password"
                          type={showSignupPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pl-10 pr-10"
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowSignupPassword(!showSignupPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none focus:text-foreground transition-colors"
                        >
                          {showSignupPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm Password</Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="pl-10 pr-10"
                          value={signupConfirmPassword}
                          onChange={(e) => setSignupConfirmPassword(e.target.value)}
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
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </form>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </section>
    </Layout>
  );
};

export default AuthPage;
