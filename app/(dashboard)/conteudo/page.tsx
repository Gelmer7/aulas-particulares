import { getSiteContent } from '@/actions/cms.actions';
import { CmsTabs } from '@/components/features/cms/cms-tabs';
import { Metadata } from 'next';

export const metadata: Metadata = { 
  title: "Gerenciamento de Conteúdo | Painel Admin" 
};

export default async function CMSPage() {
   const homeContent = await getSiteContent('home_page') || {};
   const aboutContent = await getSiteContent('about_page') || {};
   const servicesContent = await getSiteContent('services_page') || {};
   const testimonialsContent = await getSiteContent('testimonials_page') || {};
   
   return (
       <div className="flex flex-col gap-6 max-w-7xl mx-auto w-full pb-10">
          <div>
            <h1 className="text-3xl font-bold text-slate-800">Site Público (CMS)</h1>
            <p className="text-slate-600 mt-2">
              Altere os textos, banners e resumos que aparecem publicamente para os alunos. 
              Ao clicar em **&quot;Publicar&quot;** (nas abas com este ícone), ou salvar as listas de itens individualmente, as mudanças entram no ar imediatamente.
            </p>
          </div>

          <CmsTabs 
             initialHome={homeContent} 
             initialAbout={aboutContent} 
             initialServices={servicesContent} 
             initialTestimonials={testimonialsContent} 
          />
       </div>
   );
}
