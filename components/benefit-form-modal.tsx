"use client";

import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarIcon, AlertCircle } from "lucide-react";
import type {
  Benefit,
  CreateBenefitData,
  UpdateBenefitData,
} from "@/lib/services/benefits";

interface BenefitFormModalProps {
  benefit: Benefit | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateBenefitData | UpdateBenefitData) => Promise<void>;
  mode: "create" | "edit";
}

interface FormData {
  name: string;
  description: string;
  pointsCost: number | string;
  quantity: number | string | undefined;
  imageUrl: string;
  isActive: boolean;
}

export function BenefitFormModal({
  benefit,
  isOpen,
  onClose,
  onSave,
  mode,
}: BenefitFormModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    description: "",
    pointsCost: "",
    quantity: "",
    imageUrl: "",
    isActive: true,
  });
  const [expiresAtDate, setExpiresAtDate] = useState<Date | undefined>(
    undefined
  );
  const [loading, setLoading] = useState(false);
  const submitLockRef = useRef(false);
  const [error, setError] = useState<string | null>(null);

  // Reset form when modal opens/closes or benefit changes
  useEffect(() => {
    if (mode === "edit" && benefit) {
      setFormData({
        name: benefit.name,
        description: benefit.description || "",
        pointsCost: benefit.pointsCost,
        quantity: benefit.quantity ?? "",
        imageUrl: benefit.imageUrl || "",
        isActive: benefit.isActive,
      });
      setExpiresAtDate(
        benefit.expiresAt ? new Date(benefit.expiresAt) : undefined
      );
    } else if (mode === "create") {
      setFormData({
        name: "",
        description: "",
        pointsCost: "",
        quantity: "",
        imageUrl: "",
        isActive: true,
      });
      setExpiresAtDate(undefined);
    }
    setError(null);
  }, [benefit, mode, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitLockRef.current) return;

    setError(null);

    // Validations
    if (!formData.name.trim()) {
      setError("O nome do benefício é obrigatório");
      return;
    }

    const pointsCost =
      typeof formData.pointsCost === "string"
        ? parseInt(formData.pointsCost)
        : formData.pointsCost;

    if (!pointsCost || pointsCost <= 0) {
      setError("O custo em pontos deve ser maior que zero");
      return;
    }

    const quantity = formData.quantity
      ? typeof formData.quantity === "string"
        ? parseInt(formData.quantity)
        : formData.quantity
      : undefined;

    if (quantity !== undefined && quantity <= 0) {
      setError(
        "A quantidade deve ser maior que zero ou deixada vazia para ilimitado"
      );
      return;
    }

    if (expiresAtDate) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (expiresAtDate < today) {
        setError("A data de expiração não pode ser no passado");
        return;
      }
    }

    try {
      submitLockRef.current = true;
      setLoading(true);

      const dataToSave: CreateBenefitData | UpdateBenefitData = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        pointsCost,
        quantity,
        imageUrl: formData.imageUrl.trim() || undefined,
        isActive: formData.isActive,
        expiresAt: expiresAtDate ? expiresAtDate.toISOString() : undefined,
      };

      await onSave(dataToSave);
      onClose();
    } catch (err: any) {
      setError(err.message || "Erro ao salvar benefício");
    } finally {
      setLoading(false);
      submitLockRef.current = false;
    }
  };

  const handleChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Criar Novo Benefício" : "Editar Benefício"}
          </DialogTitle>
          <DialogDescription>
            {mode === "create"
              ? "Preencha os dados do novo benefício que será disponibilizado aos profissionais."
              : "Atualize as informações do benefício."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="name">
              Nome do Benefício <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="Ex: Vale Combustível R$ 100"
              required
              disabled={loading}
            />
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Descreva os detalhes do benefício..."
              rows={3}
              disabled={loading}
            />
          </div>

          {/* Custo em Pontos */}
          <div className="space-y-2">
            <Label htmlFor="pointsCost">
              Custo em Pontos <span className="text-destructive">*</span>
            </Label>
            <Input
              id="pointsCost"
              type="number"
              min="1"
              value={formData.pointsCost}
              onChange={(e) => handleChange("pointsCost", e.target.value)}
              placeholder="Ex: 500"
              required
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              Quantidade de pontos necessários para resgatar este benefício
            </p>
          </div>

          {/* Quantidade Disponível */}
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantidade Disponível (Opcional)</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => handleChange("quantity", e.target.value)}
              placeholder="Ex: 50"
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              Deixe vazio para quantidade ilimitada
            </p>
          </div>

          {/* URL da Imagem */}
          <div className="space-y-2">
            <Label htmlFor="imageUrl">URL da Imagem (Opcional)</Label>
            <Input
              id="imageUrl"
              type="url"
              value={formData.imageUrl}
              onChange={(e) => handleChange("imageUrl", e.target.value)}
              placeholder="https://exemplo.com/imagem.jpg"
              disabled={loading}
            />
            {formData.imageUrl && (
              <div className="mt-2 border rounded-lg p-2">
                <img
                  src={formData.imageUrl}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded"
                  onError={(e) => {
                    e.currentTarget.src =
                      "https://via.placeholder.com/300x200?text=Imagem+Invalida";
                  }}
                />
              </div>
            )}
          </div>

          {/* Data de Expiração */}
          <div className="space-y-2">
            <Label htmlFor="expiresAt">Data de Expiração (Opcional)</Label>
            <Input
              id="expiresAt"
              type="date"
              value={expiresAtDate ? format(expiresAtDate, "yyyy-MM-dd") : ""}
              onChange={(e) => {
                if (e.target.value) {
                  setExpiresAtDate(new Date(e.target.value + "T00:00:00"));
                } else {
                  setExpiresAtDate(undefined);
                }
              }}
              min={format(new Date(), "yyyy-MM-dd")}
              disabled={loading}
            />
            <p className="text-xs text-muted-foreground">
              Data limite para resgatar este benefício
            </p>
          </div>

          {/* Status Ativo */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="isActive" className="text-base">
                Benefício Ativo
              </Label>
              <p className="text-xs text-muted-foreground">
                Quando ativo, o benefício fica disponível para resgate
              </p>
            </div>
            <Switch
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => handleChange("isActive", checked)}
              disabled={loading}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={loading}
              loading={loading}
              loadingText={mode === "create" ? "Criando..." : "Salvando..."}
            >
              {mode === "create" ? "Criar Benefício" : "Salvar Alterações"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
