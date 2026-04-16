"use client"

import { useEffect, useMemo, useState } from "react"
import { AlertCircle, Coins } from "lucide-react"
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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

interface SupplierPointsLimitDialogProps {
  isOpen: boolean
  supplierName: string
  currentPointsAwarded?: number | null
  pointsLimit?: number | null
  onClose: () => void
  onConfirm: (pointsLimit: number) => Promise<void>
}

export function SupplierPointsLimitDialog({
  isOpen,
  supplierName,
  currentPointsAwarded,
  pointsLimit,
  onClose,
  onConfirm,
}: SupplierPointsLimitDialogProps) {
  const [limitInput, setLimitInput] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const awarded = currentPointsAwarded ?? 0
  const currentLimit = pointsLimit ?? 0

  useEffect(() => {
    if (isOpen) {
      setLimitInput(pointsLimit != null ? String(pointsLimit) : "")
      setError("")
    }
  }, [isOpen, pointsLimit])

  const usagePercentage = useMemo(() => {
    if (!currentLimit || currentLimit <= 0) return 0
    return Math.min((awarded / currentLimit) * 100, 100)
  }, [awarded, currentLimit])

  const handleClose = () => {
    if (isLoading) return
    setError("")
    onClose()
  }

  const handleSubmit = async () => {
    const parsed = Number.parseInt(limitInput, 10)

    if (!Number.isFinite(parsed) || parsed <= 0) {
      setError("Informe um limite válido maior que zero.")
      return
    }

    if (parsed < awarded) {
      setError("O limite não pode ser menor que o consumo atual de pontos.")
      return
    }

    setError("")
    setIsLoading(true)

    try {
      await onConfirm(parsed)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível atualizar o limite de pontos.")
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
              <Coins className="h-5 w-5 text-primary" />
            </div>
            <span>Gerenciar Limite de Pontos</span>
          </DialogTitle>
          <DialogDescription className="pt-2 leading-relaxed">
            Atualize o limite de distribuição para <strong className="text-foreground">{supplierName}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {error && (
            <Alert variant="destructive" className="border-destructive/50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="rounded-lg border border-border/60 bg-muted/30 p-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Consumo atual</span>
              <span className="font-medium text-card-foreground">
                {awarded.toLocaleString("pt-BR")} / {currentLimit.toLocaleString("pt-BR")}
              </span>
            </div>
            <Progress value={usagePercentage} />
          </div>

          <div className="space-y-2.5">
            <Label htmlFor="points-limit" className="text-sm font-medium">
              Limite de Pontos *
            </Label>
            <Input
              id="points-limit"
              type="number"
              min={1}
              step={1}
              value={limitInput}
              onChange={(event) => setLimitInput(event.target.value)}
              disabled={isLoading}
              placeholder="Ex.: 1000"
              className="border-border/50"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading} loading={isLoading} loadingText="Salvando...">
            Salvar Limite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
