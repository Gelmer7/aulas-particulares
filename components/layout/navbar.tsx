"use client";

import Link from "next/link";
import { Button } from "primereact/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="font-bold text-xl text-indigo-900 tracking-tight">
            Química & Física
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link href="/" className="hover:text-indigo-600 transition-colors">Início</Link>
          <Link href="/sobre" className="hover:text-indigo-600 transition-colors">Sobre mim</Link>
          <Link href="/servicos" className="hover:text-indigo-600 transition-colors">Aulas e Serviços</Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/agendamento" passHref>
            <Button 
              label="Agendar Aula" 
              icon="pi pi-calendar-plus"
              className="p-button-rounded p-button-primary bg-indigo-600 hover:bg-indigo-700 border-none px-6 py-2 text-sm" 
            />
          </Link>
        </div>
      </div>
    </header>
  );
}
