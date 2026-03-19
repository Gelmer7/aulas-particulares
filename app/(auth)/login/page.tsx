"use client";

import { useActionState } from "react";
import { login } from "@/actions/auth.actions";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Message } from "primereact/message";

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-3xl shadow-xl shadow-slate-200 border border-slate-100">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Painel da Professora
          </h1>
          <p className="text-sm text-slate-500 mt-2">
            Acesse suas métricas e agendamentos.
          </p>
        </div>

        <form action={formAction} className="flex flex-col gap-5">
          {state?.error && (
            <Message
              severity="error"
              text={state.error}
              className="w-full text-sm"
            />
          )}

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700">
              E-mail
            </label>
            <InputText
              name="email"
              type="email"
              required
              placeholder="admin@email.com"
              className="w-full p-3 border border-slate-300 rounded-lg"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700">
              Senha
            </label>
            <Password
              name="password"
              required
              feedback={false}
              toggleMask
              pt={{
                input: {
                  root: {
                    className: "w-full p-3 border border-slate-300 rounded-lg",
                  },
                },
              }}
            />
          </div>

          <Button
            type="submit"
            label={isPending ? "Entrando..." : "Entrar no Painel"}
            disabled={isPending}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold p-3 rounded-lg border-none mt-4 w-full"
          />
        </form>
      </div>
    </div>
  );
}
