"use client";

import { useState, useCallback, useMemo, useTransition } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { InputMask } from 'primereact/inputmask';
import { InputNumber } from 'primereact/inputnumber';
import { Calendar as PrimeCalendar } from 'primereact/calendar';
import { Checkbox } from 'primereact/checkbox';
import { Message } from 'primereact/message';

import { saveAvailabilityRule, saveAvailabilityException, deleteAvailabilityRule, deleteAvailabilityException } from '@/actions/availability.actions';
import { AvailabilityRule, AvailabilityException } from '@/types/database.types';

const locales = {
  'pt-BR': ptBR,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const DAYS = [
  { label: 'Domingo', value: 0 },
  { label: 'Segunda-feira', value: 1 },
  { label: 'Terça-feira', value: 2 },
  { label: 'Quarta-feira', value: 3 },
  { label: 'Quinta-feira', value: 4 },
  { label: 'Sexta-feira', value: 5 },
  { label: 'Sábado', value: 6 },
];

export function AvailabilityManager({ 
  initialRules, 
  initialExceptions 
}: { 
  initialRules: AvailabilityRule[], 
  initialExceptions: AvailabilityException[] 
}) {
  const [view, setView] = useState<any>(Views.WEEK);
  const [date, setDate] = useState(new Date());
  const [isPending, startTransition] = useTransition();

  // Dialog States
  const [ruleDialog, setRuleDialog] = useState(false);
  const [excDialog, setExcDialog] = useState(false);
  const [activeEvent, setActiveEvent] = useState<any>(null);

  // Form States (New Rule)
  const [rDay, setRDay] = useState(1);
  const [rStart, setRStart] = useState("08:00");
  const [rEnd, setREnd] = useState("18:00");
  const [rDuration, setRDuration] = useState(60);
  const [rBuffer, setRBuffer] = useState(0);

  // Form States (New Exception)
  const [eDate, setEDate] = useState<Date | null>(new Date());
  const [eFullDay, setEFullDay] = useState(true);
  const [eStart, setEStart] = useState("00:00");
  const [eEnd, setEEnd] = useState("23:59");
  const [eReason, setEReason] = useState("");

  const events = useMemo(() => {
    const evts: any[] = [];
    const startOfCurrentWeek = startOfWeek(date, { locale: ptBR });
    
    initialRules.forEach(rule => {
      if (!rule.is_active) return;
      
      const eventDate = new Date(startOfCurrentWeek);
      eventDate.setDate(eventDate.getDate() + rule.day_of_week);
      
      const [startHour, startMin] = rule.start_time.split(':').map(Number);
      const [endHour, endMin] = rule.end_time.split(':').map(Number);
      
      const start = new Date(eventDate);
      start.setHours(startHour, startMin, 0);
      
      const end = new Date(eventDate);
      end.setHours(endHour, endMin, 0);

      evts.push({
        id: `rule_${rule.id}`,
        title: `Disponível (${rule.slot_duration_minutes}m)`,
        start,
        end,
        resource: rule,
        type: 'rule'
      });
    });

    initialExceptions.forEach(exc => {
      const exceptionDate = new Date(exc.exception_date + 'T00:00:00');
      const start = new Date(exceptionDate);
      const end = new Date(exceptionDate);

      if (exc.is_full_day_blocked) {
        start.setHours(0, 0, 0);
        end.setHours(23, 59, 59);
      } else if (exc.start_time && exc.end_time) {
        const [sh, sm] = exc.start_time.split(':').map(Number);
        const [eh, em] = exc.end_time.split(':').map(Number);
        start.setHours(sh, sm, 0);
        end.setHours(eh, em, 0);
      }

      evts.push({
        id: `exc_${exc.id}`,
        title: exc.reason || 'Bloqueado',
        start,
        end,
        resource: exc,
        type: 'exception'
      });
    });

    return evts;
  }, [initialRules, initialExceptions, date]);

  const eventPropGetter = useCallback((event: any) => {
    if (event.type === 'exception') {
      return { className: 'bg-rose-500 border-rose-600 text-white shadow-sm rounded-md' };
    }
    return { className: 'bg-indigo-500 border-indigo-600 text-white shadow-sm rounded-md' };
  }, []);

  const handleSelectEvent = (event: any) => {
    setActiveEvent(event);
  };

  const handleSaveRule = () => {
    startTransition(async () => {
      await saveAvailabilityRule({
        day_of_week: rDay,
        start_time: `${rStart}:00`,
        end_time: `${rEnd}:00`,
        slot_duration_minutes: rDuration,
        buffer_minutes: rBuffer,
        is_active: true
      });
      setRuleDialog(false);
    });
  };

  const handleDeleteRule = () => {
    if (!activeEvent || activeEvent.type !== 'rule') return;
    startTransition(async () => {
      await deleteAvailabilityRule(activeEvent.resource.id);
      setActiveEvent(null);
    });
  };

  const handleSaveException = () => {
    if (!eDate) return;
    startTransition(async () => {
      const year = eDate.getFullYear();
      const month = String(eDate.getMonth() + 1).padStart(2, '0');
      const day = String(eDate.getDate()).padStart(2, '0');
      
      await saveAvailabilityException({
        exception_date: `${year}-${month}-${day}`,
        is_full_day_blocked: eFullDay,
        start_time: eFullDay ? null : `${eStart}:00`,
        end_time: eFullDay ? null : `${eEnd}:00`,
        reason: eReason
      });
      setExcDialog(false);
    });
  };

  const handleDeleteException = () => {
    if (!activeEvent || activeEvent.type !== 'exception') return;
    startTransition(async () => {
      await deleteAvailabilityException(activeEvent.resource.id);
      setActiveEvent(null);
    });
  };

  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col h-[700px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-800">Grade de Horários</h2>
        <div className="flex gap-2">
            <Button label="Nova Exceção" icon="pi pi-calendar-times" className="p-button-outlined p-button-danger p-2 text-sm" onClick={() => setExcDialog(true)} />
            <Button label="Nova Regra" icon="pi pi-plus" className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 text-sm border-none" onClick={() => setRuleDialog(true)} />
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <BigCalendar
          localizer={localizer}
          events={events}
          date={date}
          view={view}
          onNavigate={setDate}
          onView={setView}
          defaultView={Views.WEEK}
          views={['week', 'month', 'day']}
          step={60}
          timeslots={1}
          culture="pt-BR"
          eventPropGetter={eventPropGetter}
          onSelectEvent={handleSelectEvent}
          messages={{
            today: 'Hoje', previous: 'Anterior', next: 'Próximo', month: 'Mês', week: 'Semana', day: 'Dia', agenda: 'Agenda', date: 'Data', time: 'Hora', event: 'Evento', noEventsInRange: 'Não há eventos neste período.', showMore: (total) => `+ mais ${total}`
          }}
          className="font-sans text-sm rounded-lg"
        />
      </div>

      {/* Detail Dialog */}
      <Dialog visible={!!activeEvent} onHide={() => setActiveEvent(null)} header="Detalhes do Bloco" style={{ width: '400px' }}>
        {activeEvent && (
           <div className="flex flex-col gap-4">
             <div className="p-4 bg-slate-50 rounded-lg border">
                <p><strong>Tipo:</strong> {activeEvent.type === 'rule' ? 'Regra Recorrente' : 'Exceção/Bloqueio'}</p>
                <p><strong>Início:</strong> {format(activeEvent.start, "dd/MM/yyyy HH:mm")}</p>
                <p><strong>Fim:</strong> {format(activeEvent.end, "dd/MM/yyyy HH:mm")}</p>
                {activeEvent.type === 'rule' && (
                  <>
                    <p><strong>Duração (aula):</strong> {activeEvent.resource.slot_duration_minutes}m</p>
                    <p><strong>Pausa:</strong> {activeEvent.resource.buffer_minutes}m</p>
                  </>
                )}
                {activeEvent.type === 'exception' && (
                  <p><strong>Motivo:</strong> {activeEvent.resource.reason}</p>
                )}
             </div>
             <Button 
                label={isPending ? "Excluindo..." : "Excluir Este Bloco"} 
                icon="pi pi-trash" 
                className="p-button-danger w-full" 
                disabled={isPending}
                onClick={activeEvent.type === 'rule' ? handleDeleteRule : handleDeleteException} 
             />
           </div>
        )}
      </Dialog>

      {/* New Rule Dialog */}
      <Dialog visible={ruleDialog} onHide={() => setRuleDialog(false)} header="Nova Regra Recorrente" style={{ width: '450px' }}>
        <div className="flex flex-col gap-4 mt-2">
           <Message severity="info" text="Cria um bloco de horário disponível todas as semanas nesse dia." />
           <div className="flex flex-col gap-2">
             <label className="text-sm font-semibold">Dia da Semana</label>
             <Dropdown value={rDay} onChange={(e) => setRDay(e.value)} options={DAYS} className="w-full border p-2" />
           </div>
           <div className="grid grid-cols-2 gap-4">
             <div className="flex flex-col gap-2">
               <label className="text-sm font-semibold">Hora Início</label>
               <InputMask value={rStart} onChange={(e) => setRStart(e.target.value as string)} mask="99:99" placeholder="08:00" className="w-full border p-2" />
             </div>
             <div className="flex flex-col gap-2">
               <label className="text-sm font-semibold">Hora Fim</label>
               <InputMask value={rEnd} onChange={(e) => setREnd(e.target.value as string)} mask="99:99" placeholder="18:00" className="w-full border p-2" />
             </div>
           </div>
           <div className="grid grid-cols-2 gap-4">
             <div className="flex flex-col gap-2">
               <label className="text-sm font-semibold">Duração da Aula (min)</label>
               <InputNumber value={rDuration} onValueChange={(e) => setRDuration(e.value || 60)} className="w-full border" pt={{ input: { root: { className: 'p-2 w-full' } } }} />
             </div>
             <div className="flex flex-col gap-2">
               <label className="text-sm font-semibold">Pausa/Buffer (min)</label>
               <InputNumber value={rBuffer} onValueChange={(e) => setRBuffer(e.value || 0)} className="w-full border" pt={{ input: { root: { className: 'p-2 w-full' } } }} />
             </div>
           </div>
           <Button label={isPending ? "Salvando..." : "Salvar Regra"} onClick={handleSaveRule} disabled={isPending} className="bg-indigo-600 border-none text-white font-bold p-3 mt-4" />
        </div>
      </Dialog>

      {/* New Exception Dialog */}
      <Dialog visible={excDialog} onHide={() => setExcDialog(false)} header="Nova Exceção / Férias" style={{ width: '450px' }}>
         <div className="flex flex-col gap-4 mt-2">
           <Message severity="warn" text="Exceções bloqueiam horários ou o dia inteiro, impedindo novos agendamentos." />
           <div className="flex flex-col gap-2">
             <label className="text-sm font-semibold">Data</label>
             <PrimeCalendar value={eDate} onChange={(e) => setEDate(e.value as Date)} dateFormat="dd/mm/yy" className="w-full" pt={{ input: { root: { className: 'w-full p-2 border' } } }} />
           </div>
           <div className="flex items-center gap-2">
             <Checkbox inputId="cb1" onChange={e => setEFullDay(e.checked || false)} checked={eFullDay}></Checkbox>
             <label htmlFor="cb1" className="text-sm">Bloquear o dia inteiro</label>
           </div>
           {!eFullDay && (
             <div className="grid grid-cols-2 gap-4">
               <div className="flex flex-col gap-2">
                 <label className="text-sm font-semibold">Hora Início Bloqueio</label>
                 <InputMask value={eStart} onChange={(e) => setEStart(e.target.value as string)} mask="99:99" placeholder="12:00" className="w-full border p-2" />
               </div>
               <div className="flex flex-col gap-2">
                 <label className="text-sm font-semibold">Hora Fim Bloqueio</label>
                 <InputMask value={eEnd} onChange={(e) => setEEnd(e.target.value as string)} mask="99:99" placeholder="14:00" className="w-full border p-2" />
               </div>
             </div>
           )}
           <div className="flex flex-col gap-2">
             <label className="text-sm font-semibold">Motivo (Opcional)</label>
             <InputText value={eReason} onChange={(e) => setEReason(e.target.value)} placeholder="Ex: Médico, Feriado..." className="w-full border p-2" />
           </div>
           <Button label={isPending ? "Salvando..." : "Salvar Exceção"} onClick={handleSaveException} disabled={isPending} className="bg-rose-500 hover:bg-rose-600 border-none text-white font-bold p-3 mt-4" />
         </div>
      </Dialog>

      <style jsx global>{`
        .rbc-calendar { font-family: var(--font-geist-sans); }
        .rbc-header { padding: 8px; font-weight: 600; color: #475569; border-bottom: 1px solid #e2e8f0; }
        .rbc-today { background-color: #f8fafc; }
        .rbc-event { padding: 4px 8px; }
        .rbc-time-view { border-radius: 0.5rem; border-color: #e2e8f0; }
        .p-dialog-mask { background-color: rgba(0,0,0,0.4); backdrop-filter: blur(2px); }
      `}</style>
    </div>
  );
}
