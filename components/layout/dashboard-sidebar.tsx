"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { logout } from "@/actions/auth.actions";

interface SidebarContentProps {
  onLinkClick: () => void;
  collapsed: boolean;
}

const menuItems = [
  { label: "Informações Gerais", href: "/painel", icon: "pi pi-home" },
  { label: "Agendamentos", href: "/agendamentos", icon: "pi pi-calendar" },
  { label: "Meus Horários", href: "/disponibilidade", icon: "pi pi-clock" },
  { label: "Conteúdo do Site", href: "/conteudo", icon: "pi pi-pencil", extraClass: "border-t border-slate-800 pt-5 mt-5" },
];

const SidebarContent = ({ onLinkClick, collapsed }: SidebarContentProps) => (
  <div className="flex flex-col h-full bg-slate-900">
    <div className={`flex items-center justify-center ${collapsed ? "py-3" : "p-4"}`}>
      {collapsed ? (
        <span className="text-indigo-400 font-bold text-lg">AP</span>
      ) : (
        <h2 className="text-xl font-bold text-white tracking-tight">Admin<span className="text-indigo-500">Panel</span></h2>
      )}
    </div>
    
    <nav className={`flex-1 ${collapsed ? "px-1 py-2" : "px-3 py-4"} space-y-1`}>
      {menuItems.map((item) => (
        <Link 
          key={item.href} 
          href={item.href} 
          onClick={onLinkClick}
          className={`flex items-center ${collapsed ? "justify-center px-2 py-3" : "gap-3 px-3 py-3"} rounded-lg hover:bg-slate-800 hover:text-white transition-colors ${item.extraClass || ''}`}
        >
          <i className={item.icon}></i>
          {!collapsed && <span>{item.label}</span>}
        </Link>
      ))}
    </nav>

    <div className={`${collapsed ? "p-2" : "p-3"} border-t border-slate-800`}>
       <form action={logout}>
          <button type="submit" className={`flex items-center ${collapsed ? "justify-center px-2 py-3" : "gap-3 px-3 py-3"} w-full text-left rounded-lg text-rose-400 hover:bg-slate-800 hover:text-rose-300 transition-colors`}>
            <i className="pi pi-sign-out"></i> {!collapsed && "Sair do Painel"}
          </button>
       </form>
    </div>
  </div>
);

export function DashboardSidebar() {
  const [visible, setVisible] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("dashboardSidebarCollapsed");
      if (saved === "true") setCollapsed(true);
    } catch {}
  }, []);

  const toggleCollapsed = () => {
    const next = !collapsed;
    setCollapsed(next);
    try {
      localStorage.setItem("dashboardSidebarCollapsed", next ? "true" : "false");
    } catch {}
  };

  return (
    <>
      <aside className={`${collapsed ? "w-12" : "w-64"} bg-slate-900 text-slate-300 hidden md:flex flex-col shrink-0 min-h-screen relative`}>
        <button
          type="button"
          onClick={toggleCollapsed}
          className="absolute -right-3 top-4 z-50 bg-slate-900 text-white border border-slate-700 rounded-full h-6 w-6 flex items-center justify-center hover:bg-slate-800"
          aria-label={collapsed ? "Expandir menu" : "Recolher menu"}
          title={collapsed ? "Expandir menu" : "Recolher menu"}
        >
          <i className={`pi ${collapsed ? "pi-angle-right" : "pi-angle-left"} text-xs`}></i>
        </button>
        <SidebarContent onLinkClick={() => setVisible(false)} collapsed={collapsed} />
      </aside>

      <header className="md:hidden bg-slate-900 p-4 flex items-center justify-between text-white sticky top-0 z-40">
        <h2 className="font-bold">AdminPanel</h2>
        <Button 
          icon="pi pi-bars" 
          onClick={() => setVisible(true)} 
          className="p-button-text p-button-sm text-white" 
        />
      </header>

      <Sidebar 
        visible={visible} 
        onHide={() => setVisible(false)} 
        className="bg-slate-900 text-slate-300 w-full sm:w-[280px] p-0"
        showCloseIcon={true}
      >
        <SidebarContent onLinkClick={() => setVisible(false)} collapsed={false} />
      </Sidebar>
    </>
  );
}
