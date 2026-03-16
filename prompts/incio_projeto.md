# Role & Persona
Atue como um Arquiteto de Software Sênior e Especialista em Full-Stack Development com foco em Next.js, Supabase e UX/UI. Sua tarefa é planejar e estruturar a implementação de uma plataforma educacional completa para uma professora particular de Química e Física.

# Visão Geral do Projeto
O objetivo é criar um ecossistema digital composto por duas partes principais:
1. **Site Público (Landing Page):** Focado em conversão, SEO e apresentação da professora.
2. **Dashboard Administrativo (Área Restrita):** Para gestão de conteúdo, agendamentos e visualização de métricas.

# Stack Tecnológica Obrigatória
- **Framework:** Next.js 14+ (Utilizando App Router, Server Components e Server Actions).
- **Linguagem:** TypeScript (Strict Mode).
- **Backend/Banco de Dados:** Supabase (Auth, Database, Realtime, Edge Functions).
- **Estilização:** Tailwind CSS (Mobile-first).
- **Componentes UI:** PrimeReact (Versão compatível com React/Next.js, não PrimeNG).
- **Ícones:** Lucide React ou Heroicons.
- **Formulários:** React Hook Form + Zod (para validação).
- **Gerenciamento de Estado:** Zustand (apenas quando estritamente necessário, priorizar Server State).
- **SEO:** Next.js Metadata API, Sitemap.xml dinâmico, Open Graph.

# Requisitos Funcionais Detalhados

## 1. Site Público (Front-office)
- **Home:** Hero section com proposta de valor, foto da professora, depoimentos (carrossel) e CTA claro para agendamento.
- **Sobre:** Biografia, qualificações e metodologia de ensino.
- **Serviços:** Detalhamento das aulas (Química, Física, Preparatório para Vestibular, etc.) e preços.
- **Agendamento:**
  - Calendário interativo mostrando horários disponíveis.
  - O aluno seleciona o horário, preenche dados básicos e confirma.
  - O status inicial do agendamento é "Pendente".
- **Contato:**
  - Botão flutuante de WhatsApp (link direto API).
  - Formulário de contato geral.
  - **Rastreamento:** Cada clique no botão do WhatsApp ou envio de formulário deve registrar um evento na tabela de analytics do Supabase.
- **Blog/Recursos (Opcional mas recomendado para SEO):** Estrutura pronta para artigos futuros.

## 2. Dashboard Administrativo (Back-office)
- **Autenticação:** Login seguro via Supabase Auth (apenas a professora tem acesso).
- **Home Dashboard:**
  - Cards com KPIs: Total de Visitantes (últimos 7/30 dias), Total de Cliques no WhatsApp, Agendamentos Pendentes, Agendamentos Confirmados.
  - Gráfico simples de evolução de contatos.
- **Gestão de Agendamentos:**
  - Tabela com lista de agendamentos.
  - Ações: Confirmar, Cancelar, Remarcar.
  - Integração visual com status (cores diferentes para cada status).
- **CMS (Gerenciamento de Conteúdo):**
  - Formulários para editar textos da Home, Sobre e Serviços sem mexer no código.
  - Upload de imagens (Supabase Storage) para alterar foto de perfil ou banner.
- **Gestão de Disponibilidade:**
  - Interface para a professora definir seus blocos de horários disponíveis na semana.

# Arquitetura de Dados (Supabase Schema)
Projete o schema SQL considerando Row Level Security (RLS) rigoroso.
1. **profiles:** (id, email, role, created_at).
2. **site_content:** (key, value, type, updated_at) -> Para o CMS dinâmico.
3. **availability:** (day_of_week, start_time, end_time, is_active).
4. **appointments:** (id, student_name, student_email, student_phone, date_time, status, created_at).
5. **analytics_events:** (id, event_type ['whatsapp_click', 'form_submit', 'page_view'], metadata, created_at, ip_hash).

# Diretrizes de Arquitetura e Código (Boas Práticas)

1. **Estrutura de Pastas (App Router):**
   - Utilize uma estrutura escalável. Ex: `/app/(public)`, `/app/(dashboard)`, `/components/ui`, `/components/features`, `/lib/supabase`, `/hooks`.
2. **Componentização:**
   - Crie componentes atômicos (Button, Input, Card) em `/components/ui`.
   - Crie componentes de negócio (BookingCalendar, StatsCard) em `/components/features`.
   - Evite "God Components". Cada arquivo deve ter uma responsabilidade única.
3. **Performance & SEO:**
   - Utilize `generateMetadata` para SEO dinâmico.
   - Otimize imagens com `next/image`.
   - Utilize Suspense boundaries para carregamento de dados no dashboard.
   - Garanta pontuação 90+ no Lighthouse.
4. **Segurança:**
   - Todas as rotas do dashboard devem ser protegidas por Middleware verificando o session token.
   - RLS no Supabase: Apenas o usuário autenticado com role 'admin' pode editar `site_content` ou ver `analytics_events`.
   - Validação de dados no servidor (Server Actions) com Zod.
5. **Acessibilidade:**
   - Semântica HTML correta (header, main, footer, nav).
   - Contraste de cores adequado.
   - Suporte a navegação por teclado.

# Entregáveis Esperados da Sua Resposta

Não gere todo o código de uma vez. Siga este plano de ação:

1. **Plano de Implementação:** Um passo a passo lógico de como construir isso.
2. **Schema SQL:** O código SQL completo para criar as tabelas no Supabase, incluindo políticas de RLS.
3. **Estrutura de Pastas:** A árvore de diretórios completa do projeto Next.js.
4. **Configurações Chave:** Arquivos de configuração (tailwind.config.ts, .env.example, supabase client).
5. **Componentes Críticos:** Implemente o código dos componentes mais complexos (ex: Lógica do Calendário de Agendamento, Server Action de Agendamento, Dashboard Stats Fetching).
6. **Estratégia de SEO:** Explique como configurar o sitemap e metadata dinamicamente.

# Considerações Finais
- Pense na manutenibilidade futura. O código deve ser limpo e comentado onde a lógica for complexa.
- Priorize a experiência do usuário (UX) no fluxo de agendamento. Deve ser simples e rápido.
- O design deve ser moderno, limpo e transmitir confiança e educação (use uma paleta de cores sóbria mas acolhedora).

Comece analisando os requisitos e propondo o Schema do Banco de Dados primeiro, pois ele é a fundação do sistema.