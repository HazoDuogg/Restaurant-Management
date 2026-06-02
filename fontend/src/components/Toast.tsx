import { useEffect } from 'react'
import { useNotificationStore } from '../state/notification'

const typeStyles = {
  error: 'bg-red-500',
  success: 'bg-green-500',
  info: 'bg-blue-500',
}

export function Toast() {
  const { message, type, clear } = useNotificationStore()

  useEffect(() => {
    if (!message) return
    const timer = setTimeout(clear, 3000)
    return () => clearTimeout(timer)
  }, [message, clear])

  if (!message) return null

  return (
    <div className={`fixed top-4 right-4 z-50 ${typeStyles[type]} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-fade-in`}>
      <span>{message}</span>
      <button onClick={clear} className="text-white/80 hover:text-white text-lg leading-none">&times;</button>
    </div>
  )
}
