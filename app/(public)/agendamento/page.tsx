import { Metadata } from "next";
import { BookingCalendar } from "@/components/features/booking/booking-calendar";

export const metadata: Metadata = {
  title: "Agendar Aula | Professora de Química e Física",
  description: "Dê o primeiro passo rumo à aprovação e reserve seu horário na agenda.",
};

export default function AgendamentoPage() {
  return (
    <div className="py-12 md:py-24 bg-slate-50 min-h-[calc(100vh-64px)]">
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-12 items-center max-w-6xl">
        
        {/* Texts */}
        <div className="flex flex-col gap-6 order-2 md:order-1 text-center md:text-left">
          <h1 className="text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Reserve seu Horário <span className="text-indigo-600 block">Exclusivo</span>
          </h1>
          <p className="text-lg text-slate-600 max-w-lg mx-auto md:mx-0">
            Preencha os dados e escolha um horário conveniente. Esta primeira conversa de alinhamento definirá nosso cronograma e necessidades específicas do aluno.
          </p>
          
          <div className="mt-8 space-y-4">
             <div className="flex items-center gap-4 text-slate-700 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
               <div className="w-12 h-12 bg-indigo-50 flex items-center justify-center rounded-full text-indigo-600 text-xl"><i className="pi pi-check" /></div>
               <div className="flex flex-col text-left"><span className="font-bold">Aprovação Segura</span><span className="text-sm text-slate-500">Garantia baseada em metodologia ativa</span></div>
             </div>
             <div className="flex items-center gap-4 text-slate-700 bg-white p-4 rounded-xl shadow-sm border border-slate-100">
               <div className="w-12 h-12 bg-sky-50 flex items-center justify-center rounded-full text-sky-600 text-xl"><i className="pi pi-calendar" /></div>
               <div className="flex flex-col text-left"><span className="font-bold">Aulas Ao Vivo Online</span><span className="text-sm text-slate-500">Material compartilhado em tempo real</span></div>
             </div>
          </div>
        </div>

        {/* Form */}
        <div className="order-1 md:order-2 w-full">
          <BookingCalendar />
        </div>
      </div>
    </div>
  );
}
