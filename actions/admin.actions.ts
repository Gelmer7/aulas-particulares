"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateAppointmentStatus(id: string, status: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('appointments').update({ status }).eq('id', id);
  if (error) return { success: false };
  revalidatePath('/agendamentos');
  revalidatePath('/painel');
  return { success: true };
}

export async function updateAppointmentDetails(id: string, details: { meeting_link?: string, internal_notes?: string }) {
  const supabase = await createClient();
  const { error } = await supabase.from('appointments').update(details).eq('id', id);
  if (error) return { success: false, message: "Erro ao atualizar dados." };
  revalidatePath('/agendamentos');
  return { success: true };
}
