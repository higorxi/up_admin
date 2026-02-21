"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Sparkles } from "lucide-react"
import type { GrantTrialPayload, PlanType, TrialDurationUnit } from "@/lib/services/suppliers"

interface GrantTrialDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (payload: GrantTrialPayload) => Promise<void>
  supplierName: string
}

const UNIT_OPTIONS: Array<{ value: TrialDurationUnit; label: string }> = [
  { value: "days", label: "Dias" },
  { value: "weeks", label: "Semanas" },
  { value: "months", label: "Meses" },
]

const PLAN_OPTIONS: Array<{ value: PlanType; label: string }> = [
  { value: "SILVER", label: "Silver" },
  { value: "GOLD", label: "Gold" },
  { value: "PREMIUM", label: "Premium" },
]

export function GrantTrialDialog({ isOpen, onClose, onConfirm, supplierName }: GrantTrialDialogProps) {
  const [duration, setDuration] = useState("7")
  const [unit, setUnit] = useState<TrialDurationUnit>("days")
  const [planType, setPlanType] = useState<PlanType>("SILVER")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const resetFields = () => {
    setDuration("7")
    setUnit("days")
    setPlanType("SILVER")
    setError("")
  }

  const handleClose = () => {
    if (isLoading) return
    resetFields()
    onClose()
  }

  const handleSubmit = async () => {
    const parsedDuration = Number.parseInt(duration, 10)

    if (!Number.isFinite(parsedDuration) || parsedDuration <= 0) {
      setError("Informe uma duração válida maior que zero.")
      return
    }

    setError("")
    setIsLoading(true)

    try {
      await onConfirm({
        duration: parsedDuration,
        unit,
        planType,
      })
      resetFields()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao conceder período de trial.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose()
      }}
    >
      <DialogContent className="sm:max-w-[520px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-primary" />
            </div>
            <span>Conceder Trial Manual</span>
          </DialogTitle>
          <DialogDescription className="pt-2 leading-relaxed">
            Defina período e plano para liberar acesso temporário a{" "}
            <strong className="text-foreground">{supplierName}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {error && (
            <Alert variant="destructive" className="border-destructive/50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2.5">
            <Label htmlFor="trial-duration" className="text-sm font-medium">
              Duração *
            </Label>
            <Input
              id="trial-duration"
              type="number"
              min={1}
              step={1}
              value={duration}
              onChange={(event) => setDuration(event.target.value)}
              disabled={isLoading}
              placeholder="Ex.: 7"
              className="border-border/50"
            />
          </div>

          <div className="space-y-2.5">
            <Label className="text-sm font-medium">Unidade *</Label>
            <Select value={unit} onValueChange={(value) => setUnit(value as TrialDurationUnit)} disabled={isLoading}>
              <SelectTrigger className="w-full border-border/50">
                <SelectValue placeholder="Selecione a unidade" />
              </SelectTrigger>
              <SelectContent>
                {UNIT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2.5">
            <Label className="text-sm font-medium">Plano *</Label>
            <Select value={planType} onValueChange={(value) => setPlanType(value as PlanType)} disabled={isLoading}>
              <SelectTrigger className="w-full border-border/50">
                <SelectValue placeholder="Selecione o plano" />
              </SelectTrigger>
              <SelectContent>
                {PLAN_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading} className="shadow-sm">
            {isLoading ? "Concedendo..." : "Conceder Trial"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
