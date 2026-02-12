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
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { AlertCircle, X } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface RejectSupplierDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (reason: string) => Promise<void>
  supplierName: string
}

export function RejectSupplierDialog({ isOpen, onClose, onConfirm, supplierName }: RejectSupplierDialogProps) {
  const [reason, setReason] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    if (!reason.trim()) {
      setError("Por favor, informe o motivo da rejeição.")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      await onConfirm(reason)
      setReason("")
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao rejeitar fornecedor")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setReason("")
      setError("")
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            Rejeitar Fornecedor
          </DialogTitle>
          <DialogDescription>
            Você está prestes a rejeitar o cadastro de <strong>{supplierName}</strong>. O fornecedor não poderá acessar
            o sistema e receberá uma mensagem orientando-o a entrar em contato com o suporte.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="reason">Motivo da Rejeição *</Label>
            <Textarea
              id="reason"
              placeholder="Descreva o motivo da rejeição do cadastro..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              disabled={isLoading}
              rows={4}
              className="resize-none"
            />
            <p className="text-xs text-muted-foreground">
              Este motivo será registrado internamente para controle administrativo.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Rejeitando...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <X className="h-4 w-4" />
                Confirmar Rejeição
              </div>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
