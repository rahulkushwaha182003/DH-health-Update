-- ==============================================================================
-- DH-HEALTH COMPLETE DATABASE SCHEMA SETUP
-- Copy and run this entire file in Supabase Dashboard -> SQL Editor -> New Query
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUMS (Safe creation)
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
        CREATE TYPE public.app_role AS ENUM ('admin', 'user');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'inquiry_type') THEN
        CREATE TYPE public.inquiry_type AS ENUM ('contact', 'quote', 'results', 'appointment');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'inquiry_status') THEN
        CREATE TYPE public.inquiry_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'appointment_status') THEN
        CREATE TYPE public.appointment_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled', 'no_show');
    END IF;
END $$;

-- 3. TABLES

-- user_roles
CREATE TABLE IF NOT EXISTS public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- profiles
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
    first_name TEXT,
    last_name TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    date_of_birth DATE,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- inquiries (contact, quote, results)
CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    reference_number TEXT NOT NULL UNIQUE,
    inquiry_type inquiry_type NOT NULL,
    status inquiry_status NOT NULL DEFAULT 'pending',
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    subject TEXT,
    message TEXT,
    department TEXT,
    company_name TEXT,
    selected_tests TEXT[],
    estimated_volume TEXT,
    original_reference TEXT,
    admin_response TEXT,
    responded_at TIMESTAMP WITH TIME ZONE,
    responded_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- appointments
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    reference_number TEXT NOT NULL UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    appointment_date DATE NOT NULL,
    time_slot TEXT NOT NULL,
    test_type TEXT NOT NULL,
    sample_collection TEXT NOT NULL CHECK (sample_collection IN ('lab', 'home')),
    collection_address TEXT,
    notes TEXT,
    status appointment_status NOT NULL DEFAULT 'pending',
    admin_notes TEXT,
    confirmed_by UUID REFERENCES auth.users(id),
    confirmed_at TIMESTAMP WITH TIME ZONE,
    results_status TEXT DEFAULT 'pending' CHECK (results_status IN ('pending', 'processing', 'ready')),
    results_ready_at TIMESTAMP WITH TIME ZONE,
    report_id UUID,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- reports
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    appointment_id UUID REFERENCES public.appointments(id) ON DELETE CASCADE,
    report_number TEXT NOT NULL UNIQUE,
    report_date DATE NOT NULL DEFAULT CURRENT_DATE,
    test_results TEXT NOT NULL,
    doctor_notes TEXT,
    critical_values TEXT,
    findings TEXT,
    recommendations TEXT,
    is_abnormal BOOLEAN DEFAULT false,
    file_url TEXT,
    report_status TEXT DEFAULT 'ready',
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- test_bookings
CREATE TABLE IF NOT EXISTS public.test_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    patient_name TEXT NOT NULL,
    patient_email TEXT NOT NULL,
    patient_phone TEXT NOT NULL,
    patient_address TEXT NOT NULL,
    test_name TEXT NOT NULL,
    test_category TEXT NOT NULL,
    test_price NUMERIC NOT NULL,
    sample_collection TEXT NOT NULL,
    preferred_date DATE NOT NULL,
    preferred_time TEXT NOT NULL,
    reference_number TEXT NOT NULL UNIQUE,
    notes TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- 4. HELPER FUNCTIONS

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.user_roles
        WHERE user_id = _user_id AND role = _role
    );
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT public.has_role(auth.uid(), 'admin'::app_role);
$$;

CREATE OR REPLACE FUNCTION public.assign_admin_role(target_user_id uuid, secret_key text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = 'public'
AS $$
BEGIN
  IF secret_key != 'DIAG_ADMIN_2024' THEN
    RETURN false;
  END IF;
  
  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN true;
END;
$$;

CREATE OR REPLACE FUNCTION public.admin_reset_user_password(target_user_id UUID, new_plain_password TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = auth, public
AS $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'::public.app_role
  ) THEN
    RAISE EXCEPTION 'Access Denied: Only admins can reset user passwords';
  END IF;

  UPDATE auth.users
  SET 
    encrypted_password = crypt(new_plain_password, gen_salt('bf')),
    updated_at = now()
  WHERE id = target_user_id;

  RETURN TRUE;
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_report_number()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  ref_num text;
  exists_flag boolean;
BEGIN
  LOOP
    ref_num := 'REP-' || upper(substring(replace(gen_random_uuid()::text, '-', ''), 1, 8));
    SELECT EXISTS(SELECT 1 FROM public.reports WHERE report_number = ref_num) INTO exists_flag;
    IF NOT exists_flag THEN
      RETURN ref_num;
    END IF;
  END LOOP;
END;
$$;

CREATE OR REPLACE FUNCTION public.generate_test_booking_reference()
RETURNS text
LANGUAGE plpgsql
AS $$
DECLARE
  ref_num text;
  exists_flag boolean;
BEGIN
  LOOP
    ref_num := 'TB-' || upper(substring(replace(gen_random_uuid()::text, '-', ''), 1, 8));
    SELECT EXISTS(SELECT 1 FROM public.test_bookings WHERE reference_number = ref_num) INTO exists_flag;
    IF NOT exists_flag THEN
      RETURN ref_num;
    END IF;
  END LOOP;
END;
$$;

-- 5. SIGNUP TRIGGER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
    INSERT INTO public.profiles (user_id, email, first_name, last_name)
    VALUES (
      NEW.id, 
      NEW.email,
      NEW.raw_user_meta_data->>'first_name',
      NEW.raw_user_meta_data->>'last_name'
    )
    ON CONFLICT (user_id) DO UPDATE
    SET email = EXCLUDED.email,
        first_name = COALESCE(EXCLUDED.first_name, profiles.first_name),
        last_name = COALESCE(EXCLUDED.last_name, profiles.last_name);
    
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user')
    ON CONFLICT (user_id, role) DO NOTHING;
    
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Updated at triggers
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_inquiries_updated_at ON public.inquiries;
CREATE TRIGGER update_inquiries_updated_at
    BEFORE UPDATE ON public.inquiries
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_appointments_updated_at ON public.appointments;
CREATE TRIGGER update_appointments_updated_at
    BEFORE UPDATE ON public.appointments
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_reports_updated_at ON public.reports;
CREATE TRIGGER update_reports_updated_at
    BEFORE UPDATE ON public.reports
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_test_bookings_updated_at ON public.test_bookings;
CREATE TRIGGER update_test_bookings_updated_at
    BEFORE UPDATE ON public.test_bookings
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 6. INDEXES
CREATE INDEX IF NOT EXISTS idx_inquiries_user_id ON public.inquiries(user_id);
CREATE INDEX IF NOT EXISTS idx_inquiries_status ON public.inquiries(status);
CREATE INDEX IF NOT EXISTS idx_inquiries_reference ON public.inquiries(reference_number);
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON public.appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON public.appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON public.appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_reference ON public.appointments(reference_number);
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_test_bookings_reference ON public.test_bookings(reference_number);
CREATE INDEX IF NOT EXISTS idx_reports_appointment_id ON public.reports(appointment_id);

-- 7. ENABLE ROW LEVEL SECURITY
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_bookings ENABLE ROW LEVEL SECURITY;

-- 8. POLICIES

-- user_roles
DROP POLICY IF EXISTS "Users can view own roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;

CREATE POLICY "Users can view own roles"
ON public.user_roles FOR SELECT TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can manage all roles"
ON public.user_roles FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

CREATE POLICY "Users can view own profile"
ON public.profiles FOR SELECT TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can view all profiles"
ON public.profiles FOR SELECT TO authenticated
USING (public.is_admin());

CREATE POLICY "Users can insert own profile"
ON public.profiles FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Admins can update all profiles"
ON public.profiles FOR UPDATE TO authenticated
USING (public.is_admin());

-- appointments
DROP POLICY IF EXISTS "Admins can manage all appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can view own appointments" ON public.appointments;
DROP POLICY IF EXISTS "Anyone can create appointments" ON public.appointments;
DROP POLICY IF EXISTS "Users can update own pending appointments" ON public.appointments;

CREATE POLICY "Admins can manage all appointments" ON public.appointments
AS PERMISSIVE FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view own appointments" ON public.appointments
AS PERMISSIVE FOR SELECT TO authenticated
USING (
  email IN (SELECT p.email FROM public.profiles p WHERE p.user_id = auth.uid())
  OR user_id = auth.uid()
);

CREATE POLICY "Anyone can create appointments" ON public.appointments
AS PERMISSIVE FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can update own pending appointments" ON public.appointments
AS PERMISSIVE FOR UPDATE TO authenticated
USING (
  (email IN (SELECT p.email FROM public.profiles p WHERE p.user_id = auth.uid()) OR user_id = auth.uid())
  AND status = 'pending'
);

-- inquiries
DROP POLICY IF EXISTS "Admins can manage all inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Users can view own inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Anyone can create inquiries" ON public.inquiries;
DROP POLICY IF EXISTS "Users can update own pending inquiries" ON public.inquiries;

CREATE POLICY "Admins can manage all inquiries" ON public.inquiries
AS PERMISSIVE FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view own inquiries" ON public.inquiries
AS PERMISSIVE FOR SELECT TO authenticated
USING (
  user_id = auth.uid()
  OR email IN (SELECT p.email FROM public.profiles p WHERE p.user_id = auth.uid())
);

CREATE POLICY "Anyone can create inquiries" ON public.inquiries
AS PERMISSIVE FOR INSERT
WITH CHECK (true);

CREATE POLICY "Users can update own pending inquiries" ON public.inquiries
AS PERMISSIVE FOR UPDATE TO authenticated
USING ((user_id = auth.uid()) AND (status = 'pending'));

-- test_bookings
DROP POLICY IF EXISTS "Admins can manage all test bookings" ON public.test_bookings;
DROP POLICY IF EXISTS "Users can read own test bookings" ON public.test_bookings;
DROP POLICY IF EXISTS "Public can insert test bookings" ON public.test_bookings;

CREATE POLICY "Admins can manage all test bookings" ON public.test_bookings
AS PERMISSIVE FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can read own test bookings" ON public.test_bookings
AS PERMISSIVE FOR SELECT TO authenticated
USING (
  patient_email IN (SELECT p.email FROM public.profiles p WHERE p.user_id = auth.uid())
);

CREATE POLICY "Public can insert test bookings" ON public.test_bookings
AS PERMISSIVE FOR INSERT
WITH CHECK (true);

-- reports
DROP POLICY IF EXISTS "Admins can manage all reports" ON public.reports;
DROP POLICY IF EXISTS "Users can view own reports" ON public.reports;

CREATE POLICY "Admins can manage all reports" ON public.reports
AS PERMISSIVE FOR ALL TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can view own reports" ON public.reports
AS PERMISSIVE FOR SELECT TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM appointments a 
    WHERE a.id = reports.appointment_id 
    AND (
      a.user_id = auth.uid() 
      OR a.email IN (SELECT p.email FROM public.profiles p WHERE p.user_id = auth.uid())
    )
  )
);

-- 9. STORAGE BUCKETS (medical-reports, prescriptions)
INSERT INTO storage.buckets (id, name, public)
VALUES ('medical-reports', 'medical-reports', false)
ON CONFLICT (id) DO UPDATE SET public = false;

INSERT INTO storage.buckets (id, name, public)
VALUES ('prescriptions', 'prescriptions', false)
ON CONFLICT (id) DO UPDATE SET public = false;

-- Storage Policies
DROP POLICY IF EXISTS "Admins can upload reports" ON storage.objects;
DROP POLICY IF EXISTS "Admins can manage report files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete report files" ON storage.objects;
DROP POLICY IF EXISTS "Users can read own medical reports" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload prescriptions" ON storage.objects;
DROP POLICY IF EXISTS "Users can read own prescriptions" ON storage.objects;
DROP POLICY IF EXISTS "Admins can read all prescriptions" ON storage.objects;

CREATE POLICY "Admins can upload reports"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'medical-reports' AND public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can manage report files"
ON storage.objects FOR UPDATE TO authenticated
USING (bucket_id = 'medical-reports' AND public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Admins can delete report files"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'medical-reports' AND public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE POLICY "Users can read own medical reports"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'medical-reports'
  AND (
    public.has_role(auth.uid(), 'admin'::public.app_role)
    OR EXISTS (
      SELECT 1 FROM public.appointments a
      WHERE (storage.foldername(name))[1] = a.id::text
      AND (
        a.user_id = auth.uid()
        OR a.email IN (SELECT p.email FROM public.profiles p WHERE p.user_id = auth.uid())
      )
    )
  )
);

CREATE POLICY "Users can upload prescriptions"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'prescriptions');

CREATE POLICY "Users can read own prescriptions"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'prescriptions' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Admins can read all prescriptions"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'prescriptions' AND public.is_admin());
