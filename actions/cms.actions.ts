"use server";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateSiteContent(key: string, value: any, type: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, message: "Acesso Negado." };

  const { error } = await supabase.from('site_content').upsert({
    key,
    value,
    type,
    updated_by: user.id,
    updated_at: new Date().toISOString()
  });

  if (error) {
    console.error("CMS Error:", error);
    return { success: false, message: "Falha ao salvar." };
  }
  
  revalidatePath('/', 'layout');
  return { success: true, message: "Salvo com sucesso!" };
}
