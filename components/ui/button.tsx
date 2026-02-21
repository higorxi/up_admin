'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { Loader2 } from 'lucide-react'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default:
          'bg-primary text-primary-foreground shadow-xs hover:bg-primary/90',
        destructive:
          'bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        secondary:
          'bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80',
        ghost:
          'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  loading = false,
  loadingText,
  preventDoubleClick = true,
  onClick,
  disabled,
  type,
  children,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    loading?: boolean
    loadingText?: React.ReactNode
    preventDoubleClick?: boolean
  }) {
  const SUBMIT_CLICK_LOCK_MS = 400
  const Comp = asChild ? Slot : 'button'
  const [internalLoading, setInternalLoading] = React.useState(false)
  const lockRef = React.useRef(false)
  const submitLockTimeoutRef = React.useRef<number | null>(null)

  const isLoading = loading || internalLoading
  const isDisabled = Boolean(disabled || isLoading)

  React.useEffect(() => {
    return () => {
      if (submitLockTimeoutRef.current !== null) {
        window.clearTimeout(submitLockTimeoutRef.current)
      }
    }
  }, [])

  const isPromiseLike = (value: unknown): value is Promise<unknown> => {
    return typeof value === 'object' && value !== null && 'then' in value && typeof value.then === 'function'
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (!preventDoubleClick) {
      onClick?.(event)
      return
    }

    if (isDisabled || lockRef.current) {
      event.preventDefault()
      event.stopPropagation()
      return
    }

    const isSubmitButton = type === 'submit' || (type === undefined && event.currentTarget.form !== null)
    const shouldGuardSubmit = isSubmitButton && !onClick

    if (!onClick && !shouldGuardSubmit) {
      return
    }

    lockRef.current = true

    let result: unknown

    try {
      result = onClick?.(event)
    } catch (error) {
      lockRef.current = false
      throw error
    }

    if (isPromiseLike(result)) {
      setInternalLoading(true)

      void Promise.resolve(result)
        .catch(() => undefined)
        .finally(() => {
          lockRef.current = false
          setInternalLoading(false)
        })
      return
    }

    if (shouldGuardSubmit) {
      setInternalLoading(true)
      if (submitLockTimeoutRef.current !== null) {
        window.clearTimeout(submitLockTimeoutRef.current)
      }
      submitLockTimeoutRef.current = window.setTimeout(() => {
        lockRef.current = false
        setInternalLoading(false)
      }, SUBMIT_CLICK_LOCK_MS)
      return
    }

    lockRef.current = false
  }

  return (
    <Comp
      data-slot="button"
      data-loading={isLoading ? 'true' : undefined}
      aria-busy={isLoading || undefined}
      aria-disabled={isDisabled || undefined}
      disabled={asChild ? undefined : isDisabled}
      className={cn(buttonVariants({ variant, size, className }))}
      onClick={asChild ? onClick : handleClick}
      {...props}
    >
      {!asChild && isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          {loadingText ?? children}
        </>
      ) : (
        children
      )}
    </Comp>
  )
}

export { Button, buttonVariants }
