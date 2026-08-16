import { Toaster as Sonner } from 'sonner'

export function Toaster({ position = 'top-right', richColors = true }) {
  return <Sonner position={position} richColors={richColors} />
}