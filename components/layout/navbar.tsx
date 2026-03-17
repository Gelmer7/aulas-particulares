"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "primereact/button";
import { Sidebar } from "primereact/sidebar";

export function Navbar() {
  const [visible, setVisible] = useState(false);

  const menuItems = [
    { label: "Início", href: "/" },
    { label: "Sobre mim", href: "/sobre" },
    { label: "Aulas e Serviços", href: "/servicos" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="font-bold text-xl text-indigo-900 tracking-tight">
            Química & Física
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-indigo-600 transition-colors">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-4">
          <div className="hidden sm:block">
            <Link href="/agendamento" passHref>
              <Button 
                label="Agendar Aula" 
                icon="pi pi-calendar-plus"
                className="p-button-rounded p-button-primary bg-indigo-600 hover:bg-indigo-700 border-none px-6 py-2 text-sm" 
              />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button 
            icon="pi pi-bars" 
            onClick={() => setVisible(true)} 
            className="p-button-text p-button-rounded text-indigo-900 md:hidden" 
            aria-label="Menu"
          />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <Sidebar 
        visible={visible} 
        onHide={() => setVisible(false)} 
        position="right"
        className="w-full sm:w-[300px]"
        header={
          <div className="font-bold text-xl text-indigo-900">Menu</div>
        }
      >
        <div className="flex flex-col gap-6 mt-4">
          {menuItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href} 
              onClick={() => setVisible(false)}
              className="text-lg font-medium text-slate-700 hover:text-indigo-600 border-b border-slate-100 pb-2"
            >
              {item.label}
            </Link>
          ))}
          <Link href="/agendamento" onClick={() => setVisible(false)} passHref>
            <Button 
              label="Agendar Aula" 
              icon="pi pi-calendar-plus"
              className="w-full p-button-primary bg-indigo-600 hover:bg-indigo-700 border-none py-3 font-bold mt-4" 
            />
          </Link>
        </div>
      </Sidebar>
    </header>
  );
}
