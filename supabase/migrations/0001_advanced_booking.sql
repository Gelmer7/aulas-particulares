-- 1. Regras de Disponibilidade (Substituindo/Estendendo a antiga availability)
-- Define blocos de tempo base, duração padrão e buffer entre aulas.
CREATE TABLE public.availability_rules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  slot_duration_minutes INTEGER DEFAULT 60,
  buffer_minutes INTEGER DEFAULT 0, -- Tempo de pausa entre uma aula e outra
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT end_time_after_start_time CHECK (end_time > start_time)
);

ALTER TABLE public.availability_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Público pode ler regras de disponibilidade." ON public.availability_rules FOR SELECT USING (true);
CREATE POLICY "Apenas admin edita regras de disponibilidade." ON public.availability_rules FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 2. Exceções e Bloqueios Temporários (Feriados, Imprevistos)
CREATE TABLE public.availability_exceptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  exception_date DATE NOT NULL,
  is_full_day_blocked BOOLEAN DEFAULT true,
  start_time TIME, -- Se não for o dia todo, qual o inicio do bloqueio
  end_time TIME,   -- Se não for o dia todo, qual o fim do bloqueio
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT end_time_after_start_time_exception CHECK (is_full_day_blocked OR (end_time > start_time))
);

ALTER TABLE public.availability_exceptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Público pode ler exceções de disponibilidade." ON public.availability_exceptions FOR SELECT USING (true);
CREATE POLICY "Apenas admin edita exceções." ON public.availability_exceptions FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 3. Temporário: Locks de Agendamento (Anti Double-Booking)
CREATE TABLE public.appointment_locks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  date_time TIMESTAMPTZ NOT NULL,
  locked_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ DEFAULT NOW() + interval '5 minutes',
  session_id TEXT -- Identificador temporário do visitante (ex: hash de IP ou gerado)
);

ALTER TABLE public.appointment_locks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Público pode INSERIR locks temporários." ON public.appointment_locks FOR INSERT WITH CHECK (true);
CREATE POLICY "Público pode LER locks." ON public.appointment_locks FOR SELECT USING (true);
CREATE POLICY "Apenas admin pode gerenciar/deletar locks arbitrariamente." ON public.appointment_locks FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 4. Extensão da tabela appointments (Adicionar status extras se o schema original não os tiver como enum)
ALTER TYPE appointment_status ADD VALUE IF NOT EXISTS 'Concluido';
ALTER TYPE appointment_status ADD VALUE IF NOT EXISTS 'No-Show';

ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS student_timezone TEXT DEFAULT 'America/Sao_Paulo';
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS meeting_link TEXT;
ALTER TABLE public.appointments ADD COLUMN IF NOT EXISTS internal_notes TEXT;