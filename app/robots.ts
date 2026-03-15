import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://www.quimicaefisica.com.br'
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/painel/', '/agendamentos/', '/conteudo/', '/disponibilidade/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
