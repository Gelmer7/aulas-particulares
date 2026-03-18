import { getSiteContent } from '@/actions/cms.actions';
import { SiteContentEditor } from '@/components/features/live-edit/site-content-editor';
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
     <div className="relative -mx-4 md:-mx-10 -my-4 md:-my-10">
       <SiteContentEditor
         initialHome={homeContent}
         initialAbout={aboutContent}
         initialServices={servicesContent}
         initialTestimonials={testimonialsContent}
       />
     </div>
   );
}
