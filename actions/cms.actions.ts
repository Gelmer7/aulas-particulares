"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

// ==========================================
// AÇÕES DE DADOS (TEXTOS E JSON)
// ==========================================

export async function getSiteContent(key: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('site_content')
    .select('value')
    .eq('key', key)
    .single();

  if (error || !data) {
    return null;
  }
  return data.value;
}

export async function saveSiteContent(key: string, value: Record<string, unknown>, type: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { success: false, message: "Não autorizado." };

  const { error } = await supabase
    .from('site_content')
    .upsert({ 
      key, 
      value, 
      type, 
      updated_by: user.id,
      updated_at: new Date().toISOString() 
    });

  if (error) {
    console.error(`Erro ao salvar conteúdo CMS (${key}):`, error);
    return { success: false, message: "Falha ao gravar conteúdo." };
  }

  revalidatePath('/', 'layout'); 
  return { success: true, message: "Conteúdo publicado com sucesso!" };
}

// ==========================================
// AÇÕES DE STORAGE (IMAGENS E MÍDIAS)
// ==========================================

export async function uploadMedia(file: File, folderId: string = "general") {
  const supabase = await createClient();

  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `${folderId}/${fileName}`;

  const { error } = await supabase.storage
    .from('public-site-media')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error("Erro no upload da imagem:", error);
    return { success: false, message: "Falha no upload da mídia." };
  }

  const { data: publicUrlData } = supabase.storage
    .from('public-site-media')
    .getPublicUrl(filePath);

  return { 
     success: true, 
     url: publicUrlData.publicUrl,
     path: filePath 
  };
}

export async function deleteMedia(filePath: string) {
    const supabase = await createClient();
    const { error } = await supabase.storage
       .from('public-site-media')
       .remove([filePath]);
       
    if (error) {
       console.error("Erro deletando mídia:", error);
       return { success: false };
    }
    return { success: true };
}
