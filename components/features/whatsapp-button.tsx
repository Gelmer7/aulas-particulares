"use client";

import { logAnalyticsEvent } from "@/actions/analytics.actions";
import { Button } from "primereact/button";

export function WhatsAppButton() {
  const handleWhatsAppClick = async () => {
    // Registra o evento de analytics silenciosamente (fire and forget)
    logAnalyticsEvent("whatsapp_click", {
      source: "floating_button",
      url: window.location.pathname,
    });

    // Redireciona para o WhatsApp
    const phoneNumber = "5511999999999";
    const message = encodeURIComponent(
      "Olá! Estou vindo do site e gostaria de saber mais sobre as aulas particulares.",
    );
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] group">
      {/* Tooltip Hover */}
      <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 px-4 py-2 bg-white text-slate-800 text-sm font-semibold rounded-xl shadow-lg border border-slate-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
        Fale comigo no WhatsApp!
      </div>

      {/* Botão */}
      <Button
        onClick={handleWhatsAppClick}
        className="p-button-rounded w-16 h-16 shadow-2xl flex items-center justify-center hover:scale-110 transition-transform duration-300 bg-green-500 border-none"
        aria-label="Contato via WhatsApp"
      >
        <i className="pi pi-whatsapp text-4xl text-white"></i>
      </Button>

      {/* Ping Animation */}
      <span
        className="absolute -inset-1 rounded-full border-2 border-green-400 opacity-0 animate-ping"
        style={{ animationDuration: "3s" }}
      ></span>
    </div>
  );
}
