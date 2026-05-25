"use client"

import type React from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface AdminDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: React.ReactNode
  description?: React.ReactNode
  icon?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
  className?: string
  bodyClassName?: string
  contentClassName?: string
}

export function AdminDialog({
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
}: AdminDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          "grid h-[min(90vh,900px)] max-h-[calc(100vh-32px)] w-[min(1240px,calc(100vw-32px))] max-w-none sm:max-w-none grid-rows-[auto_minmax(0,1fr)_auto] gap-0 overflow-hidden p-0",
          className,
        )}
      >
        <DialogHeader className="border-b bg-muted/45 px-6 py-5 pr-14">
          <DialogTitle className="flex items-center gap-3 text-2xl leading-tight">
            {icon}
            <span className="min-w-0 truncate">{title}</span>
          </DialogTitle>
          {description ? (
            <DialogDescription className="text-base leading-relaxed">{description}</DialogDescription>
          ) : null}
        </DialogHeader>

        <ScrollArea className={cn("min-h-0 admin-dialog-scroll", bodyClassName)}>
          <div className={cn("px-6 py-5", contentClassName)}>{children}</div>
        </ScrollArea>

        {footer ? <div className="border-t bg-background px-6 py-4">{footer}</div> : null}
      </DialogContent>
    </Dialog>
  )
}
