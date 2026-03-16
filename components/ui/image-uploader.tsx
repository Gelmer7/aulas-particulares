"use client";

import { useState, useTransition, useRef } from 'react';
import { uploadMedia, deleteMedia } from '@/actions/cms.actions';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import Image from 'next/image';

interface ImageUploaderProps {
  currentImageUrl?: string;
  folderId?: string;
  onUploadSuccess: (url: string, path: string) => void;
  onDeleteSuccess?: () => void;
}

export function ImageUploader({ currentImageUrl, folderId = "general", onUploadSuccess, onDeleteSuccess }: ImageUploaderProps) {
  const [isPending, startTransition] = useTransition();
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const toast = useRef<Toast>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
       toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Por favor escolha uma imagem (JPG, PNG, WebP).' });
       return;
    }

    if (file.size > 5 * 1024 * 1024) {
       toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Imagem muito grande (Max 5MB).' });
       return;
    }

    // Gerar preview local
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    startTransition(() => {
       uploadMedia(file, folderId).then((res) => {
           if (res.success && res.url && res.path) {
              toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: 'Imagem salva com segurança.' });
              onUploadSuccess(res.url, res.path);
           } else {
              toast.current?.show({ severity: 'error', summary: 'Erro', detail: res.message || 'Erro no upload.' });
              // Reverter preview
              setPreview(currentImageUrl || null);
           }
       }).catch((err) => {
           toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Falha inesperada.' });
           setPreview(currentImageUrl || null);
       });
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <Toast ref={toast} />
      
      {preview ? (
        <div className="relative w-full max-w-sm rounded-xl overflow-hidden border border-slate-200 bg-slate-50 group aspect-[4/3] flex items-center justify-center">
            <Image 
               src={preview} 
               alt="Preview" 
               fill 
               className="object-contain" 
            />
            {isPending && (
               <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                  <i className="pi pi-spin pi-spinner text-4xl text-indigo-600"></i>
               </div>
            )}
            {!isPending && (
               <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button 
                    type="button" 
                    icon="pi pi-pencil" 
                    className="p-button-rounded p-button-info" 
                    aria-label="Trocar" 
                    onClick={() => document.getElementById(`uploader-${folderId}`)?.click()} 
                  />
                  {onDeleteSuccess && (
                     <Button 
                        type="button" 
                        icon="pi pi-trash" 
                        className="p-button-rounded p-button-danger" 
                        aria-label="Remover" 
                        onClick={onDeleteSuccess} 
                     />
                  )}
               </div>
            )}
        </div>
      ) : (
        <div 
           className="w-full max-w-sm rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex flex-col items-center justify-center p-8 cursor-pointer hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
           onClick={() => document.getElementById(`uploader-${folderId}`)?.click()}
        >
           <i className="pi pi-cloud-upload text-4xl text-slate-400 mb-4"></i>
           <p className="text-sm font-semibold text-slate-700">Clique para fazer upload</p>
           <p className="text-xs text-slate-500 mt-1">PNG, JPG, WebP (Max 5MB)</p>
           {isPending && <i className="pi pi-spin pi-spinner text-indigo-600 mt-4"></i>}
        </div>
      )}

      <input 
         type="file" 
         id={`uploader-${folderId}`} 
         className="hidden" 
         accept="image/png, image/jpeg, image/webp" 
         onChange={handleFileChange} 
         disabled={isPending}
      />
    </div>
  );
}
