"use client";

import { useState } from "react";
import Link from "next/link";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { logout } from "@/actions/auth.actions";

interface SidebarContentProps {
  onLinkClick: () => void;
}

const menuItems = [
  { label: "Informações Gerais", href: "/painel", icon: "pi pi-home" },
  { label: "Agendamentos", href: "/agendamentos", icon: "pi pi-calendar" },
  { label: "Meus Horários", href: "/disponibilidade", icon: "pi pi-clock" },
  { label: "Conteúdo do Site", href: "/conteudo", icon: "pi pi-pencil", extraClass: "border-t border-slate-800 pt-5 mt-5" },
];

const SidebarContent = ({ onLinkClick }: SidebarContentProps) => (
  <div className="flex flex-col h-full bg-slate-900">
    <div className="p-6">
      <h2 className="text-xl font-bold text-white tracking-tight">Admin<span className="text-indigo-500">Panel</span></h2>
    </div>
    
    <nav className="flex-1 px-4 py-6 space-y-2">
      {menuItems.map((item) => (
        <Link 
          key={item.href} 
          href={item.href} 
          onClick={onLinkClick}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 hover:text-white transition-colors ${item.extraClass || ''}`}
        >
          <i className={item.icon}></i> {item.label}
        </Link>
      ))}
    </nav>

    <div className="p-4 border-t border-slate-800">
       <form action={logout}>
          <button type="submit" className="flex items-center gap-3 px-4 py-3 w-full text-left rounded-lg text-rose-400 hover:bg-slate-800 hover:text-rose-300 transition-colors">
            <i className="pi pi-sign-out"></i> Sair do Painel
          </button>
       </form>
    </div>
  </div>
);

export function DashboardSidebar() {
  const [visible, setVisible] = useState(false);

  return (
    <>
      {/* Desktop Sidebar (Static) */}
      <aside className="w-64 bg-slate-900 text-slate-300 hidden md:flex flex-col shrink-0 min-h-screen">
        <SidebarContent onLinkClick={() => setVisible(false)} />
      </aside>

      {/* Mobile Trigger Header */}
      <header className="md:hidden bg-slate-900 p-4 flex items-center justify-between text-white sticky top-0 z-40">
        <h2 className="font-bold">AdminPanel</h2>
        <Button 
          icon="pi pi-bars" 
          onClick={() => setVisible(true)} 
          className="p-button-text p-button-sm text-white" 
        />
      </header>

      {/* Mobile Sidebar (Drawer) */}
      <Sidebar 
        visible={visible} 
        onHide={() => setVisible(false)} 
        className="bg-slate-900 text-slate-300 w-full sm:w-[280px] p-0"
        showCloseIcon={true}
      >
        <SidebarContent onLinkClick={() => setVisible(false)} />
      </Sidebar>
    </>
  );
}
