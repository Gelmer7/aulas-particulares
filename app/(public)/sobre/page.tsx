import { Metadata } from "next";
import Image from "next/image";
import { getSiteContent } from "@/actions/cms.actions";

export const metadata: Metadata = {
  title: "Sobre Mim | Professora de Química e Física",
  description:
    "Conheça mais sobre a trajetória, qualificações e metodologia da professora.",
};

export default async function SobrePage() {
  const aboutData = await getSiteContent('about_page') || {};
  
  const title = aboutData.aboutTitle;
  const bio = aboutData.aboutBio || `
    <p>Olá! Sou apaixonada por exatas e acredito que aprender Química e Física não precisa ser uma tortura. Com mais de 10 anos de experiência lecionando aulas particulares, vivenciei as maiores dificuldades dos alunos com essas disciplinas e desenvolvi uma abordagem que simplifica conceitos complexos.</p>
    <br/>
    <p>Sou graduada em <strong>Física pela Universidade X</strong>, com especialização em Ensino de Ciências e mestrado em Ensino de Físico-Química. Meu foco é sempre alinhar a teoria com a prática exigida nas grandes bancas de vestibulares (FUVEST, UNICAMP) e ENEM.</p>
    
    <br/>
    <h3 class="text-2xl font-bold text-slate-900 mt-8 mb-4">Metodologia</h3>
    <ul class="space-y-4">
      <li class="flex gap-4"><i class="pi pi-check-circle text-indigo-600 mt-1"></i><span><strong>Diagnóstico Individualizado:</strong> Entendo onde está a lacuna base matemática antes de avançar nos conteúdos de química e física.</span></li>
      <li class="flex gap-4"><i class="pi pi-check-circle text-indigo-600 mt-1"></i><span><strong>Resolução de Exercícios Guiada:</strong> O foco está na prática. Faço provas anteriores junto com o aluno.</span></li>
      <li class="flex gap-4"><i class="pi pi-check-circle text-indigo-600 mt-1"></i><span><strong>Aulas Dinâmicas e Virtuais:</strong> Uso de mesas digitalizadoras e lousas virtuais (Miro e OneNote) que o aluno exporta em PDF em tempo real.</span></li>
    </ul>
  `;
  const image = aboutData.profileImage || null;

  return (
    <div className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-5xl">
        <h1 className="text-4xl font-bold text-slate-900 mb-12 text-center">
          {title}
        </h1>

        <div className="grid md:grid-cols-2 gap-12 items-start">
          <div className="aspect-4/5 bg-slate-100 rounded-3xl overflow-hidden relative shadow-lg">
            {image ? (
               <Image 
                  src={image} 
                  alt={title} 
                  fill 
                  className="object-cover" 
                  sizes="(max-width: 768px) 100vw, 50vw" 
               />
            ) : (
               <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-tr from-slate-200 to-slate-100">
                  <span className="text-slate-500 font-medium">Foto de Perfil</span>
               </div>
            )}
          </div>

          <div 
             className="text-lg text-slate-700 leading-relaxed cms-content space-y-4"
             dangerouslySetInnerHTML={{ __html: bio }}
          />
        </div>
      </div>
    </div>
  );
}
