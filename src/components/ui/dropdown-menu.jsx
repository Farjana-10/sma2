import { useState, useRef, useEffect, createContext, useContext } from 'react'
import { cn } from '@/lib/utils'

const DropdownMenuContext = createContext(null)

export function DropdownMenu({ children, onOpenChange }) {
  const [open, setOpen] = useState(false)
  
  const handleOpenChange = (value) => {
    setOpen(value)
    if (onOpenChange) onOpenChange(value)
  }
  
  return (
    <DropdownMenuContext.Provider value={{ open, setOpen: handleOpenChange }}>
      <div className="relative inline-block">{children}</div>
    </DropdownMenuContext.Provider>
  )
}

export function DropdownMenuTrigger({ asChild, children, className }) {
  const { open, setOpen } = useContext(DropdownMenuContext)
  const Comp = asChild ? 'span' : 'button'
  
  return (
    <Comp
      className={cn('inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2', className)}
      onClick={() => setOpen(!open)}
    >
      {children}
    </Comp>
  )
}

export function DropdownMenuContent({ align = 'end', className, children }) {
  const { open, setOpen } = useContext(DropdownMenuContext)
  const ref = useRef(null)
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [setOpen])
  
  if (!open) return null
  
  return (
    <div
      ref={ref}
      className={cn(
        'absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md',
        align === 'end' ? 'right-0' : 'left-0',
        'mt-2',
        className
      )}
    >
      {children}
    </div>
  )
}

export function DropdownMenuItem({ className, children, onClick, asChild }) {
  const { setOpen } = useContext(DropdownMenuContext)
  const Comp = asChild ? 'span' : 'button'
  
  return (
    <Comp
      className={cn(
        'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 w-full text-left',
        className
      )}
      onClick={(e) => {
        if (onClick) onClick(e)
        setOpen(false)
      }}
    >
      {children}
    </Comp>
  )
}

export function DropdownMenuLabel({ className, children }) {
  return (
    <div className={cn('px-2 py-1.5 text-sm font-semibold', className)}>
      {children}
    </div>
  )
}

export function DropdownMenuSeparator({ className }) {
  return <div className={cn('h-px bg-border my-1', className)} />
}