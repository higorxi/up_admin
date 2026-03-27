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
import { AlertCircle, Trash2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface DeleteSupplierDialogProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => Promise<void>
  supplierName: string
}

export function DeleteSupplierDialog({ isOpen, onClose, onConfirm, supplierName }: DeleteSupplierDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async () => {
    setIsLoading(true)
    setError("")

    try {
      await onConfirm()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao desativar lojista parceiro")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      setError("")
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2.5 text-destructive">
            <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
              <Trash2 className="h-5 w-5" />
            </div>
            <span>Desativar Lojista Parceiro</span>
          </DialogTitle>
          <DialogDescription className="pt-2 leading-relaxed">
            Tem certeza que deseja desativar <strong className="text-foreground">{supplierName}</strong>? Esta ação impedirá o acesso dele à plataforma e removerá sua loja das buscas.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {error && (
            <Alert variant="destructive" className="border-destructive/50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
            <div className="flex gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600 shrink-0" />
              <div className="space-y-1">
                <p className="text-sm font-medium text-yellow-800">Atenção</p>
                <p className="text-sm text-yellow-700 leading-relaxed">
                  O backend realizará um "Soft Delete", desativando usuários e cancelando assinaturas automaticamente.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleClose} disabled={isLoading} className="transition-colors">
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleSubmit}
            disabled={isLoading}
            loading={isLoading}
            loadingText="Desativando..."
            className="transition-colors shadow-sm"
          >
            <div className="flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              Confirmar Desativação
            </div>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
