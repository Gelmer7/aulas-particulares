"use client";

import { useState, useTransition, useRef } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { Toast } from 'primereact/toast';
import { RichEditor } from '@/components/ui/rich-editor';
import { ImageUploader } from '@/components/ui/image-uploader';
import { saveSiteContent } from '@/actions/cms.actions';

export function AboutCmsForm({ initialData }: { initialData: any }) {
  const toast = useRef<Toast>(null);
  const [isPending, startTransition] = useTransition();

  const [formData, setFormData] = useState({
     aboutTitle: initialData?.aboutTitle || "Sobre a Professora",
     aboutBio: initialData?.aboutBio || "<p>Escreva sua biografia aqui...</p>",
     profileImage: initialData?.profileImage || null,
  });

  const handleSave = () => {
      startTransition(async () => {
         const res = await saveSiteContent('about_page', formData, 'about');
         if (res.success) {
            toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: res.message });
         } else {
            toast.current?.show({ severity: 'error', summary: 'Erro', detail: res.message });
         }
      });
  };

  const handleImageUpload = (url: string) => {
      setFormData(prev => ({ ...prev, profileImage: url }));
  };

  return (
      <div className="flex flex-col gap-8 py-2">
          <Toast ref={toast} />
          
          <div className="flex flex-col gap-6">
              <div className="flex flex-col md:flex-row gap-8">
                  <div className="flex flex-col gap-2 w-full md:w-1/3">
                      <label className="font-semibold text-slate-700 text-sm">Foto de Perfil</label>
                      <ImageUploader 
                         currentImageUrl={formData.profileImage} 
                         folderId="about" 
                         onUploadSuccess={handleImageUpload} 
                      />
                      <p className="text-xs text-slate-500">Uma foto amigável e profissional gera mais confiança.</p>
                  </div>
                  
                  <div className="flex flex-col gap-4 w-full md:w-2/3">
                      <div className="flex flex-col gap-2">
                         <label className="font-semibold text-slate-700 text-sm">Título da Seção Sobre</label>
                         <InputText 
                             value={formData.aboutTitle} 
                             onChange={(e) => setFormData({...formData, aboutTitle: e.target.value})} 
                             placeholder="Ex: Conheça sua futura mentora" 
                             className="w-full max-w-md" 
                         />
                      </div>
                      
                      <div className="flex flex-col gap-2 mt-2">
                         <label className="font-semibold text-slate-700 text-sm">Biografia Completa</label>
                         <Message severity="warn" text="Use negrito para destacar sua experiência e qualidades principais." className="w-full text-xs py-2" />
                         <RichEditor 
                            value={formData.aboutBio} 
                            onChange={(html) => setFormData({...formData, aboutBio: html})} 
                            style={{ height: '300px' }}
                         />
                      </div>
                  </div>
              </div>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end">
              <Button 
                 label={isPending ? "Salvando..." : "Salvar e Publicar (Sobre)"} 
                 icon="pi pi-check" 
                 loading={isPending}
                 onClick={handleSave} 
                 className="bg-indigo-600 hover:bg-indigo-700 border-none px-6 py-3 font-bold" 
              />
          </div>
      </div>
  );
}
