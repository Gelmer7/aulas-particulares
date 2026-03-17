"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useTransition, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { getAvailableSlots, createTemporaryLock, releaseTemporaryLock, submitBooking } from "@/actions/booking.actions";
import { format } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";
import { ptBR } from "date-fns/locale";

const schema = z.object({
  student_name: z.string().min(2, "Nome muito curto"),
  student_email: z.string().email("Email inválido"),
  student_phone: z.string().min(10, "Telefone deve conter DDD"),
});

type BookingFormData = z.infer<typeof schema>;

export function BookingCalendar() {
  const [isPending, startTransition] = useTransition();
  const [responseMsg, setResponseMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // States for Booking Flow
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  
  const [selectedSlotIso, setSelectedSlotIso] = useState<string | null>(null);
  const [lockId, setLockId] = useState<string | null>(null);
  const [lockingSlot, setLockingSlot] = useState(false);

  const { control, handleSubmit, formState: { errors, isValid } } = useForm<BookingFormData>({
    resolver: zodResolver(schema),
    defaultValues: { student_name: "", student_email: "", student_phone: "" },
    mode: "onChange"
  });

  // Client timezone
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  useEffect(() => {
    if (!selectedDate) {
      setAvailableSlots([]);
      return;
    }

    const fetchSlots = async () => {
      setLoadingSlots(true);
      setSelectedSlotIso(null);
      setLockId(null);
      
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      try {
        const slots = await getAvailableSlots(dateStr, userTimezone);
        setAvailableSlots(slots);
      } catch (e) {
        console.error("Erro carregando vagas", e);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [selectedDate, userTimezone]);

  const handleSlotSelect = async (slotIso: string) => {
    if (lockId) {
      // Release old lock
      await releaseTemporaryLock(lockId);
    }

    setLockingSlot(true);
    const res = await createTemporaryLock(slotIso);
    setLockingSlot(false);

    if (res.success && res.lock_id) {
      setSelectedSlotIso(slotIso);
      setLockId(res.lock_id);
      setResponseMsg(null); // Clear errors
    } else {
      setSelectedSlotIso(null);
      setLockId(null);
      setResponseMsg({ type: 'error', text: res.message || "Horário indisponível momentaneamente." });
    }
  };

  const onSubmit = (data: BookingFormData) => {
    if (!selectedSlotIso || !lockId) {
       setResponseMsg({ type: 'error', text: "Você precisa selecionar e confirmar um horário disponível."});
       return;
    }

    setResponseMsg(null);
    const formData = new FormData();
    formData.append("student_name", data.student_name);
    formData.append("student_email", data.student_email);
    formData.append("student_phone", data.student_phone);
    formData.append("date_time", selectedSlotIso);
    formData.append("lock_id", lockId);

    startTransition(async () => {
      const res = await submitBooking(null, formData);
      if (res.success) {
        setResponseMsg({ type: 'success', text: res.message! });
      } else {
        setResponseMsg({ type: 'error', text: res.message || "Verifique os erros no formulário" });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 max-w-xl mx-auto bg-white p-6 sm:p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
      <div className="flex flex-col items-center mb-2 text-center">
         <h2 className="text-2xl font-bold text-slate-900 mb-1">Passo a Passo de Agendamento</h2>
         <p className="text-slate-500 text-sm">Fuso horário detectado: <strong className="text-indigo-600">{userTimezone}</strong></p>
      </div>

      {responseMsg && (
        <Message severity={responseMsg.type} text={responseMsg.text} className="w-full text-sm" />
      )}

      {/* 1. SELEÇÃO DE DATA E HORA */}
      <div className="flex flex-col gap-3">
         <h3 className="font-semibold text-slate-800 text-lg flex items-center gap-2">
            <span className="bg-indigo-100 text-indigo-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">1</span> 
            Escolha um Horário
         </h3>
         
         {!selectedSlotIso ? (
           <>
             <Calendar
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.value as Date)}
                minDate={new Date()}
                inline
                locale="pt-BR"
                className="w-full border rounded-xl overflow-hidden shadow-sm pt-2"
                pt={{ root: { className: 'w-full' } }}
             />

             {selectedDate && (
                <div className="mt-4 flex flex-col gap-2">
                  <span className="text-sm font-medium text-slate-600 border-b pb-2">Vagas para {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}</span>
                  
                  {loadingSlots ? (
                     <div className="text-center p-4 text-slate-500 animate-pulse text-sm">Buscando horários disponíveis...</div>
                  ) : availableSlots.length > 0 ? (
                     <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2 max-h-60 overflow-y-auto pr-2 pb-2">
                        {availableSlots.map(iso => {
                           const timeStr = formatInTimeZone(iso, userTimezone, "HH:mm");
                           return (
                             <Button 
                                type="button"
                                key={iso} 
                                label={timeStr} 
                                onClick={() => handleSlotSelect(iso)}
                                disabled={lockingSlot}
                                className="p-3 border border-slate-300 text-slate-700 bg-white hover:bg-slate-50 hover:border-indigo-400 transition-colors text-base font-medium rounded-xl" 
                             />
                           )
                        })}
                     </div>
                  ) : (
                     <div className="text-center p-4 text-slate-500 bg-slate-50 rounded-lg text-sm border border-slate-100">
                        Nenhuma aula disponível neste dia.
                     </div>
                  )}
                </div>
             )}
           </>
         ) : (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex justify-between items-center">
               <div className="flex flex-col">
                 <span className="text-sm text-green-700 font-medium">Horário Selecionado:</span>
                 <span className="text-lg font-bold text-green-900">{formatInTimeZone(selectedSlotIso, userTimezone, "dd/MM/yyyy 'às' HH:mm")}</span>
                 <span className="text-xs text-green-600 mt-1">Este horário está bloqueado para você por 5 minutos.</span>
               </div>
               <Button 
                 type="button" 
                 icon="pi pi-pencil" 
                 label="Alterar" 
                 onClick={async () => {
                    if (lockId) await releaseTemporaryLock(lockId);
                    setSelectedSlotIso(null);
                    setLockId(null);
                 }} 
                 className="p-button-text p-button-sm text-green-700" 
               />
            </div>
         )}
      </div>

      {/* 2. DADOS DO ALUNO */}
      <div className={`flex flex-col gap-3 transition-opacity duration-300 ${!selectedSlotIso ? 'opacity-40 pointer-events-none' : ''}`}>
         <h3 className="font-semibold text-slate-800 text-lg flex items-center gap-2 mt-2">
            <span className="bg-indigo-100 text-indigo-700 w-6 h-6 rounded-full flex items-center justify-center text-xs">2</span> 
            Seus Dados
         </h3>
         
          <div className="flex flex-col gap-1.5">
            <label htmlFor="student_name" className="text-sm font-semibold text-slate-700">Nome do Aluno</label>
            <Controller name="student_name" control={control} render={({ field }) => (
                <InputText id={field.name} {...field} placeholder="João da Silva" className={`p-2 border rounded-lg ${errors.student_name ? "border-red-500" : "border-slate-300"}`} />
              )} />
            {errors.student_name && <small className="text-red-500 text-xs font-medium">{errors.student_name.message}</small>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="student_email" className="text-sm font-semibold text-slate-700">E-mail</label>
            <Controller name="student_email" control={control} render={({ field }) => (
                <InputText id={field.name} type="email" placeholder="joao@gmail.com" {...field} className={`p-2 border rounded-lg ${errors.student_email ? "border-red-500" : "border-slate-300"}`} />
              )} />
            {errors.student_email && <small className="text-red-500 text-xs font-medium">{errors.student_email.message}</small>}
          </div>

          <div className="flex flex-col gap-1.5 border-b border-slate-100 pb-4">
            <label htmlFor="student_phone" className="text-sm font-semibold text-slate-700">WhatsApp (com DDD)</label>
            <Controller name="student_phone" control={control} render={({ field }) => (
                <InputText id={field.name} {...field} placeholder="11999999999" className={`p-2 border rounded-lg ${errors.student_phone ? "border-red-500" : "border-slate-300"}`} />
              )} />
            {errors.student_phone && <small className="text-red-500 text-xs font-medium">{errors.student_phone.message}</small>}
          </div>
      </div>

      <Button
        type="submit"
        label={isPending ? "Agendando..." : "Confirmar Agendamento"}
        icon={isPending ? "pi pi-spin pi-spinner" : "pi pi-check"}
        disabled={isPending || !selectedSlotIso || responseMsg?.type === 'success'}
        className={`bg-indigo-600 outline-none hover:bg-indigo-700 text-white border-0 font-bold p-4 rounded-xl mt-2 shadow-lg transition-colors w-full text-lg ${!selectedSlotIso ? 'opacity-50' : ''}`}
      />
    </form>
  );
}
