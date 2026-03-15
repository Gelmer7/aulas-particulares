"use server";

import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const formSchema = z.object({
  student_name: z.string().min(2, "O nome deve ter pelo menos 2 caracteres."),
  student_email: z.string().email("E-mail inválido."),
  student_phone: z.string().min(10, "Telefone inválido."),
  date_time: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: "Data e hora inválidas",
  }),
});

interface ActionResponse {
  success: boolean;
  message?: string;
  errors?: any;
}

export async function submitBooking(prevState: any, formData: FormData): Promise<ActionResponse> {
  // Validate Input
  const parsed = formSchema.safeParse({
    student_name: formData.get("student_name"),
    student_email: formData.get("student_email"),
    student_phone: formData.get("student_phone"),
    date_time: formData.get("date_time"), // Ex: "2024-05-18T14:00:00Z"
  });

  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten().fieldErrors };
  }

  const payload = parsed.data;
  const supabase = await createClient();

  // Insert without needing auth due to our RLS policy public insert rule
  const { error } = await supabase.from('appointments').insert({
    student_name: payload.student_name,
    student_email: payload.student_email,
    student_phone: payload.student_phone,
    date_time: payload.date_time,
    status: 'Pendente'
  });

  if (error) {
    console.error("Booking Insert ERror: ", error);
    return { success: false, message: "Houve um erro no servidor ao tentar agendar. Tente novamente mais tarde." };
  }

  return { success: true, message: "Agendamento solicitado com sucesso! Entraremos em contato via WhatsApp." };
}
