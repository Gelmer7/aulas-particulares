import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // IMPORTANTE: Evitar escrever requisições pesadas (getUser) no middleware para arquivos
  // estáticos (_next/static, css, imagens) para não derrubar performance
  if (
    request.nextUrl.pathname.startsWith('/_next') ||
    request.nextUrl.pathname.includes('.')
  ) {
    return supabaseResponse
  }

  // Obter o usuário atual
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isDashboardRoute = request.nextUrl.pathname.startsWith('/painel') || request.nextUrl.pathname.startsWith('/agendamentos') || request.nextUrl.pathname.startsWith('/conteudo') || request.nextUrl.pathname.startsWith('/disponibilidade')
  const isAuthRoute = request.nextUrl.pathname.startsWith('/login')

  // Se acessar o painel administrativo sem usuário => redireciona pro login
  if (isDashboardRoute && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // Se acessar tela de login já logado => redireciona pro painel
  if (isAuthRoute && user) {
    const url = request.nextUrl.clone()
    url.pathname = '/painel'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
