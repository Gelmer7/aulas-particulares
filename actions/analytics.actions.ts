"use server";

import { createClient } from "@/lib/supabase/server";

export async function logAnalyticsEvent(
  eventType: 'whatsapp_click' | 'form_submit' | 'page_view', 
  metadata: any = {}
) {
  try {
    const supabase = await createClient();
    await supabase.from('analytics_events').insert({
      event_type: eventType,
      metadata: metadata,
      // ip_hash poderia ser gerado lendo headers('x-forwarded-for') ou similar
    });
    return { success: true };
  } catch (error) {
    console.error("Failed to log analytics:", error);
    return { success: false };
  }
}
