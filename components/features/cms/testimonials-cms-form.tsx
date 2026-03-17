"use client";

import { useState, useTransition, useRef } from 'react';
import { Button } from 'primereact/button';
import { Message } from 'primereact/message';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputSwitch } from 'primereact/inputswitch';
import { Rating } from 'primereact/rating';
import { saveSiteContent } from '@/actions/cms.actions';
import { ImageUploader } from '@/components/ui/image-uploader';
import { TestimonialItem } from '@/types/database.types';

export function TestimonialsCmsForm({ initialData }: { initialData: Record<string, any> | null }) {
  const toast = useRef<Toast>(null);
  const [isPending, startTransition] = useTransition();

  const [testimonials, setTestimonials] = useState<TestimonialItem[]>(
     Array.isArray(initialData?.testimonialsList) ? initialData.testimonialsList : []
  );

  const [displayEditDialog, setDisplayEditDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<TestimonialItem | null>(null);

  const saveToDatabase = (currentList: TestimonialItem[]) => {
      startTransition(async () => {
         const res = await saveSiteContent('testimonials_page', { testimonialsList: currentList }, 'json');
         if (res.success) {
            toast.current?.show({ severity: 'success', summary: 'Sucesso', detail: res.message });
         } else {
            toast.current?.show({ severity: 'error', summary: 'Erro', detail: res.message });
         }
      });
  };

  const openNew = () => {
      setEditingItem({
          id: crypto.randomUUID(),
          name: '',
          avatar: null,
          text: '',
          rating: 5,
          visible: true
      });
      setDisplayEditDialog(true);
  };

  const openEdit = (item: TestimonialItem) => {
      setEditingItem({ ...item });
      setDisplayEditDialog(true);
  };

  const hideDialog = () => {
      setDisplayEditDialog(false);
      setEditingItem(null);
  };

  const onSaveItem = () => {
      if (!editingItem?.name || !editingItem?.text) {
          toast.current?.show({ severity: 'error', summary: 'Erro', detail: 'Nome e Texto são obrigatórios.' });
          return;
      }

      const updatedList = [...testimonials];
      const index = updatedList.findIndex(t => t.id === editingItem.id);
      
      if (index >= 0) {
          updatedList[index] = editingItem;
      } else {
          updatedList.push(editingItem);
      }

      setTestimonials(updatedList);
      hideDialog();
      saveToDatabase(updatedList);
  };

  const deleteItem = (id: string) => {
      const updatedList = testimonials.filter(t => t.id !== id);
      setTestimonials(updatedList);
      saveToDatabase(updatedList);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
      if (direction === 'up' && index === 0) return;
      if (direction === 'down' && index === testimonials.length - 1) return;

      const updatedList = [...testimonials];
      const newIndex = direction === 'up' ? index - 1 : index + 1;
      
      const temp = updatedList[index];
      updatedList[index] = updatedList[newIndex];
      updatedList[newIndex] = temp;

      setTestimonials(updatedList);
      saveToDatabase(updatedList);
  };

  const toggleVisibility = (id: string) => {
      const updatedList = testimonials.map(t => t.id === id ? { ...t, visible: !t.visible } : t);
      setTestimonials(updatedList);
      saveToDatabase(updatedList);
  };

  return (
      <div className="flex flex-col gap-6 py-2">
          <Toast ref={toast} />
          <Message severity="info" text="Adicione e gerencie os depoimentos dos seus alunos que aparecerão na página inicial." />

          <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-slate-800">Meus Depoimentos ({testimonials.length})</h3>
              <Button label="Adicionar Novo" icon="pi pi-plus" onClick={openNew} className="bg-indigo-600 hover:bg-indigo-700 border-none" />
          </div>

          {testimonials.length === 0 && (
              <div className="text-center p-8 bg-slate-50 rounded-xl border-dashed border-2 border-slate-200 text-slate-500">
                  Nenhum depoimento cadastrado.
              </div>
          )}

          <div className="flex flex-col gap-4">
              {testimonials.map((item, idx) => (
                  <div key={item.id} className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl border ${item.visible ? 'border-slate-200 bg-white' : 'border-slate-200 bg-slate-50 opacity-60'}`}>
                      <div className="flex sm:flex-col gap-2 w-full sm:w-auto justify-between sm:justify-start border-b sm:border-0 pb-2 sm:pb-0">
                          <div className="flex gap-2">
                            <Button icon="pi pi-angle-up" text rounded className="h-8 w-8 text-slate-500" disabled={idx === 0} onClick={() => moveItem(idx, 'up')} />
                            <Button icon="pi pi-angle-down" text rounded className="h-8 w-8 text-slate-500" disabled={idx === testimonials.length - 1} onClick={() => moveItem(idx, 'down')} />
                          </div>
                          <div className="sm:hidden flex items-center gap-2">
                             <InputSwitch checked={item.visible} onChange={() => toggleVisibility(item.id)} />
                             <Button icon="pi pi-trash" rounded text severity="danger" onClick={() => deleteItem(item.id)} />
                          </div>
                      </div>
                      
                      <div className="flex items-center gap-4 w-full">
                        {item.avatar ? (
                            <div className="w-14 h-14 rounded-full overflow-hidden shrink-0 bg-slate-100">
                                <img src={item.avatar} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                        ) : (
                            <div className="w-14 h-14 rounded-full shrink-0 bg-indigo-100 flex items-center justify-center text-indigo-500 font-bold text-xl text-center">
                                {item.name.charAt(0)}
                            </div>
                        )}

                        <div className="flex-1 flex flex-col gap-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                                <span className="font-bold text-slate-800">{item.name}</span>
                                <Rating value={item.rating} readOnly cancel={false} className="gap-1 text-xs text-yellow-500" />
                            </div>
                            <div className="text-sm text-slate-500 italic line-clamp-2 sm:truncate">&quot;{item.text}&quot;</div>
                        </div>

                        <div className="hidden sm:flex items-center gap-2">
                            <InputSwitch checked={item.visible} onChange={() => toggleVisibility(item.id)} tooltip="Mostrar/Esconder no Site" />
                            <Button icon="pi pi-pencil" rounded text severity="info" onClick={() => openEdit(item)} tooltip="Editar" />
                            <Button icon="pi pi-trash" rounded text severity="danger" onClick={() => deleteItem(item.id)} tooltip="Excluir" />
                        </div>

                        <div className="sm:hidden">
                           <Button icon="pi pi-pencil" rounded text severity="info" onClick={() => openEdit(item)} />
                        </div>
                      </div>
                  </div>
              ))}
          </div>

          <Dialog header={editingItem?.id ? "Editar Depoimento" : "Novo Depoimento"} visible={displayEditDialog} style={{ width: '95vw', maxWidth: '500px' }} modal onHide={hideDialog} footer={(
              <div>
                  <Button label="Cancelar" icon="pi pi-times" onClick={hideDialog} className="p-button-text" />
                  <Button label="Salvar" icon="pi pi-check" onClick={onSaveItem} autoFocus className="bg-indigo-600 hover:bg-indigo-700 border-none" loading={isPending} />
              </div>
          )}>
              {editingItem && (
                  <div className="flex flex-col gap-6 py-4">
                      <div className="flex items-center gap-6">
                          <div className="w-24">
                              <ImageUploader 
                                 currentImageUrl={editingItem.avatar ?? undefined} 
                                 folderId="testimonials" 
                                 onUploadSuccess={(url) => setEditingItem({...editingItem, avatar: url})} 
                              />
                          </div>
                          <div className="flex-1 flex flex-col gap-2">
                             <label className="font-semibold text-slate-700 text-sm">Nome do Aluno *</label>
                             <InputText 
                                 value={editingItem.name} 
                                 onChange={(e) => setEditingItem({...editingItem, name: e.target.value})} 
                                 placeholder="Ex: Maria S." 
                                 autoFocus
                             />
                          </div>
                      </div>

                      <div className="flex flex-col gap-2">
                         <label className="font-semibold text-slate-700 text-sm">Avaliação (Estrelas)</label>
                         <Rating 
                             value={editingItem.rating} 
                             onChange={(e) => setEditingItem({...editingItem, rating: e.value || 5})} 
                             cancel={false} 
                         />
                      </div>

                      <div className="flex flex-col gap-2">
                         <label className="font-semibold text-slate-700 text-sm">Depoimento *</label>
                         <InputTextarea 
                             rows={4} 
                             value={editingItem.text} 
                             onChange={(e) => setEditingItem({...editingItem, text: e.target.value})} 
                             placeholder="Ex: A didática da professora é incrível..."
                             className="resize-none"
                         />
                      </div>
                  </div>
              )}
          </Dialog>
      </div>
  );
}
