import { createClient } from "@/lib/supabase/server";

export const revalidate = 0;

export default async function DashboardHome() {
  const supabase = await createClient();

  // Buscar Status de Agendamentos
  const { count: pendingCount } = await supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('status', 'Pendente');
  const { count: confirmedCount } = await supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('status', 'Confirmado');
  const { count: completedCount } = await supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('status', 'Concluido');
  const { count: noShowCount } = await supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('status', 'No-Show');
  
  // Buscar Cliques WhatsApp
  const { count: wppClicks } = await supabase.from('analytics_events').select('*', { count: 'exact', head: true }).eq('event_type', 'whatsapp_click');

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Visão Geral</h1>
        <p className="text-slate-500 mt-1">Acompanhe seus resultados e o ciclo de vida dos agendamentos.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-14 h-14 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500">
               <i className="pi pi-clock text-2xl"></i>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Pendentes</p>
              <h3 className="text-3xl font-bold text-slate-800">{pendingCount ?? 0}</h3>
            </div>
         </div>

         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-500">
               <i className="pi pi-calendar-plus text-2xl"></i>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Confirmados</p>
              <h3 className="text-3xl font-bold text-slate-800">{confirmedCount ?? 0}</h3>
            </div>
         </div>

         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-14 h-14 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500">
               <i className="pi pi-check-circle text-2xl"></i>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">Aulas Concluídas</p>
              <h3 className="text-3xl font-bold text-slate-800">{completedCount ?? 0}</h3>
            </div>
         </div>
         
         <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center text-slate-400">
               <i className="pi pi-user-minus text-2xl"></i>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-500">No-Show (Faltas)</p>
              <h3 className="text-3xl font-bold text-slate-800">{noShowCount ?? 0}</h3>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         <div className="col-span-1 lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-8 h-64 flex flex-col items-center justify-center text-slate-400">
            <i className="pi pi-chart-bar text-4xl mb-4 text-slate-300"></i>
            <p>Gráficos de Conversão em Desenvolvimento...</p>
         </div>
         <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center gap-2">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-2">
               <i className="pi pi-whatsapp text-3xl"></i>
            </div>
            <h3 className="text-4xl font-bold text-slate-800">{wppClicks ?? 0}</h3>
            <p className="text-sm font-semibold text-slate-500">Cliques totais no WhatsApp<br/>(Público)</p>
         </div>
      </div>

    </div>
  );
}
