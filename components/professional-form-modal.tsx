"use client";

import type React from "react";
import { useState, useEffect, useRef } from "react";
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
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Mail, Phone, MapPin, Briefcase, Star, Calendar, Hash, Building2, Instagram, Linkedin, MessageCircle } from "lucide-react";
import { RecommendedProfessional, CreateRecommendedProfessionalDto, UpdateRecommendedProfessionalDto, WeekDay } from "@/lib/services/recommended-professional";

interface ProfessionalFormModalProps {
  professional: RecommendedProfessional | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CreateRecommendedProfessionalDto | UpdateRecommendedProfessionalDto) => Promise<void>;
  mode: "create" | "edit";
}

const weekDays = [
  { value: WeekDay.SUNDAY, label: "Domingo" },
  { value: WeekDay.MONDAY, label: "Segunda-feira" },
  { value: WeekDay.TUESDAY, label: "Terça-feira" },
  { value: WeekDay.WEDNESDAY, label: "Quarta-feira" },
  { value: WeekDay.THURSDAY, label: "Quinta-feira" },
  { value: WeekDay.FRIDAY, label: "Sexta-feira" },
  { value: WeekDay.SATURDAY, label: "Sábado" },
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
    profession: "",
    phone: "",
    email: "",
    description: "",
    profileImage: "",
    isActive: true,
    address: {
      state: "",
      city: "",
      district: "",
      street: "",
      complement: "",
      number: "",
      zipCode: "",
    },
    socialMedia: {
      instagram: "",
      linkedin: "",
      whatsapp: "",
    },
    availableDays: [] as WeekDay[],
  });
  const [isLoading, setIsLoading] = useState(false);
  const submitLockRef = useRef(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (professional && mode === "edit") {
      setFormData({
        name: professional.name,
        profession: professional.profession,
        phone: professional.phone,
        email: professional.email || "",
        description: professional.description || "",
        profileImage: professional.profileImage || "",
        isActive: professional.isActive,
        address: {
          state: professional.address?.state || "",
          city: professional.address?.city || "",
          district: professional.address?.district || "",
          street: professional.address?.street || "",
          complement: professional.address?.complement || "",
          number: professional.address?.number || "",
          zipCode: professional.address?.zipCode || "",
        },
        socialMedia: {
          instagram: professional.socialMedia?.instagram || "",
          linkedin: professional.socialMedia?.linkedin || "",
          whatsapp: professional.socialMedia?.whatsapp || "",
        },
        availableDays: professional.availableDays?.map(d => d.dayOfWeek) || [],
      });
    } else {
      setFormData({
        name: "",
        profession: "",
        phone: "",
        email: "",
        description: "",
        profileImage: "",
        isActive: true,
        address: {
          state: "",
          city: "",
          district: "",
          street: "",
          complement: "",
          number: "",
          zipCode: "",
        },
        socialMedia: {
          instagram: "",
          linkedin: "",
          whatsapp: "",
        },
        availableDays: [],
      });
    }
    setErrors({});
  }, [professional, mode, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Nome é obrigatório";
    if (!formData.profession.trim()) newErrors.profession = "Profissão é obrigatória";
    if (!formData.phone.trim()) newErrors.phone = "Telefone é obrigatório";
    if (!formData.address.state.trim()) newErrors.state = "Estado é obrigatório";
    if (!formData.address.city.trim()) newErrors.city = "Cidade é obrigatória";
    if (!formData.address.district.trim()) newErrors.district = "Bairro é obrigatório";

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (formData.email.trim() && !emailRegex.test(formData.email)) {
      newErrors.email = "E-mail inválido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitLockRef.current) return;

    if (!validateForm()) return;

    submitLockRef.current = true;
    setIsLoading(true);
    try {
      const payload: any = {
        name: formData.name,
        profession: formData.profession,
        phone: formData.phone,
        email: formData.email || undefined,
        description: formData.description || undefined,
        profileImage: formData.profileImage || undefined,
        isActive: formData.isActive,
        address: {
          state: formData.address.state,
          city: formData.address.city,
          district: formData.address.district,
          street: formData.address.street || undefined,
          complement: formData.address.complement || undefined,
          number: formData.address.number || undefined,
          zipCode: formData.address.zipCode || undefined,
        },
        availableDays: formData.availableDays.length > 0 ? formData.availableDays : undefined,
      };

      const hasSocialMedia = formData.socialMedia.instagram || formData.socialMedia.linkedin || formData.socialMedia.whatsapp;
      if (hasSocialMedia) {
        payload.socialMedia = {
          instagram: formData.socialMedia.instagram || undefined,
          linkedin: formData.socialMedia.linkedin || undefined,
          whatsapp: formData.socialMedia.whatsapp || undefined,
        };
      }

      await onSave(payload);
      onClose();
    } catch (error) {
      console.error("Erro ao salvar profissional:", error);
    } finally {
      setIsLoading(false);
      submitLockRef.current = false;
    }
  };

  const toggleDay = (day: WeekDay) => {
    setFormData(prev => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter(d => d !== day)
        : [...prev.availableDays, day]
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[95vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <User className="h-5 w-5" />
            {mode === "create" ? "Adicionar Profissional" : "Editar Profissional"}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[75vh]">
          <form onSubmit={handleSubmit} className="space-y-6 pr-4">
            {/* Informações Básicas */}
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
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={errors.name ? "border-red-500" : ""}
                    disabled={isLoading}
                  />
                  {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="profession">Profissão *</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="profession"
                      value={formData.profession}
                      onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                      className={`pl-10 ${errors.profession ? "border-red-500" : ""}`}
                      disabled={isLoading}
                      placeholder="Ex: Arquiteto, Designer de Interiores"
                    />
                  </div>
                  {errors.profession && <p className="text-sm text-red-500">{errors.profession}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone *</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="(11) 99999-9999"
                      className={`pl-10 ${errors.phone ? "border-red-500" : ""}`}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`pl-10 ${errors.email ? "border-red-500" : ""}`}
                      disabled={isLoading}
                    />
                  </div>
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Descreva a experiência e especialidades do profissional..."
                    rows={3}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <div className="flex items-center space-x-2 p-3 bg-background rounded border">
                    <Switch
                      id="status"
                      checked={formData.isActive}
                      onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                      disabled={isLoading}
                    />
                    <Label htmlFor="status" className="flex items-center gap-2 cursor-pointer">
                      <Badge variant={formData.isActive ? "default" : "secondary"}>
                        {formData.isActive ? "Ativo" : "Inativo"}
                      </Badge>
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Endereço */}
            <div className="bg-muted/30 p-4 rounded-lg space-y-4">
              <h3 className="font-semibold text-card-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Endereço
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="state">Estado *</Label>
                  <Input
                    id="state"
                    value={formData.address.state}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      address: { ...formData.address, state: e.target.value } 
                    })}
                    className={errors.state ? "border-red-500" : ""}
                    disabled={isLoading}
                    placeholder="Ex: SP"
                  />
                  {errors.state && <p className="text-sm text-red-500">{errors.state}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">Cidade *</Label>
                  <Input
                    id="city"
                    value={formData.address.city}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      address: { ...formData.address, city: e.target.value } 
                    })}
                    className={errors.city ? "border-red-500" : ""}
                    disabled={isLoading}
                    placeholder="Ex: São Paulo"
                  />
                  {errors.city && <p className="text-sm text-red-500">{errors.city}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="district">Bairro *</Label>
                  <Input
                    id="district"
                    value={formData.address.district}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      address: { ...formData.address, district: e.target.value } 
                    })}
                    className={errors.district ? "border-red-500" : ""}
                    disabled={isLoading}
                    placeholder="Ex: Jardins"
                  />
                  {errors.district && <p className="text-sm text-red-500">{errors.district}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="street">Rua</Label>
                  <Input
                    id="street"
                    value={formData.address.street}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      address: { ...formData.address, street: e.target.value } 
                    })}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="number">Número</Label>
                  <Input
                    id="number"
                    value={formData.address.number}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      address: { ...formData.address, number: e.target.value } 
                    })}
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="zipCode">CEP</Label>
                  <div className="relative">
                    <Hash className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="zipCode"
                      value={formData.address.zipCode}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        address: { ...formData.address, zipCode: e.target.value } 
                      })}
                      className="pl-10"
                      disabled={isLoading}
                      placeholder="00000-000"
                    />
                  </div>
                </div>

                <div className="space-y-2 md:col-span-2 lg:col-span-3">
                  <Label htmlFor="complement">Complemento</Label>
                  <Input
                    id="complement"
                    value={formData.address.complement}
                    onChange={(e) => setFormData({ 
                      ...formData, 
                      address: { ...formData.address, complement: e.target.value } 
                    })}
                    disabled={isLoading}
                    placeholder="Apartamento, sala, etc."
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Redes Sociais */}
            <div className="bg-muted/30 p-4 rounded-lg space-y-4">
              <h3 className="font-semibold text-card-foreground flex items-center gap-2">
                <Star className="h-4 w-4" />
                Redes Sociais
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="instagram">Instagram</Label>
                  <div className="relative">
                    <Instagram className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="instagram"
                      value={formData.socialMedia.instagram}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        socialMedia: { ...formData.socialMedia, instagram: e.target.value } 
                      })}
                      disabled={isLoading}
                      placeholder="@usuario"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="linkedin"
                      value={formData.socialMedia.linkedin}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        socialMedia: { ...formData.socialMedia, linkedin: e.target.value } 
                      })}
                      disabled={isLoading}
                      placeholder="linkedin.com/in/usuario"
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <div className="relative">
                    <MessageCircle className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="whatsapp"
                      value={formData.socialMedia.whatsapp}
                      onChange={(e) => setFormData({ 
                        ...formData, 
                        socialMedia: { ...formData.socialMedia, whatsapp: e.target.value } 
                      })}
                      disabled={isLoading}
                      placeholder="5511999999999"
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </div>

            <Separator />

           {/* Dias Disponíveis */}
           <div className="bg-muted/30 p-4 rounded-lg space-y-4">
              <h3 className="font-semibold text-card-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Dias Disponíveis
              </h3>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {weekDays.map((day) => (
                  <div key={day.value} className="flex items-center space-x-2">
                    <Checkbox
                      id={day.value}
                      checked={formData.availableDays.includes(day.value)}
                      onCheckedChange={() => toggleDay(day.value)}
                      disabled={isLoading}
                    />
                    <Label
                      htmlFor={day.value}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {day.label}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={isLoading} loading={isLoading} loadingText="Salvando...">
                {mode === "create" ? "Adicionar" : "Salvar Alterações"}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}