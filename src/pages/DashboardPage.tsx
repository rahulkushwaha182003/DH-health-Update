import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/SEOHead";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Calendar, FileText, User, LogOut, Clock, CheckCircle, AlertCircle,
  Loader2, Plus, Settings, Pencil, Save, X, TestTube2,
  Activity, Phone, MapPin, RefreshCw, IndianRupee, Download, CreditCard, Building2
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { tests, packages, formatINR } from "@/data/testsData";

const allTestOptions = [
  ...tests.map(t => ({ value: t.name, price: t.price })),
  ...packages.map(p => ({ value: p.name, price: p.price })),
];

const lookupTestPrice = (testType: string): number => {
  // testType may contain lab name like "CBC (Dr. Lal Path Lab)", strip it
  const cleanName = testType.replace(/\s*\(.*\)\s*$/, '').trim();
  const found = allTestOptions.find(t => t.value === cleanName || testType.startsWith(t.value));
  return found?.price || 0;
};

interface Appointment {
  id: string;
  reference_number: string;
  appointment_date: string;
  time_slot: string;
  test_type: string;
  status: string;
  results_status: string;
  created_at: string;
  first_name: string;
  last_name: string;
  sample_collection: string;
  notes?: string | null;
  collection_address?: string | null;
}

interface Report {
  id: string;
  report_number: string;
  report_date: string;
  file_url: string | null;
  report_status: string | null;
  test_results: string;
  appointment_id: string;
}

interface Inquiry {
  id: string;
  reference_number: string;
  inquiry_type: string;
  subject: string | null;
  status: string;
  created_at: string;
  admin_response: string | null;
}

interface TestBooking {
  id: string;
  reference_number: string;
  test_name: string;
  test_category: string;
  test_price: number;
  preferred_date: string;
  preferred_time: string;
  status: string;
  sample_collection: string;
  created_at: string | null;
  patient_name: string;
  patient_email: string;
  patient_phone: string;
  patient_address: string;
}

interface Profile {
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  date_of_birth: string | null;
}

interface BookingDetails {
  gender?: string;
  paymentMethod?: string;
  collectionAddress?: string;
  userNotes?: string;
  basePrice?: string | number;
  homeFee?: string | number;
  totalPrice?: string | number;
}

const getPriceFromNotesOrLookup = (notes: string | null | undefined, testType: string): string | number => {
  if (notes) {
    const totalPriceMatch = notes.match(/\[Total Price:\s*₹?(\d+)\]/i);
    if (totalPriceMatch && totalPriceMatch[1]) {
      return parseInt(totalPriceMatch[1]);
    }
    const basePriceMatch = notes.match(/\[Base Price:\s*₹?(\d+)\]/i);
    if (basePriceMatch && basePriceMatch[1]) {
      return parseInt(basePriceMatch[1]);
    }
  }

  const cleanTestType = testType.split(' [')[0];
  const individualTests = cleanTestType.split(' | ');
  let calculatedPrice = 0;
  let hasValidLookup = false;

  for (const tName of individualTests) {
    const trimmedName = tName.trim().toLowerCase();
    const found = allTestOptions.find(opt => {
      const optVal = opt.value.toLowerCase();
      return optVal === trimmedName || trimmedName.startsWith(optVal) || optVal.startsWith(trimmedName);
    });
    if (found) {
      calculatedPrice += found.price;
      hasValidLookup = true;
    }
  }

  if (hasValidLookup) {
    return calculatedPrice;
  }

  const singleLookup = lookupTestPrice(testType);
  if (singleLookup > 0) {
    return singleLookup;
  }

  return "N/A";
};

const parseBookingNotes = (notes: string | null | undefined, collectionAddress: string | null | undefined, testType: string): BookingDetails | null => {
  const details: BookingDetails = {};
  let hasDetails = false;

  if (collectionAddress) {
    details.collectionAddress = collectionAddress;
    hasDetails = true;
  }

  let parsedBase = 0;
  let parsedFee = 0;
  let parsedTotal = 0;

  if (notes) {
    const genderMatch = notes.match(/\[Gender:\s*([^\]]+)\]/i);
    if (genderMatch && genderMatch[1]) {
      details.gender = genderMatch[1].trim();
      hasDetails = true;
    }

    const paymentMatch = notes.match(/\[Payment:\s*([^\]]+)\]/i);
    if (paymentMatch && paymentMatch[1]) {
      details.paymentMethod = paymentMatch[1].trim();
      hasDetails = true;
    }

    const baseMatch = notes.match(/\[Base Price:\s*₹?(\d+)\]/i);
    if (baseMatch && baseMatch[1]) {
      parsedBase = parseInt(baseMatch[1]);
      details.basePrice = parsedBase;
      hasDetails = true;
    }

    const feeMatch = notes.match(/\[Fee:\s*₹?(\d+)\]/i);
    if (feeMatch && feeMatch[1]) {
      parsedFee = parseInt(feeMatch[1]);
      details.homeFee = parsedFee;
      hasDetails = true;
    }

    const totalMatch = notes.match(/\[Total Price:\s*₹?(\d+)\]/i);
    if (totalMatch && totalMatch[1]) {
      parsedTotal = parseInt(totalMatch[1]);
      details.totalPrice = parsedTotal;
      hasDetails = true;
    }

    let userNotes = notes;
    userNotes = userNotes.replace(/\[Payment:[^\]]+\]/gi, '');
    userNotes = userNotes.replace(/\[Gender:[^\]]+\]/gi, '');
    userNotes = userNotes.replace(/\[Booked At:[^\]]+\]/gi, '');
    userNotes = userNotes.replace(/\[Base Price:[^\]]+\]/gi, '');
    userNotes = userNotes.replace(/\[Fee:[^\]]+\]/gi, '');
    userNotes = userNotes.replace(/\[Total Price:[^\]]+\]/gi, '');
    userNotes = userNotes.replace(/\[Prescription:[^\]]+\]/gi, '');
    
    const cleanedNotes = userNotes.replace(/\s+/g, ' ').trim();
    if (cleanedNotes && cleanedNotes !== 'null' && cleanedNotes !== 'undefined') {
      details.userNotes = cleanedNotes;
      hasDetails = true;
    }
  }

  if (!details.basePrice) {
    const cleanTestType = testType.split(' [')[0];
    const individualTests = cleanTestType.split(' | ');
    let calculatedPrice = 0;
    let hasValidLookup = false;

    for (const tName of individualTests) {
      const trimmedName = tName.trim().toLowerCase();
      const found = allTestOptions.find(opt => {
        const optVal = opt.value.toLowerCase();
        return optVal === trimmedName || trimmedName.startsWith(optVal) || optVal.startsWith(trimmedName);
      });
      if (found) {
        calculatedPrice += found.price;
        hasValidLookup = true;
      }
    }

    if (hasValidLookup) {
      details.basePrice = calculatedPrice;
      details.homeFee = calculatedPrice < 1000 ? 150 : 0;
      details.totalPrice = calculatedPrice + (calculatedPrice < 1000 ? 150 : 0);
      hasDetails = true;
    }
  }

  return hasDetails ? details : null;
};

const statusConfig: Record<string, { className: string; icon: typeof Clock }> = {
  pending: { className: "bg-warning/15 text-warning border-warning/30", icon: Clock },
  confirmed: { className: "bg-primary/15 text-primary border-primary/30", icon: CheckCircle },
  completed: { className: "bg-success/15 text-success border-success/30", icon: CheckCircle },
  cancelled: { className: "bg-destructive/15 text-destructive border-destructive/30", icon: X },
  in_progress: { className: "bg-primary/15 text-primary border-primary/30", icon: Activity },
  processing: { className: "bg-primary/15 text-primary border-primary/30", icon: Clock },
  ready: { className: "bg-success/15 text-success border-success/30", icon: CheckCircle },
  no_show: { className: "bg-muted text-muted-foreground border-border", icon: AlertCircle },
};

const StatusBadge = ({ status }: { status: string }) => {
  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;
  return (
    <Badge variant="outline" className={`${config.className} gap-1 capitalize font-medium text-xs`}>
      <Icon className="h-3 w-3" />
      {status.replace("_", " ")}
    </Badge>
  );
};

const BookingRow = ({
  title, date, time, refNumber, status, price, resultsStatus, extra, badge, reportUrl, onDownloadReport, details
}: {
  title: string; date: string; time: string; refNumber: string; status: string;
  price?: number | string; resultsStatus?: string | null; extra?: string; badge?: React.ReactNode;
  reportUrl?: string | null; onDownloadReport?: () => void;
  details?: BookingDetails | null;
}) => {
  const labMatch = title.match(/\[([^\]]+)\]$/);
  const labName = labMatch ? labMatch[1] : null;
  const cleanTitle = title.replace(/\s*\[[^\]]+\]$/, '');

  const testList = (cleanTitle || "").split(' | ');
  let patientName = extra ? extra.replace('Patient: ', '') : "N/A";
  // Clean up fallback last name "Patient" if it was appended
  if (patientName.endsWith(" Patient")) {
    patientName = patientName.slice(0, -8);
  }
  
  return (
    <div className="p-5 sm:p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:border-primary/30 transition-all duration-300 group">
      <div className="flex flex-col gap-6">
        {/* Top Header: Patient & Status */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-[10px] uppercase font-bold text-primary tracking-widest px-2 py-0.5 bg-primary/10 rounded-md">Patient</span>
              <StatusBadge status={status} />
              {badge}
              {labName && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200/50 text-xs font-bold px-2 py-0.5 rounded-md">
                  {labName}
                </Badge>
              )}
            </div>
            <h3 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight group-hover:text-primary transition-colors">
              {patientName}
            </h3>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto mt-2 sm:mt-0">
            {resultsStatus === "ready" && reportUrl && onDownloadReport && (
              <Button 
                onClick={onDownloadReport}
                className="w-full sm:w-auto bg-success hover:bg-success/90 text-white shadow-lg shadow-success/15 h-12 px-6 rounded-2xl gap-2 font-bold"
              >
                <Download className="h-4 w-4" />
                Download Report
              </Button>
            )}
            {price !== undefined && (
              <div className="bg-slate-50 border border-slate-200 px-5 py-3 rounded-2xl flex items-center justify-center gap-2 shadow-inner">
                <span className="text-slate-900 font-black text-xl flex items-center">
                  <IndianRupee className="h-5 w-5" />
                  {typeof price === 'number' ? price.toLocaleString('en-IN') : price}
                </span>
              </div>
            )}

          </div>
        </div>

        {/* Content: Test List */}
        <div className="bg-primary/[0.02] rounded-2xl p-4 sm:p-5 border border-primary/5">
          <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 border-b border-primary/10 pb-2">Diagnostic Tests & Packages</p>
          <ul className="grid sm:grid-cols-2 gap-3">
            {testList.map((test, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm md:text-base font-bold text-slate-700 leading-tight">
                <div className="h-6 w-6 rounded-lg bg-white border border-primary/20 text-primary text-[11px] flex items-center justify-center shrink-0 shadow-sm">
                  {idx + 1}
                </div>
                <span className="pt-0.5">{test.split(' [')[0]}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Booking Details Section */}
        {details && (details.gender || details.paymentMethod || details.collectionAddress || details.userNotes || details.basePrice !== undefined || details.homeFee !== undefined) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-slate-50/50 p-4 rounded-xl border border-slate-100 text-xs font-semibold text-slate-600">
            {details.gender && (
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-slate-400 shrink-0" />
                <div>
                  <span className="text-slate-400 uppercase tracking-wider block text-[9px] leading-none mb-1">Gender</span>
                  <span className="text-slate-800 font-bold leading-normal">{details.gender}</span>
                </div>
              </div>
            )}
            {details.paymentMethod && (
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-slate-400 shrink-0" />
                <div>
                  <span className="text-slate-400 uppercase tracking-wider block text-[9px] leading-none mb-1">Payment Method</span>
                  <span className="text-slate-800 font-bold leading-normal">{details.paymentMethod}</span>
                </div>
              </div>
            )}
            {details.basePrice !== undefined && (
              <div className="flex items-center gap-2">
                <IndianRupee className="h-4 w-4 text-slate-400 shrink-0" />
                <div>
                  <span className="text-slate-400 uppercase tracking-wider block text-[9px] leading-none mb-1">Test Price</span>
                  <span className="text-slate-800 font-bold leading-normal">
                    {typeof details.basePrice === 'number' ? `₹${details.basePrice.toLocaleString('en-IN')}` : details.basePrice}
                  </span>
                </div>
              </div>
            )}
            {details.homeFee !== undefined && (
              <div className="flex items-center gap-2">
                <IndianRupee className="h-4 w-4 text-slate-400 shrink-0" />
                <div>
                  <span className="text-slate-400 uppercase tracking-wider block text-[9px] leading-none mb-1">Home Collection Fee</span>
                  <span className="text-slate-800 font-bold leading-normal">
                    {Number(details.homeFee) > 0 ? `₹${details.homeFee}` : "FREE"}
                  </span>
                </div>
              </div>
            )}
            {details.collectionAddress && (
              <div className="flex items-start gap-2 sm:col-span-2">
                <MapPin className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 uppercase tracking-wider block text-[9px] leading-none mb-1">Collection Address</span>
                  <span className="text-slate-800 font-bold leading-normal break-words">{details.collectionAddress}</span>
                </div>
              </div>
            )}
            {details.userNotes && (
              <div className="flex items-start gap-2 sm:col-span-2 md:col-span-3">
                <FileText className="h-4 w-4 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-400 uppercase tracking-wider block text-[9px] leading-none mb-1">Notes / Special Instructions</span>
                  <span className="text-slate-800 font-bold italic leading-normal">{details.userNotes}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Bottom Bar: Meta Info */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-2">
          <div className="flex flex-wrap items-center gap-y-4 gap-x-8">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200/50">
                <Calendar className="h-5 w-5 text-slate-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-black text-slate-400 leading-none mb-1">Date</span>
                <span className="text-[13px] font-extrabold text-slate-800">{new Date(date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200/50">
                <Clock className="h-5 w-5 text-slate-500" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-black text-slate-400 leading-none mb-1">Timeslot</span>
                <span className="text-[13px] font-extrabold text-slate-800">{time}</span>
              </div>
            </div>

            {labName && (
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center border border-blue-100">
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-black text-slate-400 leading-none mb-1">Lab</span>
                  <span className="text-[13px] font-extrabold text-slate-800">{labName}</span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-black text-primary/70 leading-none mb-1">Ref ID</span>
                <span className="text-[13px] font-black text-primary">{refNumber}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {resultsStatus === "ready" && (
              <Badge className="bg-success/90 text-white border-none gap-1.5 px-3 py-1 text-xs font-bold rounded-full">
                <CheckCircle className="h-3.5 w-3.5" /> Results Ready
              </Badge>
            )}
            {resultsStatus === "processing" && (
              <Badge className="bg-primary/90 text-white border-none gap-1.5 px-3 py-1 text-xs font-bold rounded-full">
                <Clock className="h-3.5 w-3.5" /> Processing
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ─── Profile Section ─── */
const ProfileSection = ({ profile, user, onProfileUpdate }: { profile: Profile | null; user: any; onProfileUpdate: (p: Profile) => void }) => {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    first_name: "", last_name: "", phone: "", address: "", date_of_birth: ""
  });
  const { toast } = useToast();

  useEffect(() => {
    setForm({
      first_name: profile?.first_name || "",
      last_name: profile?.last_name || "",
      phone: profile?.phone || "",
      address: profile?.address || "",
      date_of_birth: profile?.date_of_birth || "",
    });
  }, [profile]);

  const handleSave = async () => {
    if (!user?.id) return;
    setSaving(true);
    const updates = {
      first_name: form.first_name.trim() || null,
      last_name: form.last_name.trim() || null,
      phone: form.phone.trim() || null,
      address: form.address.trim() || null,
      date_of_birth: form.date_of_birth || null,
    };
    const { error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("user_id", user.id);
    setSaving(false);
    if (error) {
      toast({ title: "Error", description: "Profile update failed.", variant: "destructive" });
    } else {
      toast({ title: "✅ Profile Updated" });
      onProfileUpdate({ ...profile, ...updates, email: profile?.email || null });
      setEditing(false);
    }
  };

  const fields = [
    { key: "first_name", label: "First Name", type: "text", icon: User },
    { key: "last_name", label: "Last Name", type: "text", icon: User },
    { key: "phone", label: "Phone", type: "tel", icon: Phone },
    { key: "address", label: "Address", type: "text", icon: MapPin },
    { key: "date_of_birth", label: "Date of Birth", type: "date", icon: Calendar },
  ];

  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5 text-primary" />
            My Profile
          </CardTitle>
          <CardDescription>Your account information</CardDescription>
        </div>
        {!editing ? (
          <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
            <Pencil className="h-4 w-4 mr-1.5" /> Edit Profile
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => { setEditing(false); setForm({ first_name: profile?.first_name || "", last_name: profile?.last_name || "", phone: profile?.phone || "", address: profile?.address || "", date_of_birth: profile?.date_of_birth || "" }); }}>
              <X className="h-4 w-4 mr-1.5" /> Cancel
            </Button>
            <Button size="sm" onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 mr-1.5 animate-spin" /> : <Save className="h-4 w-4 mr-1.5" />}
              Save
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 bg-muted/50 rounded-xl border border-border/30">
            <p className="text-xs font-medium text-muted-foreground mb-1.5">Email</p>
            <p className="font-medium text-foreground text-sm break-all">{user?.email || profile?.email || "Not set"}</p>
          </div>
          {fields.map(f => (
            editing ? (
              <div key={f.key} className="space-y-1.5">
                <Label htmlFor={f.key} className="text-xs font-medium">{f.label}</Label>
                <Input
                  id={f.key}
                  type={f.type}
                  value={(form as any)[f.key]}
                  onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))}
                  className="h-10"
                  placeholder={`Enter ${f.label.toLowerCase()}`}
                />
              </div>
            ) : (
              <div key={f.key} className="p-4 bg-muted/50 rounded-xl border border-border/30">
                <p className="text-xs font-medium text-muted-foreground mb-1.5">{f.label}</p>
                <p className="font-medium text-foreground text-sm">
                  {(profile as any)?.[f.key] || <span className="text-muted-foreground italic">Not set</span>}
                </p>
              </div>
            )
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

/* ─── Main Dashboard ─── */
const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, isAdmin, signOut } = useAuth();
  const { toast } = useToast();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [testBookings, setTestBookings] = useState<TestBooking[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      const hasAuthParams = 
        window.location.hash.includes("access_token=") || 
        window.location.hash.includes("error_description=") ||
        window.location.search.includes("code=") ||
        window.location.search.includes("type=recovery");
      
      if (hasAuthParams) {
        return;
      }

      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  const fetchData = useCallback(async () => {
    if (!user) {
      return;
    }
    setLoading(true);
    try {
      const email = user.email || "";
      
      // Determine queries based on presence of email
      const aptsPromise = email 
        ? supabase.from("appointments").select("*").or(`email.eq.${email},user_id.eq.${user.id}`).order("created_at", { ascending: false })
        : supabase.from("appointments").select("*").eq("user_id", user.id).order("created_at", { ascending: false });

      const inqPromise = email
        ? supabase.from("inquiries").select("*").or(`email.eq.${email},user_id.eq.${user.id}`).order("created_at", { ascending: false })
        : supabase.from("inquiries").select("*").eq("user_id", user.id).order("created_at", { ascending: false });

      const bookingsPromise = email
        ? supabase.from("test_bookings").select("*").eq("patient_email", email).order("created_at", { ascending: false })
        : Promise.resolve({ data: [] });

      const [aptsRes, inqRes, bookingsRes, profileRes] = await Promise.all([
        aptsPromise,
        inqPromise,
        bookingsPromise,
        supabase.from("profiles").select("first_name, last_name, email, phone, address, date_of_birth").eq("user_id", user.id).maybeSingle(),
      ]);

      const userApts = aptsRes.data || [];
      const aptIds = userApts.map(a => a.id);

      let reportsData: Report[] = [];
      if (aptIds.length > 0) {
        const { data: reportsRes, error: reportsError } = await supabase
          .from("reports")
          .select("*")
          .in("appointment_id", aptIds)
          .order("created_at", { ascending: false });
        if (reportsError) {
          console.error("Error fetching reports:", reportsError);
        }
        reportsData = reportsRes || [];
      }

      setAppointments(userApts);
      setInquiries(inqRes.data || []);
      setReports(reportsData);
      setTestBookings(bookingsRes.data || []);
      setProfile(profileRes.data);
    } catch (error) {
      console.error("[DashboardPage] fetchData caught exception:", error);
      toast({ title: "Error", description: "Failed to load data.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [user, toast]);

  useEffect(() => {
    if (user) fetchData();
  }, [user, fetchData]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
    toast({ title: "Signed out", description: "You have been signed out successfully." });
  };

  const handleDownloadReport = async (fileUrl: string) => {
    if (!fileUrl) return;
    try {
      const { data, error } = await supabase.storage
        .from('medical-reports')
        .createSignedUrl(fileUrl, 300);
      
      if (data?.signedUrl) {
        window.open(data.signedUrl, '_blank');
      } else {
        throw error || new Error("Failed to generate link");
      }
    } catch (err) {
      toast({ title: "Error", description: "Could not download report.", variant: "destructive" });
    }
  };

  if (authLoading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  const resultsReady = appointments.filter(a => a.results_status === "ready").length;

  return (
    <Layout>
      <SEOHead
        title="My Bookings"
        description="View your test bookings, reports and profile at Diagnostics Hub Rewa."
        canonical="/dashboard"
        keywords="patient dashboard, diagnostic reports, test bookings, pathology lab rewa"
      />

      <section className="py-6 md:py-10 bg-gradient-to-b from-primary/5 to-background min-h-[calc(100vh-200px)]">
        <div className="container max-w-6xl px-4">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                Welcome, DiagnosticsHub
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Manage your test bookings, reports & profile
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" size="sm" onClick={fetchData} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-1.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
              </Button>
              {isAdmin && (
                <Button variant="outline" size="sm" asChild>
                  <Link to="/admin">
                    <Settings className="h-4 w-4 mr-1.5" /> Admin
                  </Link>
                </Button>
              )}
              <Button variant="outline" size="sm" onClick={handleSignOut} className="text-destructive border-destructive/30 hover:bg-destructive/10">
                <LogOut className="h-4 w-4 mr-1.5" /> Sign Out
              </Button>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap gap-2 mb-6">
            <Button asChild size="sm">
              <Link to="/tests"><Plus className="h-4 w-4 mr-1.5" /> Book Test</Link>
            </Button>
            <Button asChild size="sm" variant="secondary">
              <Link to="/tests"><TestTube2 className="h-4 w-4 mr-1.5" /> Browse Tests</Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link to="/results-inquiry"><FileText className="h-4 w-4 mr-1.5" /> Result Inquiry</Link>
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
            {[
              { label: "Bookings", count: appointments.length + testBookings.length, icon: Calendar, color: "text-primary", bg: "bg-primary/10" },
              { label: "Reports", count: reports.length, icon: FileText, color: "text-accent-foreground", bg: "bg-accent" },
              { label: "Results Ready", count: resultsReady, icon: CheckCircle, color: "text-success", bg: "bg-success/10" },
            ].map((stat, index) => (
              <Card key={`${stat.label}-${index}`} className="border-border/40">
                <CardContent className="p-3 sm:p-4 flex items-center gap-3">
                  <div className={`h-9 w-9 sm:h-10 sm:w-10 rounded-xl ${stat.bg} flex items-center justify-center flex-shrink-0`}>
                    <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-lg sm:text-xl font-bold text-foreground">{stat.count}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{stat.label}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tabs */}
          <Tabs defaultValue="bookings" className="space-y-4">
            <TabsList className="w-full grid grid-cols-3 h-auto gap-0.5 p-1 bg-muted/60">
              <TabsTrigger value="bookings" className="gap-1 text-[10px] sm:text-sm py-2 px-1 sm:px-3 flex-col sm:flex-row">
                <Calendar className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
                <span>Bookings</span>
                {(appointments.length + testBookings.length) > 0 && (
                  <Badge variant="secondary" className="h-4 min-w-[16px] p-0 justify-center text-[9px] rounded-full hidden sm:flex">{appointments.length + testBookings.length}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="inquiries" className="gap-1 text-[10px] sm:text-sm py-2 px-1 sm:px-3 flex-col sm:flex-row">
                <FileText className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
                <span>Inquiries</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="gap-1 text-[10px] sm:text-sm py-2 px-1 sm:px-3 flex-col sm:flex-row">
                <User className="h-4 w-4 sm:h-3.5 sm:w-3.5" />
                <span>Profile</span>
              </TabsTrigger>
            </TabsList>

            {/* All Bookings Tab (merged) */}
            <TabsContent value="bookings">
              <Card className="border-border/40">
                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-primary" />
                      My Bookings
                    </CardTitle>
                    <CardDescription>All your test bookings in one place</CardDescription>
                  </div>
                  <Button asChild size="sm">
                    <Link to="/tests">
                      <Plus className="h-4 w-4 mr-1.5" /> Book Test
                    </Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-12"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /></div>
                  ) : (appointments.length === 0 && testBookings.length === 0) ? (
                    <div className="text-center py-12">
                      <Calendar className="h-14 w-14 mx-auto text-muted-foreground/40 mb-3" />
                      <p className="text-muted-foreground font-medium mb-1">No bookings yet</p>
                      <p className="text-xs text-muted-foreground mb-4">Book your first test to get started</p>
                      <Button asChild size="sm"><Link to="/tests">Book Test</Link></Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {appointments.map(apt => {
                        const report = reports.find(r => r.appointment_id === apt.id);
                        const parsedDetails = parseBookingNotes(apt.notes, apt.collection_address, apt.test_type);
                        const parsedPrice = parsedDetails?.totalPrice || getPriceFromNotesOrLookup(apt.notes, apt.test_type);
                        return (
                          <BookingRow
                            key={`apt-${apt.id}`}
                            title={apt.test_type}
                            date={apt.appointment_date}
                            time={apt.time_slot}
                            refNumber={apt.reference_number}
                            status={apt.status}
                            resultsStatus={apt.results_status}
                            price={parsedPrice}
                            extra={`Patient: ${apt.first_name} ${apt.last_name}`}
                            badge={apt.sample_collection ? <Badge variant="outline" className="capitalize text-xs flex-shrink-0">{apt.sample_collection}</Badge> : undefined}
                            reportUrl={report?.file_url}
                            onDownloadReport={() => report?.file_url && handleDownloadReport(report.file_url)}
                            details={parsedDetails}
                          />
                        );
                      })}
                      {testBookings.map(booking => {
                        const parsedDetails = {
                          collectionAddress: booking.patient_address,
                          userNotes: booking.notes || undefined,
                          basePrice: booking.test_price,
                          homeFee: booking.test_price < 1000 ? 150 : 0,
                          totalPrice: booking.test_price + (booking.test_price < 1000 ? 150 : 0)
                        };
                        return (
                          <BookingRow
                            key={`tb-${booking.id}`}
                            title={booking.test_name}
                            date={booking.preferred_date}
                            time={booking.preferred_time}
                            refNumber={booking.reference_number}
                            status={booking.status}
                            price={parsedDetails.totalPrice}
                            extra={booking.test_category}
                            badge={<Badge variant="outline" className="capitalize text-xs flex-shrink-0">{booking.sample_collection}</Badge>}
                            details={parsedDetails}
                          />
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>


            {/* Inquiries Tab */}
            <TabsContent value="inquiries">
              <Card className="border-border/40">
                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-4">
                  <div>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      My Inquiries
                    </CardTitle>
                    <CardDescription>Track your contact requests and quotes</CardDescription>
                  </div>
                  <Button asChild size="sm" variant="outline">
                    <Link to="/contact"><Plus className="h-4 w-4 mr-1.5" /> New Inquiry</Link>
                  </Button>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="text-center py-12"><Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" /></div>
                  ) : inquiries.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="h-14 w-14 mx-auto text-muted-foreground/40 mb-3" />
                      <p className="text-muted-foreground font-medium mb-1">No inquiries yet</p>
                      <p className="text-xs text-muted-foreground mb-4">Send us a question or request a quote</p>
                      <Button asChild size="sm" variant="outline"><Link to="/contact">Contact Us</Link></Button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {inquiries.map(inq => (
                        <div key={inq.id} className="p-4 bg-muted/30 rounded-xl border border-border/30 hover:border-border/60 transition-colors">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <Badge variant="secondary" className="text-xs capitalize">{inq.inquiry_type}</Badge>
                                <p className="font-semibold text-foreground text-sm">{inq.subject || "General Inquiry"}</p>
                              </div>
                              <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
                                <span>Ref: <span className="font-medium text-foreground">{inq.reference_number}</span></span>
                                <span>{new Date(inq.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                              </div>
                              {inq.admin_response && (
                                <div className="mt-3 p-3 bg-primary/5 rounded-lg border border-primary/10">
                                  <p className="text-xs text-primary font-semibold mb-1">Admin Response:</p>
                                  <p className="text-xs text-foreground leading-relaxed">{inq.admin_response}</p>
                                </div>
                              )}
                            </div>
                            <StatusBadge status={inq.status} />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <ProfileSection profile={profile} user={user} onProfileUpdate={updated => setProfile(updated)} />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default DashboardPage;
