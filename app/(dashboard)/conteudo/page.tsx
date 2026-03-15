"use client";
import { useState, useTransition } from "react";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { updateSiteContent } from "@/actions/cms.actions";
import { Message } from "primereact/message";

export default function ConteudoPage() {
  const [isPending, startTransition] = useTransition();
  const [heroTitle, setHeroTitle] = useState("");
  const [heroDesc, setHeroDesc] = useState("");
  const [response, setResponse] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const handleSave = () => {
    setResponse(null);
    startTransition(async () => {
       const res = await updateSiteContent('home_hero', { title: heroTitle, description: heroDesc }, 'json');
       setResponse({ type: res.success ? 'success' : 'error', text: res.message });
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Gerenciar Conteúdo</h1>
        <p className="text-slate-500 mt-1">Altere os textos principais do site público.</p>
      </div>
      
      {response && <Message severity={response.type} text={response.text} className="w-full" />}

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col gap-6">
        <h2 className="text-xl font-semibold text-slate-800 border-b pb-4">Página Inicial (Hero Section)</h2>
        
        <div className="flex flex-col gap-2">
           <label className="font-semibold text-slate-700 text-sm">Título Principal</label>
           <InputText 
               value={heroTitle} 
               onChange={(e) => setHeroTitle(e.target.value)} 
               placeholder="Ex: Domine Química e Física..." 
               className="p-3 border border-slate-300 rounded-lg w-full" 
           />
        </div>

        <div className="flex flex-col gap-2">
           <label className="font-semibold text-slate-700 text-sm">Parágrafo de Descrição</label>
           <InputTextarea 
               rows={4} 
               value={heroDesc} 
               onChange={(e) => setHeroDesc(e.target.value)} 
               placeholder="Aulas particulares para Ensino Médio..." 
               className="p-3 border border-slate-300 rounded-lg w-full resize-none" 
           />
        </div>
        
        <div className="pt-4 border-t border-slate-100 flex justify-end">
            <Button 
                label={isPending ? "Salvando..." : "Salvar Alterações"} 
                onClick={handleSave} 
                disabled={isPending} 
                className="bg-indigo-600 hover:bg-indigo-700 outline-none text-white font-bold px-6 py-3 rounded-lg border-none" 
            />
        </div>
      </div>
    </div>
  );
}
