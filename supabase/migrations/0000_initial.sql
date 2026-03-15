-- Enums
CREATE TYPE appointment_status AS ENUM ('Pendente', 'Confirmado', 'Cancelado', 'Remarcado');
CREATE TYPE event_type AS ENUM ('whatsapp_click', 'form_submit', 'page_view');

-- 1. Profiles
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name TEXT,
  email TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Leitura de perfis aberta." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Usuários criam seus perfis" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Apenas admins podem atualizar via interface Dashboard (ou próprio user)." ON public.profiles FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin') OR auth.uid() = id
);

-- 2. Site Content CMS
CREATE TABLE public.site_content (
  key TEXT PRIMARY KEY,
  value JSONB NOT NULL,
  type TEXT NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  updated_by UUID REFERENCES public.profiles(id)
);

ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Público pode ler conteúdo do site." ON public.site_content FOR SELECT USING (true);
CREATE POLICY "Apenas admin pode editar site_content." ON public.site_content FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 3. Availability
CREATE TABLE public.availability (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT end_time_after_start_time CHECK (end_time > start_time)
);

ALTER TABLE public.availability ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Público pode ler disponibilidade para agendar." ON public.availability FOR SELECT USING (true);
CREATE POLICY "Apenas admin pode editar disponibilidade." ON public.availability FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 4. Appointments
CREATE TABLE public.appointments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_name TEXT NOT NULL,
  student_email TEXT NOT NULL,
  student_phone TEXT NOT NULL,
  date_time TIMESTAMPTZ NOT NULL,
  status appointment_status DEFAULT 'Pendente',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Público pode INSERIR um novo agendamento." ON public.appointments FOR INSERT WITH CHECK (true);
CREATE POLICY "Apenas admin visualiza todos." ON public.appointments FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "Apenas admin atualiza ou muda status do agendamento." ON public.appointments FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 5. Analytics
CREATE TABLE public.analytics_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  event_type event_type NOT NULL,
  metadata JSONB,
  ip_hash TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Público pode reportar (INSERT) enventos analíticos." ON public.analytics_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Apenas admin visualiza analytics." ON public.analytics_events FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
