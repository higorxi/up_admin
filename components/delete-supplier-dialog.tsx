"use client"

import { useState } from "react"
import { DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertCircle, Trash2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AdminConfirmDialog } from "@/components/admin-confirm-dialog"

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
    <AdminConfirmDialog
      open={isOpen}
      onOpenChange={(open) => !open && handleClose()}
      title="Desativar Lojista Parceiro"
      description={
        <>
          Tem certeza que deseja desativar <strong className="text-foreground">{supplierName}</strong>? Esta ação impedirá o acesso dele à plataforma e removerá sua loja das buscas.
        </>
      }
      icon={
        <div className="w-10 h-10 rounded-lg bg-destructive/10 flex items-center justify-center">
          <Trash2 className="h-5 w-5 text-destructive" />
        </div>
      }
      footer={
        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
            className="mr-auto"
          >
            Cancelar
          </Button>

          <Button
            variant="destructive"
            onClick={handleSubmit}
            disabled={isLoading}
            loading={isLoading}
            loadingText="Desativando..."
          >
            <div className="flex items-center gap-2">
              <Trash2 className="h-4 w-4" />
              Confirmar Desativação
            </div>
          </Button>
        </DialogFooter>
      }
    >
        <div className="space-y-4">
          {error && (
            <Alert variant="destructive" className="border-destructive/50">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
    </AdminConfirmDialog>
  )
}
