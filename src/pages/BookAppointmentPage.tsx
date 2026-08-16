import { useState, useEffect, useRef } from "react";
import SEOHead from "@/components/SEOHead";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import Layout from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { CalendarIcon, CheckCircle, Clock, FileText, Home, Building2, Star, Upload, X, FileUp, TestTube2, ArrowLeft, CreditCard, Banknote } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { tests, packages, formatINR } from "@/data/testsData";
import { useCart } from "@/context/CartContext";
import { syncToGoogleSheets } from "@/lib/googleSheets";
import { sendTelegramMessage } from "@/lib/telegram";

const bookingSchema = z.object({
  fullName: z.string().min(2, "Full name required").max(100),
  phone: z.string().regex(/^\d{10}$/, "Mobile number must be exactly 10 digits"),
  gender: z.string().min(1, "Please select gender"),
  date: z.date({ required_error: "Please select a date" }),
  timeSlot: z.string().min(1, "Please select a time slot"),
  testType: z.string().min(1, "Please select a test"),
  sampleCollection: z.enum(["lab", "home"]),
  address: z.string().min(10, "Please enter a valid address"),
  notes: z.string().max(500).optional(),
  paymentMethod: z.enum(["cash", "online"]),
  scheduleType: z.enum(["urgent", "schedule"]),
});

type BookingFormData = z.infer<typeof bookingSchema>;

const timeSlots = [
  "7:00 AM - 8:00 AM",
  "8:00 AM - 9:00 AM",
  "9:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "2:00 PM - 3:00 PM",
  "3:00 PM - 4:00 PM",
  "4:00 PM - 5:00 PM",
  "5:00 PM - 6:00 PM",
];

// Build test options from testsData with prices
const allTestOptions = [
  ...tests.map(t => ({ value: t.name, label: t.name, price: t.price })),
  ...packages.map(p => ({ value: p.name, label: `${p.name} (Package)`, price: p.price })),
  { value: "Other", label: "Other (Specify in notes)", price: 0 },
];

const BookTestPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState("");
  const [authLoading, setAuthLoading] = useState(true);
  const [prescriptionFile, setPrescriptionFile] = useState<File | null>(null);
  const [submittedData, setSubmittedData] = useState<any>(null);
  const { toast } = useToast();
  const { cartItems, totalAmount, clearCart } = useCart();

  const preselectedTest = searchParams.get("test");
  const preselectedTests = searchParams.get("tests");
  const preselectedLab = searchParams.get("lab");
  const preselectedTotal = searchParams.get("total");

  const isDirectBooking = !!(preselectedTest || preselectedTests);
  const isCartMode = cartItems.length > 0 && !isDirectBooking;
  const initialTestType = isCartMode
    ? cartItems.map(item => item.name).join(" | ")
    : (preselectedTests ? preselectedTests : (preselectedTest || ""));

  useEffect(() => {
    let isMounted = true;
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        const currentPath = window.location.pathname + window.location.search;
        navigate(`/auth?redirect=${encodeURIComponent(currentPath)}`);
      }
      if (isMounted) {
        setAuthLoading(false);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [navigate]);

  const form = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      gender: "",
      timeSlot: "",
      testType: initialTestType,
      sampleCollection: "home",
      address: "",
      notes: "",
      paymentMethod: "cash",
      scheduleType: "schedule",
    },
  });

  useEffect(() => {
    if (isCartMode) {
      form.setValue("testType", cartItems.map(item => item.name).join(" | "));
    } else if (preselectedTests) {
      form.setValue("testType", preselectedTests);
    } else if (preselectedTest) {
      form.setValue("testType", preselectedTest);
    }
  }, [isCartMode, cartItems, preselectedTests, preselectedTest, form]);

  const selectedTestName = form.watch("testType");
  const selectedTestData = allTestOptions.find(t => t.value === selectedTestName);
  const selectedPrice = isCartMode
    ? totalAmount
    : (preselectedTotal ? parseInt(preselectedTotal) : (selectedTestData?.price || 0));

  const homeFee = selectedPrice > 0 && selectedPrice < 1000 ? 150 : 0;
  const sampleCollection = form.watch("sampleCollection");
  const totalWithFee = sampleCollection === 'home' ? selectedPrice + homeFee : selectedPrice;

  const decodedLabName = decodeURIComponent(preselectedLab || "");
  if (decodedLabName) {
    localStorage.setItem('active_hub_lab', decodedLabName);
  }
  const effectiveLabName = preselectedLab || (isCartMode ? cartItems[0]?.labName : null) || localStorage.getItem('active_hub_lab');

  const onSubmit = async (data: BookingFormData) => {
    setIsSubmitting(true);

    try {
      const refNum = `TB-${Date.now().toString().slice(-8)}`;
      const { data: { session } } = await supabase.auth.getSession();
      const userId = session?.user?.id;

      let prescriptionUrl: string | null = null;
      if (prescriptionFile) {
        const ext = prescriptionFile.name.split('.').pop() || 'pdf';
        const filePath = `${userId}/${refNum}-prescription.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("prescriptions")
          .upload(filePath, prescriptionFile);

        if (uploadError) {
          toast({ title: "Upload Failed", description: "Could not upload prescription. Booking will continue without it.", variant: "destructive" });
        } else {
          prescriptionUrl = filePath;
        }
      }


      const homeFee = data.sampleCollection === 'home' && selectedPrice < 1000 ? 150 : 0;
      const totalAmt = selectedPrice + homeFee;

      const nameParts = data.fullName.trim().split(/\s+/);
      const fName = nameParts[0] || "";
      const lName = nameParts.slice(1).join(" ") || "Patient";
      const uEmail = session?.user?.email || "not-provided@diagnosticshub.com";
      const bookedAtString = format(new Date(), "dd MMM yyyy, hh:mm a");

      const { error } = await supabase.from("appointments").insert({
        first_name: fName,
        last_name: lName,
        email: uEmail,
        phone: data.phone,
        appointment_date: format(data.date, "yyyy-MM-dd"),
        time_slot: data.timeSlot,
        test_type: effectiveLabName ? `${data.testType} [${effectiveLabName}]` : data.testType,
        sample_collection: data.sampleCollection,
        collection_address: data.address || null,
        notes: `[Payment: ${data.paymentMethod === 'cash' ? 'Cash on Collection' : 'Online'}] [Gender: ${data.gender}] [Booked At: ${bookedAtString}] [Base Price: ₹${selectedPrice}] [Fee: ₹${homeFee}] [Total Price: ₹${totalAmt}] ${prescriptionUrl ? `${data.notes || ''}\n[Prescription: ${prescriptionUrl}]`.trim() : (data.notes || null)}`,
        reference_number: refNum,
        status: "pending",
        user_id: session?.user?.id || null,
      });

      if (error) throw error;

      // Sync to Google Sheets
      await syncToGoogleSheets('booking', {
        'ID': refNum,
        'Name': data.fullName,
        'Email': uEmail,
        'Phone': data.phone,
        'Test Type': effectiveLabName ? `${data.testType} [${effectiveLabName}]` : data.testType,
        'Price': totalAmt,
        'Appointment Date': format(data.date, "yyyy-MM-dd"),
        'Appointment Time': data.timeSlot,
        'Address': data.address || 'Lab Visit',
        'Message': `[Payment: ${data.paymentMethod === 'cash' ? 'Cash on Collection' : 'Online'}] [Gender: ${data.gender}] ${data.notes || ''}`.trim(),
        'Status': 'pending',
        'Created At': bookedAtString
      });

      const telegramMsg = `
<b>🆕 New Test Booking!</b>
<b>Ref:</b> ${refNum}
<b>Patient:</b> ${data.fullName}
<b>Gender:</b> ${data.gender}
<b>Phone:</b> ${data.phone}
<b>Payment:</b> ${data.paymentMethod === 'cash' ? 'Cash on Collection' : 'Online'}
<b>Test:</b> ${effectiveLabName ? `${data.testType} [${effectiveLabName}]` : data.testType}
<b>Price:</b> ${formatINR(totalAmt)} ${data.sampleCollection === 'home' ? '(inc. fee)' : ''}
<b>Date:</b> ${format(data.date, "dd MMM yyyy")}
<b>Time:</b> ${data.timeSlot}
<b>Address:</b> ${data.address || 'Lab Visit'}
<b>Booked On:</b> ${bookedAtString}
<b>Notes:</b> ${data.notes || 'None'}
      `.trim();
      await sendTelegramMessage(telegramMsg);

      setReferenceNumber(refNum);
      if (isCartMode) clearCart();

      setSubmittedData({
        refNumber: refNum,
        testName: data.testType,
        price: selectedPrice,
        homeFee: homeFee,
        totalPrice: totalAmt,
        fullName: data.fullName,
        gender: data.gender,
        phone: data.phone,
        date: format(data.date, "dd MMM yyyy"),
        timeSlot: data.timeSlot,
        lab: effectiveLabName || "Diagnostics Hub Partner",
        address: data.address,
        paymentMethod: data.paymentMethod === 'cash' ? 'Cash on Collection' : 'Online Payment',
        bookedAt: bookedAtString,
      });
      setIsSubmitted(true);
      toast({
        title: "Test Booked!",
        description: `Your reference number is ${refNum}`,
      });
    } catch (error: any) {
      toast({
        title: "Booking Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) {
    return (
      <Layout>
        <section className="py-20">
          <div className="container text-center">
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </section>
      </Layout>
    );
  }

  if (isSubmitted) {
    return (
      <Layout>
        <section className="py-12 md:py-20">
          <div className="container max-w-lg px-4">
            <Card>
              <CardContent className="pt-8 text-center">
                <CheckCircle className="h-20 w-20 text-success mx-auto mb-6" />
                <h2 className="text-xl md:text-2xl font-bold text-foreground mb-2">Test Booked Successfully!</h2>
                <p className="text-muted-foreground mb-4 text-sm md:text-base">
                  Your test has been booked. You will receive confirmation shortly.
                </p>
                <div className="bg-muted p-4 rounded-lg mb-4">
                  <p className="text-sm text-muted-foreground mb-1">Reference Number</p>
                  <p className="text-2xl font-bold text-primary">{referenceNumber}</p>
                </div>
                {submittedData && (
                  <div className="bg-muted/50 p-4 rounded-lg mb-4 text-left space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Test:</span>
                      <span className="font-medium text-foreground text-right max-w-[200px] truncate">{submittedData.testName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Test Price:</span>
                      <span className="font-medium text-foreground">{formatINR(submittedData.price)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Home Collection Fee:</span>
                      <span className="font-medium text-foreground">{submittedData.homeFee > 0 ? formatINR(submittedData.homeFee) : 'FREE'}</span>
                    </div>
                    <div className="flex justify-between border-t border-dashed border-muted-foreground/15 pt-2 mt-1">
                      <span className="font-semibold text-slate-800">Total Price:</span>
                      <span className="font-bold text-[#004A99]">{formatINR(submittedData.totalPrice || submittedData.price)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date:</span>
                      <span className="font-medium">{submittedData.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time:</span>
                      <span className="font-medium">{submittedData.timeSlot}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Payment Method:</span>
                      <span className="font-semibold text-emerald-600">{submittedData.paymentMethod}</span>
                    </div>
                    <div className="flex justify-between text-xs border-t border-muted-foreground/15 pt-2 mt-2">
                      <span className="text-slate-400">Booked On:</span>
                      <span className="font-medium text-slate-500">{submittedData.bookedAt}</span>
                    </div>
                    {submittedData.lab && (
                      <div className="flex justify-between border-t border-muted-foreground/15 pt-2 mt-1">
                        <span className="text-muted-foreground">Lab:</span>
                        <span className="font-semibold text-primary">{submittedData.lab}</span>
                      </div>
                    )}
                  </div>
                )}
                <p className="text-sm text-muted-foreground mb-6">
                  Please save this reference number for future inquiries.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button variant="outline" onClick={() => navigate("/dashboard")} className="w-full">
                    Go to Dashboard
                  </Button>
                  <Button variant="outline" onClick={() => navigate("/")} className="w-full">
                    Back to Home
                  </Button>
                </div>
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
        title="Book Test"
        description="Book your diagnostic test at Diagnostics Hub Rewa. Choose from 100+ tests with home sample collection. Easy online booking with instant confirmation."
        canonical="/book-appointment"
        keywords="book lab test rewa, diagnostic test rewa, home sample collection booking Rewa MP, pathology test booking, online blood test booking India"
      />
      {/* Premium page-specific background wrapper */}
      <div className="bg-gradient-to-b from-[#F3F7FA] via-[#E9F0F3] to-[#F1F6F8] min-h-screen relative overflow-hidden pb-16">
        {/* Glow decorative background elements */}
        <div className="absolute top-20 left-10 w-[400px] h-[400px] bg-blue-200/35 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 right-10 w-[400px] h-[400px] bg-emerald-100/25 rounded-full blur-3xl pointer-events-none" />

        {/* Hero */}
        <section className="bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-transparent border-b border-slate-100/40 py-8 md:py-10 relative z-10">
          <div className="container relative px-4 text-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="absolute top-0 left-4 flex items-center gap-1.5 text-slate-500 hover:text-[#004A99] hover:bg-slate-100/60 rounded-full px-3 py-1 transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Back</span>
            </Button>
            <h1 className="text-2xl md:text-3xl font-black text-[#003B73] mb-3 tracking-tight">Book Your Test</h1>
            <p className="text-slate-500 max-w-2xl mx-auto text-xs md:text-sm">
              Select your test, choose a date & time, and book home sample collection.
            </p>
          </div>
        </section>

      <section className="py-8 md:py-12 relative z-10">
        <div className="container max-w-3xl px-4">
          <Card className="border-white/80 bg-white/90 backdrop-blur-md shadow-xl shadow-blue-900/5 rounded-3xl border">
            <CardHeader className="border-b border-slate-100 pb-5">
              <CardTitle className="flex items-center gap-2 text-lg md:text-xl font-black text-slate-800">
                <TestTube2 className="h-5 w-5 text-[#004A99] animate-pulse" />
                Booking Details
              </CardTitle>
              <CardDescription className="text-slate-500">
                Fill in your details below to schedule your home sample collection.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {/* Test Selection - moved to top */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-foreground flex items-center gap-2">
                      <TestTube2 className="h-4 w-4 text-primary" />
                      {isCartMode ? "Tests from Cart" : "Select Test"}
                    </h3>

                    {isCartMode ? (
                      <div className="p-5 rounded-2xl border border-slate-100 bg-white/60 shadow-sm">
                        <ul className="space-y-2 mb-3">
                          {cartItems.map(item => (
                            <li key={item.id} className="flex justify-between text-sm">
                              <span className="font-medium text-slate-700">{item.name}</span>
                              <span className="text-slate-500 font-semibold">{formatINR(item.discountPrice || item.price)}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="pt-3 border-t border-slate-100 flex justify-between font-black text-slate-800">
                          <span>Total Tests Cost</span>
                          <span className="text-[#004A99]">{formatINR(totalAmount)}</span>
                        </div>
                        <input type="hidden" {...form.register("testType")} value={initialTestType} />
                      </div>
                    ) : (
                      <FormField
                        control={form.control}
                        name="testType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Test / Package</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select test or package" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="max-h-60">
                                {allTestOptions.map((test) => (
                                  <SelectItem key={test.value} value={test.value}>
                                    <span className="flex items-center justify-between gap-2 w-full">
                                      <span>{test.label}</span>
                                      <span className="text-primary font-semibold ml-2">{formatINR(test.price)}</span>
                                    </span>
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}

                    {/* Price display */}
                    {selectedPrice > 0 && (
                      <div className="p-4 rounded-lg border-2 border-primary/30 bg-primary/5">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-foreground text-sm">Test Price Summary</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-bold text-primary">{formatINR(selectedPrice)}</p>
                            {sampleCollection === 'home' && (
                              <>
                                <p className="text-xs text-muted-foreground">+{formatINR(homeFee)} home collection fee</p>
                                <p className="text-xs text-muted-foreground font-bold">Total: {formatINR(totalWithFee)}</p>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="space-y-6">
                    <h3 className="font-bold text-lg text-slate-800 pb-2 border-b border-slate-100">Personal Information</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                      <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold uppercase tracking-wider text-[#004A99] font-black">Full Name *</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter patient's full name" 
                                className="h-11 shadow-sm rounded-xl border-l-4 border-l-[#004A99] border-blue-200 bg-blue-50/20 font-semibold text-slate-800 focus-visible:ring-primary/25 focus-visible:border-primary focus-visible:bg-white transition-all duration-300 shadow-[0_0_15px_rgba(59,130,246,0.06)]" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Mobile Number</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="Enter 10-digit mobile number" 
                                className="h-11 shadow-sm rounded-xl focus-visible:ring-primary/20 focus-visible:border-primary" 
                                {...field} 
                                onChange={(e) => {
                                  // Allow only digits and limit to 10 characters
                                  const value = e.target.value.replace(/\D/g, "");
                                  if (value.length <= 10) {
                                    field.onChange(value);
                                  }
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                      <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Gender</FormLabel>
                            <Select onValueChange={field.onChange} value={field.value}>
                              <FormControl>
                                <SelectTrigger className="h-11 shadow-sm rounded-xl focus:ring-primary/20 focus:border-primary">
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent className="rounded-xl">
                                <SelectItem value="Male">Male</SelectItem>
                                <SelectItem value="Female">Female</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  {/* Schedule */}
                  <div className="space-y-6 pt-4">
                    <h3 className="font-bold text-lg text-slate-800 pb-2 border-b border-slate-100">Schedule Details</h3>
                    
                    <FormField
                      control={form.control}
                      name="scheduleType"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Choose Booking Mode</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={(val) => {
                                field.onChange(val);
                                if (val === "urgent") {
                                  // Pre-fill today's date and urgent time slot
                                  form.setValue("date", new Date());
                                  form.setValue("timeSlot", "Urgent (ASAP - within 2 hours)");
                                } else {
                                  form.setValue("date", undefined as any);
                                  form.setValue("timeSlot", "");
                                }
                              }}
                              defaultValue={field.value}
                              className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                            >
                              <FormItem>
                                <FormControl>
                                  <label
                                    className={cn(
                                      "flex items-start gap-3 p-4 rounded-2xl border cursor-pointer hover:bg-slate-50/50 transition-all",
                                      field.value === "urgent" 
                                        ? "border-amber-500 bg-amber-50/20 shadow-sm ring-2 ring-amber-500/10" 
                                        : "border-slate-200 bg-white"
                                    )}
                                  >
                                    <RadioGroupItem value="urgent" className="mt-1 text-amber-600 border-amber-300 focus:ring-amber-500" />
                                    <div className="space-y-1">
                                      <p className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                                        <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                                        Urgent (ASAP)
                                      </p>
                                      <p className="text-xs text-slate-500 leading-relaxed">Book for today. Our phlebotomist will arrive at your home within 60-90 minutes.</p>
                                    </div>
                                  </label>
                                </FormControl>
                              </FormItem>
                              <FormItem>
                                <FormControl>
                                  <label
                                    className={cn(
                                      "flex items-start gap-3 p-4 rounded-2xl border cursor-pointer hover:bg-slate-50/50 transition-all",
                                      field.value === "schedule" 
                                        ? "border-[#004A99] bg-blue-50/20 shadow-sm ring-2 ring-blue-500/10" 
                                        : "border-slate-200 bg-white"
                                    )}
                                  >
                                    <RadioGroupItem value="schedule" className="mt-1" />
                                    <div className="space-y-1">
                                      <p className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                                        Schedule for Later
                                      </p>
                                      <p className="text-xs text-slate-500 leading-relaxed">Select a preferred date and time slot for sample collection.</p>
                                    </div>
                                  </label>
                                </FormControl>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {form.watch("scheduleType") === "schedule" && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5 pt-2">
                        <FormField
                          control={form.control}
                          name="date"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Preferred Date</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant="outline"
                                      className={cn(
                                        "w-full pl-3 h-11 text-left font-normal shadow-sm rounded-xl border-slate-200 hover:bg-slate-50/50 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? format(field.value, "PPP") : "Pick a date"}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50 text-slate-500" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0 rounded-2xl shadow-xl border border-slate-100" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) => {
                                      const today = new Date();
                                      today.setHours(0, 0, 0, 0);
                                      return date < today || date.getDay() === 0;
                                    }}
                                    initialFocus
                                    className="pointer-events-auto"
                                  />
                                </PopoverContent>
                              </Popover>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="timeSlot"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Time Slot</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="h-11 shadow-sm rounded-xl border-slate-200 focus:ring-primary/20 focus:border-primary">
                                    <SelectValue placeholder="Select time" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="rounded-xl">
                                  {timeSlots.map((slot) => (
                                    <SelectItem key={slot} value={slot}>
                                      {slot}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </div>
 
                  {/* Home Collection */}
                  <div className="space-y-4">
                    <div className="p-5 rounded-2xl border border-blue-500/20 bg-gradient-to-r from-blue-500/5 to-indigo-500/5 relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />
                      <div className="flex items-center gap-3 relative z-10">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100/50">
                          <Home className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-bold text-slate-800 text-sm md:text-base">Home Sample Collection</p>
                          <p className="text-xs md:text-sm text-slate-500 leading-normal">Our phlebotomist will visit your location ({homeFee > 0 ? `+${formatINR(homeFee)} service fee` : 'FREE home collection'})</p>
                        </div>
                      </div>
                    </div>
                    <input type="hidden" {...form.register("sampleCollection")} value="home" />
 
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Collection Address <span className="text-destructive">*</span></FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter your full address for home sample collection"
                              className="min-h-[100px] rounded-xl shadow-sm border-slate-200 focus-visible:ring-primary/20 focus-visible:border-primary resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
 
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground/80">Additional Notes (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Any special instructions or requirements..."
                              className="min-h-[80px] rounded-xl shadow-sm border-slate-200 focus-visible:ring-primary/20 focus-visible:border-primary resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
 
                  {/* Upload Prescription PDF */}
                  <div className="p-5 rounded-2xl border border-slate-200/60 bg-slate-50/50">
                    <p className="text-sm font-medium text-foreground mb-1 flex items-center gap-2">
                      <FileUp className="h-4 w-4 text-primary" />
                      Upload Prescription (Optional)
                    </p>
                    <p className="text-xs text-muted-foreground mb-3">Upload your doctor's prescription (PDF or Image, max 5MB)</p>
                    {prescriptionFile ? (
                      <div className="flex items-center gap-2 p-2 bg-card rounded border">
                        <FileText className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-sm text-foreground truncate flex-1">{prescriptionFile.name}</span>
                        <button
                          type="button"
                          onClick={() => setPrescriptionFile(null)}
                          className="text-muted-foreground hover:text-destructive"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <label className="flex items-center justify-center gap-2 w-full p-3 border-2 border-dashed border-muted-foreground/30 rounded-lg cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-colors">
                        <Upload className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Click to select PDF or Image</span>
                        <input
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png,.webp"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              if (file.size > 5 * 1024 * 1024) {
                                toast({ title: "File too large", description: "Maximum file size is 5MB", variant: "destructive" });
                                return;
                              }
                              const validTypes = ["application/pdf", "image/jpeg", "image/png", "image/webp"];
                              if (!validTypes.includes(file.type)) {
                                toast({ title: "Invalid file", description: "Please upload a PDF or image file", variant: "destructive" });
                                return;
                              }
                              setPrescriptionFile(file);
                            }
                          }}
                        />
                      </label>
                    )}
                  </div>

                  {/* Payment Method Option */}
                  <div className="space-y-4 pt-2">
                    <h3 className="font-bold text-slate-800 text-sm md:text-base flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-[#004A99]" />
                      Payment Method
                    </h3>
                    <div className="flex items-start gap-3 p-5 rounded-2xl border border-emerald-500/20 bg-emerald-50/10 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center border border-emerald-100/50 flex-shrink-0">
                        <Banknote className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div className="space-y-1 relative z-10">
                        <p className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
                          Cash on Collection
                        </p>
                        <p className="text-xs md:text-sm text-slate-500 leading-normal">Pay cash or scan any UPI app (PhonePe, Paytm, GooglePay) directly to our phlebotomist when they collect your blood sample.</p>
                      </div>
                    </div>
                    {/* Retain form value state for paymentMethod = "cash" */}
                    <input type="hidden" {...form.register("paymentMethod")} value="cash" />
                  </div>

                  {/* Total Summary */}
                  {selectedPrice > 0 && (
                    <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                      <div className="flex justify-between items-center text-sm mb-1">
                        <span className="text-muted-foreground">Test Price</span>
                        <span>{formatINR(selectedPrice)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm font-medium text-slate-600">
                        <span>Home Collection Fee</span>
                        <span>{sampleCollection === 'home' ? (homeFee > 0 ? formatINR(homeFee) : 'FREE') : formatINR(0)}</span>
                      </div>
                      <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-sm font-bold text-slate-800">
                        <span>Total Amount</span>
                        <span className="text-xl font-bold text-primary">{formatINR(totalWithFee)}</span>
                      </div>

                      <Button 
                        type="submit" 
                        className="w-full mt-6 bg-[#004A99] hover:bg-[#003B73] h-12 text-[15px] rounded-lg font-semibold"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Booking..." : `Book Test${selectedPrice > 0 ? ` - ${formatINR(totalWithFee)}` : ''}`}
                      </Button>
                    </div>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </section>
      </div>
    </Layout>
  );
};

export default BookTestPage;
