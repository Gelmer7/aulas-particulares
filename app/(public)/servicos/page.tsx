import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { Button } from "primereact/button";
import { getSiteContent } from "@/actions/cms.actions";
import { ServiceItem } from "@/types/database.types";

export const metadata: Metadata = {
  title: "Serviços | Mentoria Exatas",
  description: "Trilhas de aulas particulares para ENEM, Vestibulares e Reforço Escolar.",
};

export default async function ServicosPage() {
  const cmsData = await getSiteContent('services_page') || {};
  
  // Fallback se não houver dados no CMS
  const defaultPlans: ServiceItem[] = [
    {
      id: 'default-1',
      title: "Pacote Vestibulares de Elite",
      description: "Foco total na resolução de problemas complexos, dicas de banca e aprofundamento mecânico/termodinâmico e físico-químico.",
      price: null,
      duration: "Aulas de 2 horas",
      image: null,
      visible: true
    },
    {
      id: 'default-2',
      title: "Extensivo ENEM",
      description: "Programa de aprendizado linear revisando toda a matriz base do Ensino Médio até a complexidade de prova.",
      price: null,
      duration: "Revisões focadas na TRI",
      image: null,
      visible: true
    }
  ];

  const services: ServiceItem[] = Array.isArray(cmsData.servicesList) && cmsData.servicesList.length > 0 
    ? (cmsData.servicesList as ServiceItem[]).filter((s) => s.visible)
    : defaultPlans;

  return (
    <div className="py-20 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Aulas e Pacotes</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Escolha o pacote que melhor se adequa ao seu objetivo. Todas as aulas são personalizadas.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service.id} className="flex flex-col bg-white rounded-3xl overflow-hidden shadow-sm border border-slate-100 relative hover:shadow-xl transition-all duration-300 group">
              {service.image && (
                <div className="relative h-48 w-full">
                  <Image 
                    src={service.image} 
                    alt={service.title} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-500" 
                  />
                </div>
              )}
              
              <div className="p-8 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-2xl font-bold text-slate-900 leading-tight">{service.title}</h3>
                </div>
                
                <p className="text-slate-600 mb-6 flex-1">{service.description}</p>
                
                <div className="flex flex-col gap-3 mb-8 text-sm">
                  <div className="flex items-center gap-2 text-indigo-600 font-medium bg-indigo-50 px-3 py-1.5 rounded-lg w-fit">
                    <i className="pi pi-clock"></i>
                    <span>{service.duration || 'Consulte duração'}</span>
                  </div>
                  {service.price && (
                    <div className="text-2xl font-extrabold text-slate-900">
                      R$ {service.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </div>
                  )}
                </div>

                <Link href="/agendamento" className="mt-auto">
                  <Button 
                    label="Agendar Detalhes" 
                    icon="pi pi-calendar"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 border-none font-bold py-3 shadow-lg shadow-indigo-100" 
                  />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
