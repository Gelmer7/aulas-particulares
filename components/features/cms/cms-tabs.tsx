"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { TabView, TabPanel } from "primereact/tabview";
import { HomeCmsForm } from "./home-cms-form";
import { AboutCmsForm } from "./about-cms-form";
import { ServicesCmsForm } from "./services-cms-form";
import { TestimonialsCmsForm } from "./testimonials-cms-form";

export interface CmsTabsHandle {
  saveActive: () => void;
}

export const CmsTabs = forwardRef<
  CmsTabsHandle,
  {
    initialHome: Record<string, unknown> | null;
    initialAbout: Record<string, unknown> | null;
    initialServices: Record<string, unknown> | null;
    initialTestimonials: Record<string, unknown> | null;
    onMetaChange?: (meta: { canSave: boolean; label: string }) => void;
  }
>(
  (
    {
      initialHome,
      initialAbout,
      initialServices,
      initialTestimonials,
      onMetaChange,
    },
    ref,
  ) => {
    const [activeIndex, setActiveIndex] = useState(0);
    const homeSaveRef = useRef<(() => void) | null>(null);
    const aboutSaveRef = useRef<(() => void) | null>(null);

    useImperativeHandle(
      ref,
      () => ({
        saveActive: () => {
          if (activeIndex === 0 && homeSaveRef.current) homeSaveRef.current();
          if (activeIndex === 1 && aboutSaveRef.current) aboutSaveRef.current();
        },
      }),
      [activeIndex],
    );

    useEffect(() => {
      if (!onMetaChange) return;
      const canSave = activeIndex === 0 || activeIndex === 1;
      const label =
        activeIndex === 0
          ? "Salvar e Publicar (Home)"
          : activeIndex === 1
            ? "Salvar e Publicar (Sobre)"
            : "Salva automaticamente";
      onMetaChange({ canSave, label });
    }, [activeIndex, onMetaChange]);

    return (
      <TabView
        activeIndex={activeIndex}
        onTabChange={(e) => setActiveIndex(e.index)}
        className="bg-white shadow-sm border border-slate-100 px-3 py-3"
        pt={{
          navContainer: { className: "overflow-x-auto" },
          nav: { className: "flex gap-3 min-w-max" },
          tab: {
            className:
              "text-sm font-semibold p-2 pb-3 cursor-pointer transition-colors hover:text-indigo-600",
          },
          navContent: { className: "custom-scrollbar" },
        }}
      >
        <TabPanel
          header="Página Inicial"
          leftIcon="pi pi-home mr-2 text-slate-500"
        >
          <HomeCmsForm
            initialData={initialHome}
            onRegisterSave={(fn) => {
              homeSaveRef.current = fn;
            }}
            hideFooterSave
          />
        </TabPanel>
        <TabPanel
          header="Sobre a Professora"
          leftIcon="pi pi-user mr-2 text-slate-500"
        >
          <AboutCmsForm
            initialData={initialAbout}
            onRegisterSave={(fn) => {
              aboutSaveRef.current = fn;
            }}
            hideFooterSave
          />
        </TabPanel>
        <TabPanel
          header="Serviços Oferecidos"
          leftIcon="pi pi-list mr-2 text-slate-500"
        >
          <ServicesCmsForm initialData={initialServices} />
        </TabPanel>
        <TabPanel
          header="Depoimentos"
          leftIcon="pi pi-comments mr-2 text-slate-500"
        >
          <TestimonialsCmsForm initialData={initialTestimonials} />
        </TabPanel>
      </TabView>
    );
  },
);

CmsTabs.displayName = "CmsTabs";
