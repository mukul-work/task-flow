"use client"

import { useRef } from 'react'
import { X, Circle, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export function Card({ card, listId, onDelete, onToggleComplete, onDragStart, onDragOver, onDrop }) {
  const dragOver = useRef(false)

  const handleDragStart = (e) => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('application/json', JSON.stringify({ cardId: card.id, fromListId: listId }))
    onDragStart && onDragStart({ cardId: card.id, fromListId: listId })
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (!dragOver.current) {
      dragOver.current = true
      onDragOver && onDragOver(card.id)
    }
  }

  const handleDragLeave = () => {
    dragOver.current = false
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    dragOver.current = false
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'))
      onDrop && onDrop(data, listId, card.id)
    } catch {}
  }

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'group relative flex cursor-grab active:cursor-grabbing items-start gap-2 rounded-lg border p-3 shadow-sm transition-all focus:outline-none',
        card.completed && 'opacity-60'
      )}
      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--card)', color: 'var(--card-foreground)' }}
      tabIndex={0}
      role="button"
      aria-label={`Task: ${card.title}${card.completed ? ' (completed)' : ''}`}
    >
      {/* Toggle complete */}
      <button
        onClick={(e) => { e.stopPropagation(); onToggleComplete(card.id) }}
        className="mt-0.5 shrink-0 transition-colors focus:outline-none"
        style={{ color: 'var(--muted-foreground)' }}
        aria-label={card.completed ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {card.completed
          ? <CheckCircle2 className="h-4 w-4" style={{ color: 'var(--primary)' }} />
          : <Circle className="h-4 w-4" />}
      </button>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p className={cn('text-sm font-medium', card.completed && 'line-through')}
          style={{ color: card.completed ? 'var(--muted-foreground)' : 'var(--card-foreground)' }}>
          {card.title}
        </p>
        {card.description && (
          <p className={cn('mt-1 text-xs line-clamp-2', card.completed && 'line-through')}
            style={{ color: 'var(--muted-foreground)' }}>
            {card.description}
          </p>
        )}
      </div>

      {/* Delete */}
      <Button
        variant="ghost"
        size="icon-sm"
        className="absolute right-1 top-1 h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
        onClick={(e) => { e.stopPropagation(); onDelete(card.id) }}
        aria-label={`Delete ${card.title}`}
        style={{ color: 'var(--muted-foreground)' }}
      >
        <X className="h-3.5 w-3.5" />
      </Button>
    </div>
  )
}
