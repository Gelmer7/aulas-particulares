"use client";

import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { useRouter } from "next/navigation";
import { CmsTabs } from "@/components/features/cms/cms-tabs";

interface SiteEditorSidebarProps {
  initialHome: Record<string, any> | null;
  initialAbout: Record<string, any> | null;
  initialServices: Record<string, any> | null;
  initialTestimonials: Record<string, any> | null;
  visible?: boolean;
}

export function SiteEditorSidebar({
  initialHome,
  initialAbout,
  initialServices,
  initialTestimonials,
  visible = true
}: SiteEditorSidebarProps) {
  const router = useRouter();

  const handleClose = () => {
    if (typeof window !== "undefined") {
      const base = window.location.pathname;
      router.replace(base);
    }
  };

  return (
    <Sidebar
      visible={visible}
      position="right"
      onHide={handleClose}
      className="w-full sm:w-[420px] md:w-[520px] bg-white text-slate-800"
      showCloseIcon
      blockScroll
    >
      <div className="flex items-center justify-between pb-3 border-b">
        <h2 className="text-xl font-bold">Editor do Site</h2>
        <Button
          label="Fechar"
          icon="pi pi-times"
          className="p-button-text"
          onClick={handleClose}
        />
      </div>

      <div className="pt-4 space-y-4">
        <CmsTabs
          initialHome={initialHome || {}}
          initialAbout={initialAbout || {}}
          initialServices={initialServices || {}}
          initialTestimonials={initialTestimonials || {}}
        />
      </div>
    </Sidebar>
  );
}
