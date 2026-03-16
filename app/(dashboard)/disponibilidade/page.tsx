import { getAvailabilityRules, getAvailabilityExceptions } from "@/actions/availability.actions";
import { AvailabilityManager } from "@/components/features/dashboard/availability-manager";

export const revalidate = 0; // Evita cache forte para dashboard

export default async function DisponibilidadePage() {
  const { data: rules } = await getAvailabilityRules();
  const { data: exceptions } = await getAvailabilityExceptions();

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Gerenciar Grade de Horários</h1>
        <p className="text-slate-500 mt-1">Configure blocos de tempo recorrentes e gerencie exceções e bloqueios na sua agenda.</p>
      </div>

      <AvailabilityManager 
        initialRules={rules || []} 
        initialExceptions={exceptions || []} 
      />
    </div>
  );
}
