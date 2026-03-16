"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { AvailabilityRule, AvailabilityException } from "@/types/database.types";

/**
 * REGRAS DE DISPONIBILIDADE
 */

export async function getAvailabilityRules(): Promise<{ data?: AvailabilityRule[], error?: string }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('availability_rules')
    .select('*')
    .order('day_of_week', { ascending: true })
    .order('start_time', { ascending: true });

  if (error) {
    console.error("Erro ao buscar regras:", error);
    return { error: "Falha ao carregar regras de disponibilidade." };
  }
  return { data: data as AvailabilityRule[] };
}

export async function saveAvailabilityRule(ruleData: Partial<AvailabilityRule>): Promise<{ success: boolean, message: string }> {
  const supabase = await createClient();
  // Protected by RLS to only allow admin inserts/updates
  
  const payload = { ...ruleData };
  delete payload.created_at; // don't override created_at

  const { error } = await supabase.from('availability_rules').upsert(payload);

  if (error) {
    console.error("Erro ao salvar regra:", error);
    return { success: false, message: "Houve um erro ao salvar o bloco de horário." };
  }

  revalidatePath('/disponibilidade');
  return { success: true, message: "Bloco de horário salvo com sucesso!" };
}

export async function deleteAvailabilityRule(id: string): Promise<{ success: boolean, message: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from('availability_rules').delete().eq('id', id);

  if (error) {
    console.error("Erro ao deletar regra:", error);
    return { success: false, message: "Houve um erro ao excluir o bloco de horário." };
  }

  revalidatePath('/disponibilidade');
  return { success: true, message: "Bloco excluído com sucesso." };
}

/**
 * EXCEÇÕES DE DISPONIBILIDADE
 */

export async function getAvailabilityExceptions(): Promise<{ data?: AvailabilityException[], error?: string }> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('availability_exceptions')
    .select('*')
    .order('exception_date', { ascending: true });

  if (error) {
    console.error("Erro ao buscar exceções:", error);
    return { error: "Falha ao carregar exceções." };
  }
  return { data: data as AvailabilityException[] };
}

export async function saveAvailabilityException(exceptionData: Partial<AvailabilityException>): Promise<{ success: boolean, message: string }> {
  const supabase = await createClient();
  const payload = { ...exceptionData };
  delete payload.created_at;

  const { error } = await supabase.from('availability_exceptions').upsert(payload);

  if (error) {
    console.error("Erro ao salvar exceção:", error);
    return { success: false, message: "Houve um erro ao salvar a exceção." };
  }

  revalidatePath('/disponibilidade');
  return { success: true, message: "Exceção salva com sucesso!" };
}

export async function deleteAvailabilityException(id: string): Promise<{ success: boolean, message: string }> {
  const supabase = await createClient();
  const { error } = await supabase.from('availability_exceptions').delete().eq('id', id);

  if (error) {
    console.error("Erro ao deletar exceção:", error);
    return { success: false, message: "Houve um erro ao excluir a exceção." };
  }

  revalidatePath('/disponibilidade');
  return { success: true, message: "Exceção excluída com sucesso." };
}
