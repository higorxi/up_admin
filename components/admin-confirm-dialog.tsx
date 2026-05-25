"use client"

import type React from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface AdminConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: React.ReactNode
  description?: React.ReactNode
  icon?: React.ReactNode
  children?: React.ReactNode
  footer?: React.ReactNode
  className?: string
  bodyClassName?: string
  contentClassName?: string
}

export function AdminConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  icon,
  children,
  footer,
  className,
  bodyClassName,
  contentClassName,
}: AdminConfirmDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "grid max-h-[calc(100vh-32px)] w-[min(560px,calc(100vw-32px))] max-w-none grid-rows-[auto_minmax(0,1fr)_auto] gap-0 overflow-hidden p-0",
          className,
        )}
      >
        <DialogHeader className="border-b bg-muted/35 px-5 py-4 pr-12">
          <DialogTitle className="flex items-center gap-2.5 text-lg leading-tight">
            {icon}
            <span className="min-w-0 truncate">{title}</span>
          </DialogTitle>
          {description ? <DialogDescription className="leading-relaxed">{description}</DialogDescription> : null}
        </DialogHeader>

        <ScrollArea className={cn("min-h-0", bodyClassName)}>
          <div className={cn("px-5 py-4", contentClassName)}>{children}</div>
        </ScrollArea>

        {footer ? <div className="border-t bg-background px-5 py-4">{footer}</div> : null}
      </DialogContent>
    </Dialog>
  )
}
