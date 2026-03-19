import Link from "next/link";
import Image from "next/image";
import { Button } from "primereact/button";
import { getSiteContent } from "@/actions/cms.actions";
import { Rating } from "primereact/rating";
import { TestimonialItem } from "@/types/database.types";

export default async function HomePage() {

  const homeData = await getSiteContent('home_page') || {};
  const tData = await getSiteContent('testimonials_page') || {};
  
  const title = (homeData.heroTitle as string) || "Domine Química e Física com Metodologia Personalizada";
  const subtitle = (homeData.heroSubtitle as string) || "Aulas particulares e mentoria para Ensino Médio, ENEM e Vestibulares de Alta Concorrência. Aprenda de verdade com quem entende as suas dificuldades.";
  const ctaText = (homeData.ctaText as string) || "Agendar Primeira Aula";
  const heroImage = (homeData.heroImage as string) || "/images/foto-perfil.jpg";

  // Capturar lista validada e filtrada
  let publicTestimonials: TestimonialItem[] = [];
  if (Array.isArray(tData.testimonialsList)) {
     publicTestimonials = (tData.testimonialsList as TestimonialItem[]).filter((item) => item.visible);
  }

  return (
    <div className="flex flex-col flex-1">
      {/* Hero Section */}
      <section className="relative w-full py-20 lg:py-32 overflow-hidden bg-slate-50">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-indigo-100 via-white to-sky-50 opacity-70"></div>
        <div className="container relative mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex flex-col gap-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-medium w-fit mx-auto lg:mx-0">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
              Vagas abertas para o Semestre
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
              {title}
            </h1>

            <p className="text-lg text-slate-600 max-w-xl mx-auto lg:mx-0">
              {subtitle}
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 justify-center lg:justify-start">
              <Link href="/agendamento" passHref>
                <Button
                  label={ctaText}
                  icon="pi pi-calendar"
                  className="p-button-rounded bg-indigo-600 hover:bg-indigo-700 border-none px-8 py-3 font-semibold w-full sm:w-auto text-lg shadow-lg shadow-indigo-200"
                />
              </Link>
              <Link href="/servicos" passHref>
                <Button
                  label="Ver Serviços"
                  icon="pi pi-list"
                  className="p-button-rounded p-button-outlined text-slate-700 border-slate-300 hover:bg-slate-100 px-8 py-3 font-semibold w-full sm:w-auto text-lg"
                />
              </Link>
            </div>

            <div className="mt-8 flex items-center justify-center lg:justify-start gap-6 text-sm text-slate-500 font-medium">
              <div className="flex items-center gap-2">
                <i className="pi pi-check-circle text-indigo-500"></i> Aulas Online
              </div>
              <div className="flex items-center gap-2">
                <i className="pi pi-check-circle text-indigo-500"></i> Material Exclusivo
              </div>
            </div>
          </div>

          {/* Hero Image / Graphic */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-full aspect-square lg:aspect-auto lg:h-[600px] bg-slate-200 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-slate-900/5">
            <Image
              src={heroImage}
              alt="Foto Profissional Principal"
              fill
              priority
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />

            {/* Floating Badge */}
            <div
              className="absolute top-8 -left-4 bg-white p-4 rounded-2xl shadow-xl flex items-center gap-4 animate-bounce"
              style={{ animationDuration: "3s" }}
            >
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 font-bold text-xl">
                10+
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-slate-800 text-sm">
                  Anos de
                </span>
                <span className="text-slate-500 text-xs">Experiência</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Depoimentos rápidos */}
      {publicTestimonials.length > 0 && (
         <section className="py-20 bg-white">
           <div className="container mx-auto px-4 text-center">
             <h2 className="text-3xl font-bold text-slate-900 mb-12">
               O que os alunos dizem
             </h2>
             <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
               {publicTestimonials.map((item) => (
                 <div
                   key={item.id}
                   className="p-6 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm text-left flex flex-col gap-4"
                 >
                   <div className="flex items-center gap-4 border-b border-slate-200 pb-4">
                      {item.avatar ? (
                         <div className="w-12 h-12 rounded-full overflow-hidden shrink-0">
                            <Image src={item.avatar} alt={item.name} width={48} height={48} className="w-full h-full object-cover" />
                         </div>
                      ) : (
                         <div className="w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 font-bold flex items-center justify-center shrink-0">
                            {item.name.charAt(0)}
                         </div>
                      )}
                      <div>
                         <div className="font-bold text-slate-800">{item.name}</div>
                         <Rating value={item.rating} readOnly cancel={false} className="gap-0 text-sm text-yellow-500" />
                      </div>
                   </div>
                   
                   <p className="text-slate-600 italic leading-relaxed">
                     &quot;{item.text}&quot;
                   </p>
                 </div>
               ))}
             </div>
           </div>
         </section>
      )}
    </div>
  );
}
