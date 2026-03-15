"use client";

import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { updateAppointmentStatus } from "@/actions/admin.actions";
import { useTransition } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export function AppointmentsTable({ appointments }: { appointments: any[] }) {
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (id: string, newStatus: string) => {
    startTransition(async () => {
       await updateAppointmentStatus(id, newStatus);
    });
  };

  const statusBodyTemplate = (rowData: any) => {
    const severityMap: Record<string, 'success' | 'warning' | 'danger' | 'info'> = {
        'Confirmado': 'success',
        'Pendente': 'warning',
        'Cancelado': 'danger',
        'Remarcado': 'info'
    };
    return <Tag value={rowData.status} severity={severityMap[rowData.status] || 'info'} className="px-3" />;
  };

  const actionBodyTemplate = (rowData: any) => {
    return (
      <div className="flex gap-2">
        <Button 
          icon="pi pi-check" 
          className="p-button-rounded p-button-outlined p-button-success p-2 w-10 h-10 border" 
          disabled={rowData.status === 'Confirmado' || isPending}
          onClick={() => handleStatusChange(rowData.id, 'Confirmado')}
        />
        <Button 
          icon="pi pi-times" 
          className="p-button-rounded p-button-outlined p-button-danger p-2 w-10 h-10 border" 
          disabled={rowData.status === 'Cancelado' || isPending}
          onClick={() => handleStatusChange(rowData.id, 'Cancelado')}
        />
      </div>
    );
  };

  const dateBodyTemplate = (rowData: any) => {
    return (
        <div className="flex flex-col">
            <span className="font-semibold text-slate-800">{format(new Date(rowData.date_time), "dd 'de' MMMM, yyyy", { locale: ptBR })}</span>
            <span className="text-xs text-slate-500">{format(new Date(rowData.date_time), "HH:mm")}</span>
        </div>
    );
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <DataTable 
        value={appointments} 
        paginator 
        rows={10} 
        dataKey="id" 
        emptyMessage="Nenhum agendamento encontrado na base de dados."
        className="p-datatable-sm"
        rowHover
      >
        <Column field="student_name" header="Aluno" sortable className="font-medium text-slate-800"></Column>
        <Column field="student_email" header="E-mail" className="text-slate-600"></Column>
        <Column field="student_phone" header="WhatsApp" className="text-slate-600"></Column>
        <Column field="date_time" header="Data Solicitada" body={dateBodyTemplate} sortable></Column>
        <Column field="status" header="Status" body={statusBodyTemplate} sortable></Column>
        <Column body={actionBodyTemplate} align="center" style={{ minWidth: '8rem' }}></Column>
      </DataTable>
    </div>
  );
}
