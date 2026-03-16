import Link from "next/link";
import { ReactNode } from "react";
import { logout } from "@/actions/auth.actions";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 hidden md:flex flex-col">
        <div className="p-6">
          <h2 className="text-xl font-bold text-white tracking-tight">Admin<span className="text-indigo-500">Panel</span></h2>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2">
          <Link href="/painel" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
            <i className="pi pi-home"></i> Informações Gerais
          </Link>
          <Link href="/agendamentos" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
            <i className="pi pi-calendar"></i> Agendamentos
          </Link>
          <Link href="/disponibilidade" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-white transition-colors">
            <i className="pi pi-clock"></i> Meus Horários
          </Link>
          <Link href="/conteudo" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-white transition-colors border-t border-slate-800 pt-5 mt-5">
            <i className="pi pi-pencil"></i> Conteúdo do Site
          </Link>
        </nav>

        <div className="p-4 border-t border-slate-800">
           <form action={logout}>
              <button type="submit" className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-lg text-rose-400 hover:bg-slate-800 hover:text-rose-300 transition-colors">
                <i className="pi pi-sign-out"></i> Sair do Painel
              </button>
           </form>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header (Opcional - simplificado para o escopo) */}
        <header className="md:hidden bg-slate-900 p-4 flex items-center justify-between text-white">
          <h2 className="font-bold">AdminPanel</h2>
          <form action={logout}><button className="text-rose-400"><i className="pi pi-sign-out"></i></button></form>
        </header>

        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-50 p-6 md:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}
