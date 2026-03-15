import { Metadata } from "next";
import Link from "next/link";
import { Button } from "primereact/button";

export const metadata: Metadata = {
  title: "Serviços | Mentoria Exatas",
  description: "Trilhas de aulas particulares para ENEM, Vestibulares e Reforço Escolar.",
};

export default function ServicosPage() {
  const plans = [
    {
      title: "Pacote Vestibulares de Elite",
      target: "FUVEST, UNICAMP, ITA",
      desc: "Foco total na resolução de problemas complexos, dicas de banca e aprofundamento mecânico/termodinâmico e físico-químico.",
      features: ["Aulas de 2 horas", "Simulados mensais", "Tira dúvidas 24/7"]
    },
    {
      title: "Extensivo ENEM",
      target: "ENEM e Vestibulares Gerais",
      desc: "Programa de aprendizado linear revisando toda a matriz base do Ensino Médio até a complexidade de prova.",
      features: ["Revisões focadas na TRI", "Química Ambiental", "Física Básica"]
    },
    {
      title: "Reforço e Recuperação",
      target: "Ensino Médio e Fundamental II",
      desc: "Para alunos com dificuldades na escola que precisam recuperar notas rapidamente ou melhorar performance nas provas Bimestrais.",
      features: ["Aulas de 1 hora", "Listas de acompanhamento", "Relatório aos pais"]
    }
  ];

  return (
    <div className="py-20 bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">Aulas e Pacotes</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Escolha o pacote que melhor se adequa ao seu objetivo. Todas as aulas são personalizadas.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan, i) => (
            <div key={i} className="flex flex-col bg-white rounded-3xl p-8 shadow-sm border border-slate-100 relative hover:shadow-xl transition-shadow duration-300">
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider mb-6 w-fit">
                {plan.target}
              </span>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">{plan.title}</h3>
              <p className="text-slate-600 mb-8 flex-1">{plan.desc}</p>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-3 text-slate-700">
                    <i className="pi pi-check text-green-500 font-bold"></i> {f}
                  </li>
                ))}
              </ul>

              <Link href="/agendamento" className="mt-auto w-full block">
                <Button label="Agendar Conversa" className="p-button-outlined w-full border-2 text-indigo-700 border-indigo-200 hover:bg-indigo-50 font-bold p-3" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
