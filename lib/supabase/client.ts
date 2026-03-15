import { createBrowserClient } from '@supabase/ssr'

// Função para criar o cliente do Supabase no lado do browser
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
