import { createContext, useContext, useState, useRef, useEffect } from 'react'
import { cn } from '@/lib/utils'

const DialogContext = createContext(null)

export function Dialog({ children, open: controlledOpen, onOpenChange }) {
  const [internalOpen, setInternalOpen] = useState(false)
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen
  
  const setOpen = (value) => {
    if (controlledOpen !== undefined) {
      if (onOpenChange) onOpenChange(value)
    } else {
      setInternalOpen(value)
    }
  }
  
  return (
    <DialogContext.Provider value={{ open, setOpen }}>
      {children}
    </DialogContext.Provider>
  )
}

export function DialogContent({ className, children }) {
  const { open, setOpen } = useContext(DialogContext)
  const ref = useRef(null)
  
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [setOpen])
  
  if (!open) return null
  
  return (
    <>
      <div className="fixed inset-0 z-50 bg-black/50" onClick={() => setOpen(false)} />
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          ref={ref}
          className={cn(
            'relative w-full max-w-lg rounded-lg border bg-background p-6 shadow-lg',
            className
          )}
        >
          {children}
        </div>
      </div>
    </>
  )
}

export function DialogHeader({ className, children }) {
  return <div className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)}>{children}</div>
}

export function DialogTitle({ className, children }) {
  return <h2 className={cn('text-lg font-semibold leading-none tracking-tight', className)}>{children}</h2>
}

export function DialogDescription({ className, children }) {
  return <p className={cn('text-sm text-muted-foreground', className)}>{children}</p>
}