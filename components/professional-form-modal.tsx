"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, MapPin, Briefcase, Star } from "lucide-react";

interface Professional {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialty: string;
  location: string;
  rating: number;
  status: "active" | "inactive";
  bio: string;
  avatar: string;
  createdAt: string;
}

interface ProfessionalFormModalProps {
  professional: Professional | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    professional: Omit<Professional, "id" | "rating" | "createdAt" | "avatar">
  ) => Promise<void>;
  mode: "create" | "edit";
}

const specialties = [
  "Arquitetura",
  "Decoração de Interiores",
  "Paisagismo",
  "Iluminação",
  "Marcenaria",
  "Design de Móveis",
  "Consultoria em Decoração",
  "Feng Shui",
  "Home Staging",
  "Design Sustentável",
];

const locations = [
  "São Paulo, SP",
  "Rio de Janeiro, RJ",
  "Belo Horizonte, MG",
  "Brasília, DF",
  "Salvador, BA",
  "Fortaleza, CE",
  "Recife, PE",
  "Porto Alegre, RS",
  "Curitiba, PR",
  "Goiânia, GO",
];

export function ProfessionalFormModal({
  professional,
  isOpen,
  onClose,
  onSave,
  mode,
}: ProfessionalFormModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    specialty: "",
    location: "",
    bio: "",
    status: "active" as const,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (professional && mode === "edit") {
      setFormData({
        name: professional.name,
        email: professional.email,
        phone: professional.phone,
        specialty: professional.specialty,
        location: professional.location,
        bio: professional.bio,
        status: professional.status,
      });
    } else {
      setFormData({
        name: "",
        email: "",
        phone: "",
        specialty: "",
        location: "",
        bio: "",
        status: "active",
      });
    }
    setErrors({});
  }, [professional, mode, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Nome é obrigatório";
    if (!formData.email.trim()) newErrors.email = "E-mail é obrigatório";
    if (!formData.phone.trim()) newErrors.phone = "Telefone é obrigatório";
    if (!formData.specialty)
      newErrors.specialty = "Especialidade é obrigatória";
    if (!formData.location) newErrors.location = "Localização é obrigatória";
    if (!formData.bio.trim()) newErrors.bio = "Biografia é obrigatória";

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = "E-mail inválido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Erro ao salvar profissional:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[95vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <User className="h-5 w-5" />
            {mode === "create"
              ? "Adicionar Profissional"
              : "Editar Profissional"}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[75vh]">
          <form onSubmit={handleSubmit} className="space-y-6 pr-4">
            {/* Basic Information */}
            <div className="bg-muted/30 p-4 rounded-lg space-y-4">
              <h3 className="font-semibold text-card-foreground flex items-center gap-2">
                <User className="h-4 w-4" />
                Informações Básicas
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className={errors.name ? "border-red-500" : ""}
                    disabled={isLoading}
                  />
                  {errors.name && (
                    <p className="text-sm text-red-500">{errors.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mail *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className={`pl-10 ${
                        errors.email ? "border-red-500" : ""
                      }`}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="(11) 99999-9999"
                      className={`pl-10 ${
                        errors.phone ? "border-red-500" : ""
                      }`}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-sm text-red-500">{errors.phone}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Localização *</Label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      id="location"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      disabled={isLoading}
                      placeholder="Digite a localização"
                      className={`pl-10 w-full rounded-md border p-2 ${
                        errors.location ? "border-red-500" : "border-input"
                      }`}
                    />
                  </div>
                  {errors.location && (
                    <p className="text-sm text-red-500">{errors.location}</p>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Professional Information */}
            <div className="bg-muted/30 p-4 rounded-lg space-y-4">
              <h3 className="font-semibold text-card-foreground flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Informações Profissionais
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="specialty">Especialidade *</Label>
                  <div className="relative">
                    <Star className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      id="specialty"
                      value={formData.specialty}
                      onChange={(e) =>
                        setFormData({ ...formData, specialty: e.target.value })
                      }
                      disabled={isLoading}
                      placeholder="Digite a especialidade"
                      className={`pl-10 w-full rounded-md border p-2 ${
                        errors.specialty ? "border-red-500" : "border-input"
                      }`}
                    />
                  </div>
                  {errors.specialty && (
                    <p className="text-sm text-red-500">{errors.specialty}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <div className="flex items-center space-x-2 p-3 bg-background rounded border">
                    <Switch
                      id="status"
                      checked={formData.status === "active"}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          status: checked ? "active" : "inactive",
                        })
                      }
                      disabled={isLoading}
                    />
                    <Label htmlFor="status" className="flex items-center gap-2">
                      <Badge
                        variant={
                          formData.status === "active" ? "default" : "secondary"
                        }
                      >
                        {formData.status === "active" ? "Ativo" : "Inativo"}
                      </Badge>
                    </Label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Biografia Profissional *</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) =>
                    setFormData({ ...formData, bio: e.target.value })
                  }
                  placeholder="Descreva a experiência, especialidades e diferenciais do profissional..."
                  rows={4}
                  className={errors.bio ? "border-red-500" : ""}
                  disabled={isLoading}
                />
                {errors.bio && (
                  <p className="text-sm text-red-500">{errors.bio}</p>
                )}
              </div>
            </div>
          </form>
        </ScrollArea>

        <div className="flex gap-3 pt-4 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            className="flex-1 bg-transparent"
            disabled={isLoading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1"
            disabled={isLoading}
          >
            {isLoading
              ? "Salvando..."
              : mode === "create"
              ? "Adicionar Profissional"
              : "Salvar Alterações"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
