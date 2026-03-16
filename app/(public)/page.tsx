import Link from "next/link";
import Image from "next/image";
import { Button } from "primereact/button";

export default function HomePage() {
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
              Domine <span className="text-indigo-600">Química e Física</span>{" "}
              com Metodologia Personalizada
            </h1>

            <p className="text-lg text-slate-600 max-w-xl mx-auto lg:mx-0">
              Aulas particulares e mentoria para Ensino Médio, ENEM e
              Vestibulares de Alta Concorrência. Aprenda de verdade com quem
              entende as suas dificuldades.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 mt-4 justify-center lg:justify-start">
              <Link href="/agendamento" passHref>
                <Button
                  label="Agendar Primeira Aula"
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
                <i className="pi pi-check-circle text-indigo-500"></i> Aulas
                Online
              </div>
              <div className="flex items-center gap-2">
                <i className="pi pi-check-circle text-indigo-500"></i> Material
                Exclusivo
              </div>
            </div>
          </div>

          {/* Hero Image / Graphic */}
          <div className="relative mx-auto w-full max-w-md lg:max-w-full aspect-square lg:aspect-auto lg:h-[600px] bg-slate-200 rounded-3xl overflow-hidden shadow-2xl ring-1 ring-slate-900/5">
            {/* Foto Profissional */}
            <Image
              src="/images/foto-perfil.jpg"
              alt="Foto Profissional"
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
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-12">
            O que os alunos dizem
          </h2>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="p-6 rounded-2xl bg-slate-50 border border-slate-100 shadow-sm text-left"
              >
                <div className="flex text-yellow-400 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <i key={star} className="pi pi-star-fill text-sm"></i>
                  ))}
                </div>
                <p className="text-slate-700 mb-6 italic">
                  &quot;A didática é incrível. Consegui entender em 2 meses o
                  que não entendi no ano inteiro na escola. Passei no vestibular
                  de Medicina!&quot;
                </p>
                <div className="font-semibold text-slate-900">
                  - João Silva, Aluno.
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
