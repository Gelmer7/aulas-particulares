"use client";

import { useState, useTransition } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Tag } from "primereact/tag";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { updateAppointmentStatus, updateAppointmentDetails } from "@/actions/admin.actions";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const STATUS_OPTIONS = [
  { label: 'Pendente', value: 'Pendente' },
  { label: 'Confirmado', value: 'Confirmado' },
  { label: 'Cancelado', value: 'Cancelado' },
  { label: 'Concluido', value: 'Concluido' },
  { label: 'No-Show', value: 'No-Show' }
];

export function AppointmentsTable({ appointments }: { appointments: any[] }) {
  const [isPending, startTransition] = useTransition();
  const [activeItem, setActiveItem] = useState<any>(null);
  
  // Form State
  const [link, setLink] = useState("");
  const [notes, setNotes] = useState("");
  const [currentStatus, setCurrentStatus] = useState("");

  const handleOpenDetails = (app: any) => {
    setActiveItem(app);
    setLink(app.meeting_link || "");
    setNotes(app.internal_notes || "");
    setCurrentStatus(app.status);
  };

  const handleSaveDetails = () => {
    if (!activeItem) return;
    startTransition(async () => {
       await updateAppointmentDetails(activeItem.id, { meeting_link: link, internal_notes: notes });
       if (currentStatus !== activeItem.status) {
         await updateAppointmentStatus(activeItem.id, currentStatus);
       }
       setActiveItem(null);
    });
  };

  const statusBodyTemplate = (rowData: any) => {
    const severityMap: Record<string, 'success' | 'warning' | 'danger' | 'info' | 'secondary'> = {
        'Confirmado': 'info',
        'Pendente': 'warning',
        'Cancelado': 'danger',
        'Concluido': 'success',
        'No-Show': 'secondary'
    };
    return <Tag value={rowData.status} severity={severityMap[rowData.status] || 'info'} className="px-3 py-1 text-xs" />;
  };

  const actionBodyTemplate = (rowData: any) => {
    return (
      <div className="flex gap-2 justify-center">
        <Button 
          icon="pi pi-search" 
          tooltip="Ver Detalhes e Status"
          className="p-button-rounded p-button-outlined p-button-info p-2 w-10 h-10 border" 
          onClick={() => handleOpenDetails(rowData)}
        />
      </div>
    );
  };

  const dateBodyTemplate = (rowData: any) => {
    return (
        <div className="flex flex-col">
            <span className="font-semibold text-slate-800">{format(new Date(rowData.date_time), "dd 'de' MMM, yyyy", { locale: ptBR })}</span>
            <span className="text-xs text-slate-500 font-medium">{format(new Date(rowData.date_time), "HH:mm")}</span>
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
        sortField="date_time"
        sortOrder={-1}
      >
        <Column field="student_name" header="Aluno" sortable className="font-medium text-slate-800"></Column>
        <Column field="student_phone" header="WhatsApp" className="text-slate-600 text-sm"></Column>
        <Column field="date_time" header="Data Solicitada" body={dateBodyTemplate} sortable></Column>
        <Column field="status" header="Status" body={statusBodyTemplate} sortable></Column>
        <Column body={actionBodyTemplate} align="center" style={{ minWidth: '6rem' }}></Column>
      </DataTable>

      <Dialog visible={!!activeItem} onHide={() => setActiveItem(null)} header="Detalhes do Agendamento" style={{ width: '500px' }} modal>
         {activeItem && (
            <div className="flex flex-col gap-4 mt-2">
               <div className="p-4 bg-slate-50 border rounded-lg text-sm flex flex-col gap-1">
                  <p><strong>Nome:</strong> {activeItem.student_name}</p>
                  <p><strong>E-mail:</strong> {activeItem.student_email}</p>
                  <p><strong>Data:</strong> {format(new Date(activeItem.date_time), "dd/MM/yyyy HH:mm")}</p>
                  <p><strong>Timezone Local:</strong> {activeItem.student_timezone || 'America/Sao_Paulo'}</p>
               </div>

               <div className="flex flex-col gap-2">
                 <label className="text-sm font-semibold">Alterar Status</label>
                 <Dropdown value={currentStatus} onChange={(e) => setCurrentStatus(e.value)} options={STATUS_OPTIONS} className="w-full border" />
               </div>

               <div className="flex flex-col gap-2">
                 <label className="text-sm font-semibold">Link da Videochamada (Opcional)</label>
                 <InputText value={link} onChange={(e) => setLink(e.target.value)} placeholder="https://meet.google.com/..." className="w-full border p-2" />
               </div>

               <div className="flex flex-col gap-2">
                 <label className="text-sm font-semibold">Anotações Internas (Só você vê)</label>
                 <InputTextarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} className="w-full border p-2" placeholder="Dúvidas do aluno, tópicos..." />
               </div>

               <div className="flex gap-2 mt-4">
                  <Button label="Cancelar" icon="pi pi-times" onClick={() => setActiveItem(null)} className="p-button-text p-button-secondary w-full" disabled={isPending} />
                  <Button label={isPending ? "Salvando..." : "Salvar Alterações"} icon={isPending ? "pi pi-spin pi-spinner" : "pi pi-check"} onClick={handleSaveDetails} disabled={isPending} className="bg-indigo-600 text-white font-bold w-full p-3 border-none shadow-md" />
               </div>
            </div>
         )}
      </Dialog>
    </div>
  );
}
