import { createClient } from "@/lib/supabase/server";

export const revalidate = 0; // Impede cache forte do Next já que é Dashboard vivo

export default async function DashboardHome() {
  const supabase = await createClient();

  // Buscar Status de Agendamentos
  const { count: pendingCount } = await supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('status', 'Pendente');
  const { count: confirmedCount } = await supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('status', 'Confirmado');
  
  // Buscar Cliques WhatsApp
  const { count: wppClicks } = await supabase.from('analytics_events').select('*', { count: 'exact', head: true }).eq('event_type', 'whatsapp_click');

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Visão Geral</h1>
        <p className="text-slate-500 mt-1">Acompanhe seus resultados e agendamentos.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-14 h-14 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
               <i className="pi pi-clock text-2xl"></i>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Agendamentos Pendentes</p>
              <h3 className="text-3xl font-bold text-slate-800">{pendingCount ?? 0}</h3>
            </div>
         </div>

         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
               <i className="pi pi-check-circle text-2xl"></i>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Agendamentos Confirmados</p>
              <h3 className="text-3xl font-bold text-slate-800">{confirmedCount ?? 0}</h3>
            </div>
         </div>

         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-14 h-14 bg-green-50 rounded-xl flex items-center justify-center text-green-500">
               <i className="pi pi-whatsapp text-2xl"></i>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Cliques no WhatsApp</p>
              <h3 className="text-3xl font-bold text-slate-800">{wppClicks ?? 0}</h3>
            </div>
         </div>
      </div>

      {/* Placeholders for Graphics / Last Activity */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 h-64 flex flex-col items-center justify-center text-slate-400">
         <i className="pi pi-chart-bar text-4xl mb-4 text-slate-300"></i>
         <p>Gráficos em Desenvolvimento...</p>
      </div>

    </div>
  );
}
