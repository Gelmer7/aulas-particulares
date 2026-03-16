"use client";

import { TabView, TabPanel } from 'primereact/tabview';
import { HomeCmsForm } from './home-cms-form';
import { AboutCmsForm } from './about-cms-form';
import { ServicesCmsForm } from './services-cms-form';
import { TestimonialsCmsForm } from './testimonials-cms-form';

export function CmsTabs({ 
   initialHome, initialAbout, initialServices, initialTestimonials 
}: { 
   initialHome: Record<string, any> | null, 
   initialAbout: Record<string, any> | null, 
   initialServices: Record<string, any> | null, 
   initialTestimonials: Record<string, any> | null 
}) {
   return (
      <TabView className="bg-white rounded-3xl shadow-sm border border-slate-100 px-6 py-4"
        pt={{
           navContainer: { className: 'border-b pb-2 mb-4 overflow-x-auto' },
           nav: { className: 'flex gap-4 min-w-max' },
           tab: { className: 'text-sm font-semibold p-2 pb-3 cursor-pointer transition-colors hover:text-indigo-600' },
           navContent: { className: 'custom-scrollbar' }
        }}
      >
         <TabPanel header="Página Inicial" leftIcon="pi pi-home mr-2 text-slate-500">
            <HomeCmsForm initialData={initialHome} />
         </TabPanel>
         <TabPanel header="Sobre a Professora" leftIcon="pi pi-user mr-2 text-slate-500">
            <AboutCmsForm initialData={initialAbout} />
         </TabPanel>
         <TabPanel header="Serviços Oferecidos" leftIcon="pi pi-list mr-2 text-slate-500">
            <ServicesCmsForm initialData={initialServices} />
         </TabPanel>
         <TabPanel header="Depoimentos" leftIcon="pi pi-comments mr-2 text-slate-500">
            <TestimonialsCmsForm initialData={initialTestimonials} />
         </TabPanel>
      </TabView>
   );
}
