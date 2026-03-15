"use client";
import { Button } from "primereact/button";
import { Message } from "primereact/message";

export default function DisponibilidadePage() {
  // Dados de mock (Simplificado para o estágio inicial)
  const days = [
      { id: 1, name: 'Segunda-feira', start: '08:00', end: '18:00', active: true },
      { id: 2, name: 'Terça-feira', start: '08:00', end: '18:00', active: true },
      { id: 3, name: 'Quarta-feira', start: '13:00', end: '20:00', active: true },
      { id: 4, name: 'Quinta-feira', start: '08:00', end: '12:00', active: false },
      { id: 5, name: 'Sexta-feira', start: '08:00', end: '18:00', active: true },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Grade de Horários</h1>
        <p className="text-slate-500 mt-1">Configure os horários em que os alunos podem agendar aulas no calendário frontal.</p>
      </div>

      <Message severity="info" text="Esta tela atualmente apresenta uma representação estática da lógica e necessitaria de conexão com as server actions criadas caso avance para os próximos deploy-steps." className="w-full text-sm" />

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-6 overflow-hidden">
        {days.map((d) => (
            <div key={d.id} className={`flex items-center justify-between p-4 rounded-xl border ${d.active ? 'border-indigo-100 bg-indigo-50/30' : 'border-slate-100 bg-slate-50 opacity-60'}`}>
               <div className="flex flex-col gap-1">
                  <span className="font-bold text-slate-800">{d.name}</span>
                  {d.active ? (
                     <span className="text-sm text-slate-500">Das {d.start} às {d.end}</span>
                  ) : (
                     <span className="text-sm text-rose-500 font-medium">Indisponível</span>
                  )}
               </div>
               <div>
                  <Button 
                      icon={d.active ? "pi pi-calendar-times" : "pi pi-calendar-plus"} 
                      className={`p-2 w-10 h-10 rounded-lg ${d.active ? 'bg-rose-100 text-rose-600 border-rose-200' : 'bg-slate-200 text-slate-600 border-slate-300'}`} 
                      tooltip={d.active ? 'Desativar dia' : 'Ativar dia'}
                      tooltipOptions={{ position: 'left' }}
                  />
               </div>
            </div>
        ))}
      </div>
    </div>
  );
}
