"use client"

import { useState, useRef, useEffect } from 'react'
import { Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export function AddListButton({ onAdd }) {
  const [isAdding, setIsAdding] = useState(false)
  const [title, setTitle] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    if (isAdding) {
      inputRef.current?.focus()
    }
  }, [isAdding])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (title.trim()) {
      onAdd(title.trim())
      setTitle('')
      setIsAdding(false)
    }
  }

  const handleCancel = () => {
    setTitle('')
    setIsAdding(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleCancel()
    }
  }

  if (isAdding) {
    return (
      <div
        className="w-72 shrink-0 rounded-xl border p-3"
        style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)' }}
      >
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter list title..."
            className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
            style={{
              borderColor: 'var(--border)',
              backgroundColor: 'var(--input)',
              color: 'var(--foreground)',
            }}
          />
          <div className="mt-2 flex items-center gap-2">
            <Button type="submit" size="sm" disabled={!title.trim()}>
              Add List
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={handleCancel}
              style={{ color: 'var(--muted-foreground)' }}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Cancel</span>
            </Button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <button
      onClick={() => setIsAdding(true)}
      className="flex h-12 w-72 shrink-0 items-center justify-center gap-2 rounded-xl border-2 border-dashed text-sm font-medium transition-colors focus:outline-none focus:ring-2"
      style={{
        borderColor: 'var(--border)',
        backgroundColor: 'transparent',
        color: 'var(--muted-foreground)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'var(--primary)'
        e.currentTarget.style.color = 'var(--foreground)'
        e.currentTarget.style.backgroundColor = 'var(--card)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'var(--border)'
        e.currentTarget.style.color = 'var(--muted-foreground)'
        e.currentTarget.style.backgroundColor = 'transparent'
      }}
    >
      <Plus className="h-4 w-4" />
      Add List
    </button>
  )
}
