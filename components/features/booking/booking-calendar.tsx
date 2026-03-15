"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useState, useTransition } from "react";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { submitBooking } from "@/actions/booking.actions";

// Replicamos a validação básica do backend para o CSR
const schema = z.object({
  student_name: z.string().min(2, "Nome muito curto"),
  student_email: z.string().email("Email inválido"),
  student_phone: z.string().min(10, "Telefone deve conter DDD"),
  date_time: z.date(),
});

type BookingFormData = z.infer<typeof schema>;

export function BookingCalendar() {
  const [isPending, startTransition] = useTransition();
  const [responseMsg, setResponseMsg] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const { control, handleSubmit, formState: { errors } } = useForm<BookingFormData>({
    resolver: zodResolver(schema),
    defaultValues: { student_name: "", student_email: "", student_phone: "" }
  });

  const onSubmit = (data: BookingFormData) => {
    setResponseMsg(null);
    const formData = new FormData();
    formData.append("student_name", data.student_name);
    formData.append("student_email", data.student_email);
    formData.append("student_phone", data.student_phone);
    formData.append("date_time", data.date_time.toISOString());

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
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5 max-w-md mx-auto bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100">
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Detalhes da Aula</h2>

      {responseMsg && (
        <Message severity={responseMsg.type} text={responseMsg.text} className="w-full mb-2 text-sm" />
      )}

      <div className="flex flex-col gap-1.5">
        <label htmlFor="student_name" className="text-sm font-semibold text-slate-700">Nome do Aluno</label>
        <Controller
          name="student_name"
          control={control}
          render={({ field }) => (
            <InputText id={field.name} {...field} placeholder="João da Silva" className={`p-2 border rounded-lg ${errors.student_name ? "border-red-500" : "border-slate-300"}`} />
          )}
        />
        {errors.student_name && <small className="text-red-500 text-xs font-medium">{errors.student_name.message}</small>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="student_email" className="text-sm font-semibold text-slate-700">E-mail</label>
        <Controller
          name="student_email"
          control={control}
          render={({ field }) => (
            <InputText id={field.name} type="email" placeholder="joao@gmail.com" {...field} className={`p-2 border rounded-lg ${errors.student_email ? "border-red-500" : "border-slate-300"}`} />
          )}
        />
        {errors.student_email && <small className="text-red-500 text-xs font-medium">{errors.student_email.message}</small>}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="student_phone" className="text-sm font-semibold text-slate-700">WhatsApp (com DDD)</label>
        <Controller
          name="student_phone"
          control={control}
          render={({ field }) => (
            <InputText id={field.name} {...field} placeholder="11999999999" className={`p-2 border rounded-lg ${errors.student_phone ? "border-red-500" : "border-slate-300"}`} />
          )}
        />
        {errors.student_phone && <small className="text-red-500 text-xs font-medium">{errors.student_phone.message}</small>}
      </div>

      <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-100">
        <label htmlFor="date_time" className="text-sm font-semibold text-slate-700">Selecione Data e Hora (Estimativa)</label>
        <Controller
          name="date_time"
          control={control}
          render={({ field, fieldState }) => (
            <Calendar
              id={field.name}
              value={field.value}
              onChange={(e) => field.onChange(e.value)}
              showTime
              hourFormat="24"
              minDate={new Date()}
              placeholder="Clique para abrir o calendário"
              className={`w-full ${fieldState.error ? "p-invalid" : ""}`}
              pt={{
                input: { root: { className: 'w-full p-2 border border-slate-300 rounded-lg' } }
              }}
            />
          )}
        />
        {errors.date_time && <small className="text-red-500 text-xs font-medium">{errors.date_time.message}</small>}
      </div>

      <Button
        type="submit"
        label={isPending ? "Processando..." : "Solicitar Agendamento"}
        icon={isPending ? "pi pi-spin pi-spinner" : "pi pi-send"}
        disabled={isPending || responseMsg?.type === 'success'}
        className="bg-indigo-600 outline-none hover:bg-indigo-700 text-white border-0 font-bold p-3 rounded-lg mt-4 shadow-md transition-colors w-full"
      />
    </form>
  );
}
