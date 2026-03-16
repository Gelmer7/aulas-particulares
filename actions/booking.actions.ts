"use server";

import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { addMinutes, format, parse, isAfter, isBefore, isSameDay } from "date-fns";
import { formatInTimeZone, toDate } from "date-fns-tz";
import { AvailabilityRule, AvailabilityException } from "@/types/database.types";

const formSchema = z.object({
  student_name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
  student_email: z.string().email("E-mail inválido."),
  student_phone: z.string().min(10, "Telefone inválido."),
  date_time: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Data e hora inválidas",
  }),
  lock_id: z.string().optional(),
});

interface ActionResponse {
  success: boolean;
  message?: string;
  errors?: any;
}

export async function getAvailableSlots(dateStr: string, clientTimezone: string): Promise<string[]> {
  const supabase = await createClient();
  const targetDate = new Date(dateStr); // Ex: 2024-05-18
  const dayOfWeek = targetDate.getDay();

  // 1. Fetch rules for this day
  const { data: rules } = await supabase.from('availability_rules').select('*').eq('day_of_week', dayOfWeek).eq('is_active', true);
  if (!rules || rules.length === 0) return [];

  // 2. Fetch exceptions for this date
  const dateFormatted = format(targetDate, 'yyyy-MM-dd');
  const { data: exceptions } = await supabase.from('availability_exceptions').select('*').eq('exception_date', dateFormatted);

  if (exceptions?.some(e => e.is_full_day_blocked)) {
    return []; // Totally blocked
  }

  // 3. Fetch conflicting appointments and locks
  // Define range for the day in UTC loosely based on the day
  const startOfDayStr = `${dateFormatted}T00:00:00Z`;
  const endOfDayStr = `${dateFormatted}T23:59:59Z`;

  const [appointmentsRes, locksRes] = await Promise.all([
    supabase.from('appointments').select('date_time').gte('date_time', startOfDayStr).lte('date_time', endOfDayStr).neq('status', 'Cancelado'),
    supabase.from('appointment_locks').select('date_time').gte('date_time', startOfDayStr).lte('date_time', endOfDayStr).gt('expires_at', new Date().toISOString())
  ]);

  const bookedTimes = [
    ...(appointmentsRes.data?.map(a => new Date(a.date_time).toISOString()) || []),
    ...(locksRes.data?.map(l => new Date(l.date_time).toISOString()) || [])
  ];

  // 4. Generate Slots
  const availableSlots: string[] = [];

  for (const rule of rules as AvailabilityRule[]) {
    let currentSlot = parse(rule.start_time, 'HH:mm:ss', targetDate);
    const endRule = parse(rule.end_time, 'HH:mm:ss', targetDate);

    while (isBefore(currentSlot, endRule) || currentSlot.getTime() === endRule.getTime()) {
      const slotEnd = addMinutes(currentSlot, rule.slot_duration_minutes);
      
      if (isAfter(slotEnd, endRule)) break;

      // Check exceptions
      let isBlocked = false;
      if (exceptions) {
        for (const exc of exceptions as AvailabilityException[]) {
           if (exc.start_time && exc.end_time) {
             const excStart = parse(exc.start_time, 'HH:mm:ss', targetDate);
             const excEnd = parse(exc.end_time, 'HH:mm:ss', targetDate);
             // If slot overlaps with exception
             if (isBefore(currentSlot, excEnd) && isAfter(slotEnd, excStart)) {
               isBlocked = true;
               break;
             }
           }
        }
      }

      const utcSlotIso = currentSlot.toISOString();
      if (!isBlocked && !bookedTimes.includes(utcSlotIso)) {
         availableSlots.push(utcSlotIso);
      }

      currentSlot = addMinutes(slotEnd, rule.buffer_minutes);
    }
  }

  // 5. Convert to Timezone strings
  // Return the ISO strings to the client, the client will format them via date-fns-tz
  return availableSlots.sort();
}

export async function createTemporaryLock(dateTimeIso: string): Promise<{ success: boolean, lock_id?: string, message?: string }> {
  const supabase = await createClient();
  
  // Try to insert a lock
  const { data, error } = await supabase.from('appointment_locks').insert({
    date_time: dateTimeIso,
  }).select('id').single();

  if (error) {
    console.error("Lock error: ", error);
    return { success: false, message: "Este horário acabou de ser reservado por outra pessoa." };
  }

  return { success: true, lock_id: data.id };
}

export async function releaseTemporaryLock(lockId: string) {
  const supabase = await createClient();
  await supabase.from('appointment_locks').delete().eq('id', lockId);
}

export async function submitBooking(prevState: any, formData: FormData): Promise<ActionResponse> {
  const parsed = formSchema.safeParse({
    student_name: formData.get("student_name"),
    student_email: formData.get("student_email"),
    student_phone: formData.get("student_phone"),
    date_time: formData.get("date_time"),
    lock_id: formData.get("lock_id"),
  });

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  const payload = parsed.data;
  const supabase = await createClient();

  // If provided a lock_id, it is valid, upgrade it to an appointment
  const { error } = await supabase.from('appointments').insert({
    student_name: payload.student_name,
    student_email: payload.student_email,
    student_phone: payload.student_phone,
    date_time: payload.date_time,
    status: 'Pendente',
    student_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone // Server action default to UTC maybe? the client should send the timezone. 
    // for now we'll rely on the default one or add it later.
  });

  if (error) {
    console.error("Booking Insert ERror: ", error);
    return { success: false, message: "Houve um erro ao tentar agendar." };
  }

  if (payload.lock_id) {
    await releaseTemporaryLock(payload.lock_id);
  }

  return { success: true, message: "Agendamento solicitado com sucesso!" };
}
