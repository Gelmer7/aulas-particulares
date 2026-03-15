import { createClient } from "@/lib/supabase/server";
import { AppointmentsTable } from "@/components/features/dashboard/appointments-table";

export const revalidate = 0;

export default async function AgendamentosPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('appointments')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Agendamentos</h1>
        <p className="text-slate-500 mt-1">Gerencie as solicitações de aula, confirme horários e libere vagas.</p>
      </div>
      
      <AppointmentsTable appointments={data || []} />
    </div>
  );
}
