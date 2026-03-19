"use client";

import { useState, useTransition, useRef } from "react";
import { Button } from "primereact/button";
import { Message } from "primereact/message";
import { Toast } from "primereact/toast";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { InputNumber } from "primereact/inputnumber";
import { InputSwitch } from "primereact/inputswitch";
import { saveSiteContent } from "@/actions/cms.actions";
import { ImageUploader } from "@/components/ui/image-uploader";
import { ServiceItem } from "@/types/database.types";

export function ServicesCmsForm({
  initialData,
}: {
  initialData: Record<string, any> | null;
}) {
  const toast = useRef<Toast>(null);
  const [isPending, startTransition] = useTransition();

  // Array of services
  const [services, setServices] = useState<ServiceItem[]>(
    Array.isArray(initialData?.servicesList) ? initialData.servicesList : [],
  );

  // Dialog State
  const [displayEditDialog, setDisplayEditDialog] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(
    null,
  );

  const saveToDatabase = (currentList: ServiceItem[]) => {
    startTransition(async () => {
      const res = await saveSiteContent(
        "services_page",
        { servicesList: currentList },
        "services",
      );
      if (res.success) {
        toast.current?.show({
          severity: "success",
          summary: "Sucesso",
          detail: res.message,
        });
        if (typeof window !== "undefined") {
          window.dispatchEvent(
            new CustomEvent("cms:contentSaved", {
              detail: { key: "services_page" },
            }),
          );
        }
      } else {
        toast.current?.show({
          severity: "error",
          summary: "Erro",
          detail: res.message,
        });
      }
    });
  };

  const openNew = () => {
    setEditingService({
      id: crypto.randomUUID(),
      title: "",
      description: "",
      price: null,
      duration: "",
      image: null,
      visible: true,
    });
    setDisplayEditDialog(true);
  };

  const openEdit = (service: ServiceItem) => {
    setEditingService({ ...service });
    setDisplayEditDialog(true);
  };

  const hideDialog = () => {
    setDisplayEditDialog(false);
    setEditingService(null);
  };

  const onSaveItem = () => {
    if (!editingService?.title) {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: "O título é obrigatório.",
      });
      return;
    }

    const updatedList = [...services];
    const index = updatedList.findIndex((s) => s.id === editingService.id);

    if (index >= 0) {
      updatedList[index] = editingService;
    } else {
      updatedList.push(editingService);
    }

    setServices(updatedList);
    hideDialog();
    saveToDatabase(updatedList);
  };

  const deleteItem = (id: string) => {
    const updatedList = services.filter((s) => s.id !== id);
    setServices(updatedList);
    saveToDatabase(updatedList);
  };

  const moveItem = (index: number, direction: "up" | "down") => {
    if (direction === "up" && index === 0) return;
    if (direction === "down" && index === services.length - 1) return;

    const updatedList = [...services];
    const newIndex = direction === "up" ? index - 1 : index + 1;

    const temp = updatedList[index];
    updatedList[index] = updatedList[newIndex];
    updatedList[newIndex] = temp;

    setServices(updatedList);
    saveToDatabase(updatedList);
  };

  const toggleVisibility = (id: string) => {
    const updatedList = services.map((s) =>
      s.id === id ? { ...s, visible: !s.visible } : s,
    );
    setServices(updatedList);
    saveToDatabase(updatedList);
  };

  return (
    <div className="flex flex-col gap-6 py-2">
      <Toast ref={toast} />
      <Message
        severity="info"
        text="Crie os cartões com os tipos de aulas ou pacotes que você oferece (ex: Revisão ENEM, Aulas Avulsas, Pacote Mensal)."
      />

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-slate-800">
          Serviços Oferecidos ({services.length})
        </h3>
        <Button
          label="Adicionar Novo"
          icon="pi pi-plus"
          onClick={openNew}
          className="bg-indigo-600 hover:bg-indigo-700 border-none"
        />
      </div>

      {services.length === 0 && (
        <div className="text-center p-8 bg-slate-50 rounded-xl border-dashed border-2 border-slate-200 text-slate-500">
          Nenhum serviço cadastrado ainda.
        </div>
      )}

      <div className="flex flex-col gap-2">
        {services.map((service, idx) => (
          <div
            key={service.id}
            className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 p-2 rounded-xl border ${service.visible ? "border-slate-200 bg-white" : "border-slate-200 bg-slate-50 opacity-60"}`}
          >
            <div className="flex sm:flex-col gap-2 w-full sm:w-auto justify-between sm:justify-start border-b sm:border-0 pb-2 sm:pb-0">
              <div className="flex gap-2">
                <Button
                  icon="pi pi-angle-up"
                  text
                  rounded
                  className="h-6 w-6 text-slate-500"
                  disabled={idx === 0}
                  onClick={() => moveItem(idx, "up")}
                />
                <Button
                  icon="pi pi-angle-down"
                  text
                  rounded
                  className="h-6 w-6 text-slate-500"
                  disabled={idx === services.length - 1}
                  onClick={() => moveItem(idx, "down")}
                />
              </div>
              <div className="sm:hidden flex items-center gap-2">
                <InputSwitch
                  checked={service.visible}
                  onChange={() => toggleVisibility(service.id)}
                />
                <Button
                  icon="pi pi-trash"
                  rounded
                  text
                  severity="danger"
                  onClick={() => deleteItem(service.id)}
                />
              </div>
            </div>

            <div className="flex items-center gap-4 w-full">
              {service.image ? (
                <div className="w-16 h-16 rounded overflow-hidden shrink-0 bg-slate-100">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded shrink-0 bg-slate-100 flex items-center justify-center text-slate-400">
                  <i className="pi pi-image text-xl"></i>
                </div>
              )}

              <div className="flex-1 flex flex-col gap-1 min-w-0">
                <div className="font-bold text-slate-800 truncate">
                  {service.title}
                </div>
                <div className="text-sm text-slate-500 line-clamp-2 sm:truncate">
                  {service.description}
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-2">
                <InputSwitch
                  checked={service.visible}
                  onChange={() => toggleVisibility(service.id)}
                  tooltip="Mostrar/Esconder no Site"
                />
                <Button
                  icon="pi pi-pencil"
                  rounded
                  text
                  severity="info"
                  onClick={() => openEdit(service)}
                  tooltip="Editar"
                />
                <Button
                  icon="pi pi-trash"
                  rounded
                  text
                  severity="danger"
                  onClick={() => deleteItem(service.id)}
                  tooltip="Excluir"
                />
              </div>

              <div className="sm:hidden">
                <Button
                  icon="pi pi-pencil"
                  rounded
                  text
                  severity="info"
                  onClick={() => openEdit(service)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog
        header={editingService?.title ? "Editar Serviço" : "Novo Serviço"}
        visible={displayEditDialog}
        style={{ width: "95vw", maxWidth: "600px" }}
        modal
        onHide={hideDialog}
        footer={
          <div>
            <Button
              label="Cancelar"
              icon="pi pi-times"
              onClick={hideDialog}
              className="p-button-text"
            />
            <Button
              label="Salvar"
              icon="pi pi-check"
              onClick={onSaveItem}
              autoFocus
              className="bg-indigo-600 hover:bg-indigo-700 border-none"
              loading={isPending}
            />
          </div>
        }
      >
        {editingService && (
          <div className="flex flex-col gap-6 py-4">
            <div className="flex flex-col gap-2">
              <label className="font-semibold text-slate-700 text-sm">
                Imagem/Ícone (Opcional)
              </label>
              <div className="w-40">
                <ImageUploader
                  currentImageUrl={editingService.image ?? undefined}
                  folderId="services"
                  onUploadSuccess={(url) =>
                    setEditingService({ ...editingService, image: url })
                  }
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-semibold text-slate-700 text-sm">
                Título *
              </label>
              <InputText
                value={editingService.title}
                onChange={(e) =>
                  setEditingService({
                    ...editingService,
                    title: e.target.value,
                  })
                }
                placeholder="Ex: Reforço Enem Completo"
                autoFocus
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-semibold text-slate-700 text-sm">
                Resumo
              </label>
              <InputTextarea
                rows={3}
                value={editingService.description}
                onChange={(e) =>
                  setEditingService({
                    ...editingService,
                    description: e.target.value,
                  })
                }
                className="resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-slate-700 text-sm">
                  Preço (Opcional)
                </label>
                <InputNumber
                  value={editingService.price}
                  onValueChange={(e) =>
                    setEditingService({
                      ...editingService,
                      price: e.value || null,
                    })
                  }
                  mode="currency"
                  currency="BRL"
                  locale="pt-BR"
                  placeholder="Deixe vazio se for sob consulta"
                  className="w-full"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-semibold text-slate-700 text-sm">
                  Duração/Frequência
                </label>
                <InputText
                  value={editingService.duration}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      duration: e.target.value,
                    })
                  }
                  placeholder="Ex: 50 min/aula ou Mensal"
                />
              </div>
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
}
