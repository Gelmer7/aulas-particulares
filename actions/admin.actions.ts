"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateAppointmentStatus(id: string, status: string) {
  const supabase = await createClient();
  
  // Apenas a professora (ou seja quem tem session ativa pois middleware + RLS garante admin) pode atingir isso com sucesso
  const { error } = await supabase.from('appointments').update({ status }).eq('id', id);
  
  if (error) {
    console.error("Erro ao atualizar status:", error);
    return { success: false };
  }
  
  // Revalida as rotas que dependem desses KPIs e listas
  revalidatePath('/agendamentos');
  revalidatePath('/painel');
  
  return { success: true };
}
