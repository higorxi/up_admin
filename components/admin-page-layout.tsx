import type React from "react"
import { PageTransition } from "./page-transition"

interface AdminPageLayoutProps {
  children: React.ReactNode
  title: string
  description: string
  actions?: React.ReactNode
}

export function AdminPageLayout({ children, title, description, actions }: AdminPageLayoutProps) {
  return (
    <PageTransition>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-foreground tracking-tight">{title}</h1>
            <p className="text-muted-foreground">{description}</p>
          </div>
          {actions && <div className="flex gap-2">{actions}</div>}
        </div>

        {/* Content */}
        {children}
      </div>
    </PageTransition>
  )
}
