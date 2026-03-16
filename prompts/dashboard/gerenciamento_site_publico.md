# Role & Persona
Atue como um Arquiteto de Software Sênior especializado em Sistemas CMS (Content Management System), Next.js 14+ e Supabase. Sua tarefa é projetar e implementar um módulo completo de gerenciamento de conteúdo que permita à professora administrar toda a parte pública do site educacional sem necessidade de conhecimento técnico.

# Visão Geral do Módulo
Criar um sistema CMS (Content Management System) intuitivo e poderoso onde:
1. **Admin (Professora):** Pode editar todo o conteúdo visível do site público através de formulários amigáveis.
2. **Site Público:** Reflete automaticamente as alterações feitas no CMS.
3. **Sistema:** Gerencia uploads de imagens, versionamento de conteúdo, cache e SEO dinamicamente.

# Stack Tecnológica (Consistente com Projeto Principal)
- **Framework:** Next.js 14+ (App Router, Server Components, Server Actions)
- **Backend:** Supabase (Database, Auth, Storage, Realtime)
- **UI:** PrimeReact + Tailwind CSS
- **Editor de Texto:** Tiptap ou Quill (WYSIWYG para conteúdos ricos)
- **Upload de Imagens:** Supabase Storage com upload progressivo
- **Otimização de Imagens:** next/image com transformação on-the-fly
- **Validação:** Zod + React Hook Form
- **Cache:** Next.js revalidatePath + revalidateTag + Supabase Realtime

# Requisitos Funcionais Detalhados

## 1. Módulo de Gestão de Conteúdo (Dashboard Admin)

### 1.1 Gestão de Páginas e Seções
- **Home Page:**
  - Hero Section: Título, subtítulo, CTA principal, imagem de fundo.
  - Seção de Benefícios: Cards com ícones, títulos e descrições (adicionar/remover/reordenar).
  - Seção de Depoimentos: Lista de depoimentos com nome, foto, texto e nota (1-5 estrelas).
  - Seção de Chamada para Ação: Texto e botão de CTA secundário.

- **Página Sobre:**
  - Biografia completa (editor rico).
  - Foto de perfil principal.
  - Galeria de fotos adicionais (opcional).
  - Qualificações e certificações (lista editável).
  - Timeline de experiência (adicionar/remover itens).

- **Página de Serviços:**
  - Lista de serviços/aulas oferecidas.
  - Cada serviço tem: título, descrição, preço, duração, imagem.
  - Ordenação personalizada dos serviços.
  - Toggle para mostrar/esconder serviços.

- **Página de Contato:**
  - Informações de contato (email, telefone, WhatsApp).
  - Links para redes sociais.
  - Texto de introdução para o formulário.

### 1.2 Gestão de Mídia e Imagens
- **Upload de Imagens:**
  - Drag and drop para upload.
  - Preview antes de publicar.
  - Crop e resize básico no cliente.
  - Compressão automática para web.
  - Suporte a múltiplos formatos (JPG, PNG, WebP).

- **Biblioteca de Mídia:**
  - Galeria com todas as imagens uploaded.
  - Busca e filtragem por nome/data.
  - Possibilidade de reutilizar imagens em diferentes seções.
  - Indicador de uso (onde cada imagem está sendo usada).

- **Otimização:**
  - Geração automática de thumbnails.
  - Lazy loading configurado por padrão.
  - Alt text obrigatório para acessibilidade e SEO.

### 1.3 Gestão de SEO e Metadados
- **SEO por Página:**
  - Meta title editável.
  - Meta description editável.
  - Slug/URL customizável.
  - Canonical URL.
  - Open Graph image (para compartilhamento em redes sociais).

- **SEO Global:**
  - Site title padrão.
  - Default meta description.
  - Favicon upload.
  - Google Analytics/Tag Manager ID.
  - Verificação de propriedade (Google Search Console).

### 1.4 Gestão de Depoimentos
- **CRUD Completo:**
  - Adicionar, editar, remover depoimentos.
  - Upload de foto do aluno (ou usar placeholder).
  - Nota em estrelas (1-5).
  - Toggle para mostrar/esconder depoimento.
  - Ordenação manual (arrastar e soltar).

### 1.5 Gestão de FAQ (Perguntas Frequentes)
- **CRUD de Perguntas:**
  - Adicionar, editar, remover perguntas e respostas.
  - Editor rico para respostas.
  - Ordenação personalizada.
  - Toggle para mostrar/esconder perguntas.
  - Categorização opcional.

### 1.6 Preview e Publicação
- **Preview em Tempo Real:**
  - Botão para visualizar mudanças antes de publicar.
  - Preview em modo desktop e mobile.
  - Indicador de mudanças não publicadas.

- **Controle de Publicação:**
  - Botão "Publicar Alterações".
  - Histórico de versões (opcional para MVP).
  - Data da última publicação.
  - Reverter para versão anterior (opcional).

## 2. Site Público (Auto-Atualizável)

### 2.1 Renderização Dinâmica
- Todo o conteúdo é carregado do Supabase.
- Cache inteligente com revalidation.
- Fallback para conteúdo padrão se não houver dados.
- Loading skeletons durante fetch de dados.

### 2.2 Performance
- Imagens otimizadas com next/image.
- Lazy loading para imagens abaixo do fold.
- Static Generation com revalidation para páginas de conteúdo.
- CDN para assets estáticos.
