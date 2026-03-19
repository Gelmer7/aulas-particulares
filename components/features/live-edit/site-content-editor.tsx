"use client";

import { useEffect, useRef, useState } from "react";
import { CmsTabs, CmsTabsHandle } from "@/components/features/cms/cms-tabs";
import { Button } from "primereact/button";

export function SiteContentEditor({
  initialHome,
  initialAbout,
  initialServices,
  initialTestimonials,
}: {
  initialHome: Record<string, unknown> | null;
  initialAbout: Record<string, unknown> | null;
  initialServices: Record<string, unknown> | null;
  initialTestimonials: Record<string, unknown> | null;
}) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeKey, setIframeKey] = useState(0);
  const [collapsed, setCollapsed] = useState(false);
  const cmsRef = useRef<CmsTabsHandle>(null);
  const [saveLabel, setSaveLabel] = useState("Salvar");
  const [canSave, setCanSave] = useState(false);
  const [device, setDevice] = useState<
    "mobile" | "tablet" | "desktop" | "full"
  >("desktop");

  useEffect(() => {
    setIframeKey(Date.now());
    const onSaved = () => setIframeKey(Date.now());
    window.addEventListener("cms:contentSaved", onSaved);
    return () => window.removeEventListener("cms:contentSaved", onSaved);
  }, []);

  const deviceWidthPx = (() => {
    switch (device) {
      case "mobile":
        return 390; // iPhone 12/13 Pro width-ish
      case "tablet":
        return 768; // iPad portrait width
      case "desktop":
        return 1280; // Standard desktop breakpoint
      case "full":
      default:
        return null;
    }
  })();

  return (
    <div className="h-screen w-full overflow-hidden flex">
      <div className={`${collapsed ? "w-0" : "w-[40%]"} h-full overflow-hidde`}>
        <div className="h-full w-full flex flex-col">
          <div className="flex items-center justify-between px-2 py-1 ">
            <div className="text-sm font-semibold">Editor</div>
            <div className="flex items-center gap-2">
              {canSave && (
                <Button
                  type="button"
                  label={saveLabel}
                  icon="pi pi-check"
                  className="p-button-sm bg-indigo-600 border-none"
                  onClick={() => cmsRef.current?.saveActive()}
                />
              )}
              <Button
                type="button"
                icon={collapsed ? "pi pi-angle-right" : "pi pi-angle-left"}
                className="p-button-text p-button-sm"
                onClick={() => setCollapsed(!collapsed)}
                aria-label={collapsed ? "Expandir editor" : "Recolher editor"}
                tooltip={collapsed ? "Expandir editor" : "Recolher editor"}
              />
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <CmsTabs
              ref={cmsRef}
              initialHome={initialHome || {}}
              initialAbout={initialAbout || {}}
              initialServices={initialServices || {}}
              initialTestimonials={initialTestimonials || {}}
              onMetaChange={({ canSave, label }) => {
                setCanSave(canSave);
                setSaveLabel(label);
              }}
            />
          </div>
        </div>
      </div>
      <div
        className={`${collapsed ? "w-full" : "w-[60%]"} h-full overflow-hidden`}
      >
        <div className="h-full w-full flex flex-col">
          <div className="flex items-center justify-between px-2 py-1 border-b border-slate-200">
            <div className="text-sm font-semibold">Pré-visualização</div>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                label="Celular"
                icon="pi pi-mobile"
                className={`p-button-text p-button-sm ${device === "mobile" ? "text-indigo-600" : ""}`}
                onClick={() => setDevice("mobile")}
              />
              <Button
                type="button"
                label="Tablet"
                icon="pi pi-tablet"
                className={`p-button-text p-button-sm ${device === "tablet" ? "text-indigo-600" : ""}`}
                onClick={() => setDevice("tablet")}
              />
              <Button
                type="button"
                label="Desktop"
                icon="pi pi-desktop"
                className={`p-button-text p-button-sm ${device === "desktop" ? "text-indigo-600" : ""}`}
                onClick={() => setDevice("desktop")}
              />
              <Button
                type="button"
                label="100%"
                icon="pi pi-arrows-h"
                className={`p-button-text p-button-sm ${device === "full" ? "text-indigo-600" : ""}`}
                onClick={() => setDevice("full")}
              />
            </div>
          </div>
          <div className="flex-1 overflow-hidden bg-slate-50 flex items-center justify-center">
            <div className="h-full flex items-center justify-center">
              <div
                className="h-[calc(100vh-2.5rem)] bg-white shadow-sm border border-slate-200 overflow-hidden"
                style={{ width: deviceWidthPx ? `${deviceWidthPx}px` : "100%" }}
              >
                <iframe
                  key={iframeKey}
                  ref={iframeRef}
                  src={`/?_preview=${iframeKey}`}
                  className="w-full h-full bg-white"
                  title="Pré-visualização do Site Público"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
