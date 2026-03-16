"use client";

import { useState, useTransition, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { Toast } from 'primereact/toast';
import { ImageUploader } from '@/components/ui/image-uploader';
import { saveSiteContent } from '@/actions/cms.actions';

export function HomeCmsForm({ initialData }: { initialData: any }) {
  const toast = useRef<Toast>(null);
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState({
     heroTitle: initialData?.heroTitle || "",
     heroSubtitle: initialData?.heroSubtitle || "",
     heroImage: initialData?.heroImage || null,
     ctaText: initialData?.ctaText || "Agendar Primeira Aula",
  });

  const handleSave = () => {
      startTransition(async () => {
         const res = await saveSiteContent('home_page', formData, 'hero');
         if (res.success) {
            toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: res.message });
         } else {
            toast.current?.show({ severity: 'error', summary: 'Erro', detail: res.message });
         }
      });
  };

  const handleImageUpload = (url: string) => {
      setFormData(prev => ({ ...prev, heroImage: url }));
  };

  return (
      <div className="flex flex-col gap-8 py-2">
          <Toast ref={toast} />
          <Message severity="info" text="Esta é a área principal onde os novos alunos têm o primeiro contato com você." />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
             <div className="flex flex-col gap-6">
                 <div className="flex flex-col gap-2">
                    <label className="font-semibold text-slate-700 text-sm">Título da Seção Hero</label>
                    <InputText 
                        value={formData.heroTitle} 
                        onChange={(e) => setFormData({...formData, heroTitle: e.target.value})} 
                        placeholder="Ex: Aprenda de forma definitiva..." 
                        className="w-full" 
                    />
                 </div>

                 <div className="flex flex-col gap-2">
                    <label className="font-semibold text-slate-700 text-sm">Subtítulo (Resumo)</label>
                    <InputTextarea 
                        rows={4} 
                        value={formData.heroSubtitle} 
                        onChange={(e) => setFormData({...formData, heroSubtitle: e.target.value})} 
                        placeholder="Mentoria personalizada focada em suas fraquezas..." 
                        className="w-full resize-none" 
                    />
                 </div>

                 <div className="flex flex-col gap-2">
                    <label className="font-semibold text-slate-700 text-sm">Texto do Botão Principal (CTA)</label>
                    <InputText 
                        value={formData.ctaText} 
                        onChange={(e) => setFormData({...formData, ctaText: e.target.value})} 
                        className="w-full" 
                    />
                 </div>
             </div>

             <div className="flex flex-col gap-2">
                 <label className="font-semibold text-slate-700 text-sm">Imagem Principal (Banner)</label>
                 <ImageUploader 
                    currentImageUrl={formData.heroImage} 
                    folderId="hero" 
                    onUploadSuccess={handleImageUpload} 
                 />
                 <p className="text-xs text-slate-500">Recomendado: 1200x800px. Fundo transparente se possível.</p>
             </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end">
              <Button 
                 label={isPending ? "Salvando..." : "Salvar e Publicar (Home)"} 
                 icon="pi pi-check" 
                 loading={isPending}
                 onClick={handleSave} 
                 className="bg-indigo-600 hover:bg-indigo-700 border-none px-6 py-3 font-bold" 
              />
          </div>
      </div>
  );
}
