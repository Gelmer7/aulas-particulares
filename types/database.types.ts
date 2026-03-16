export type AppointmentStatus = 'Pendente' | 'Confirmado' | 'Cancelado' | 'Remarcado' | 'Concluido' | 'No-Show';

export interface Profile {
  id: string;
  full_name: string | null;
  email: string;
  role: 'student' | 'admin';
  created_at: string;
}

export interface AvailabilityRule {
  id: string;
  day_of_week: number; // 0 (Domingo) - 6 (Sábado)
  start_time: string; // Tempo no formato HH:mm:ss
  end_time: string;
  slot_duration_minutes: number;
  buffer_minutes: number;
  is_active: boolean;
  created_at: string;
}

export interface AvailabilityException {
  id: string;
  exception_date: string; // YYYY-MM-DD
  is_full_day_blocked: boolean;
  start_time: string | null;
  end_time: string | null;
  reason: string | null;
  created_at: string;
}

export interface AppointmentLock {
  id: string;
  date_time: string;
  locked_at: string;
  expires_at: string;
  session_id: string | null;
}

export interface Appointment {
  id: string;
  student_name: string;
  student_email: string;
  student_phone: string;
  date_time: string;
  status: AppointmentStatus;
  student_timezone: string;
  meeting_link: string | null;
  internal_notes: string | null;
  created_at: string;
  updated_at: string;
}
