import { useState, useRef } from 'react'
import { Plus, Inbox, Trash2, GripVertical } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from './Card'
import { AddCardModal } from './AddCardModal'

export function ListColumn({ list, onAddCard, onDeleteCard, onDeleteList, onToggleCardComplete, onDrop }) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDragOver, setIsDragOver] = useState(false)
  const [isDraggingList, setIsDraggingList] = useState(false)

  const handleListDragStart = (e) => {
    e.dataTransfer.effectAllowed = 'move'
    e.dataTransfer.setData('application/json', JSON.stringify({ listId: list.id }))
    setIsDraggingList(true)
  }

  const handleListDragEnd = () => setIsDraggingList(false)

  // Drop onto the list container (when dragging a card over empty area)
  const handleListDragOver = (e) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setIsDragOver(true)
  }

  const handleListDragLeave = (e) => {
    // Only clear if leaving the list container itself
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragOver(false)
    }
  }

  const handleListDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'))
      // If it's a list being dropped on another list header → reorder lists
      if (data.listId) {
        onDrop(data, list.id)
      } else {
        // Card dropped onto the list body (not a specific card) → append to end
        onDrop(data, list.id, null)
      }
    } catch {}
  }

  const handleCardDrop = (dragData, targetListId, targetCardId) => {
    onDrop(dragData, targetListId, targetCardId)
  }

  return (
    <>
      <div
        className="flex w-72 shrink-0 flex-col rounded-xl border transition-all"
        style={{
          borderColor: isDragOver ? 'var(--primary)' : 'var(--border)',
          backgroundColor: 'var(--card)',
          opacity: isDraggingList ? 0.5 : 1,
        }}
        onDragOver={handleListDragOver}
        onDragLeave={handleListDragLeave}
        onDrop={handleListDrop}
      >
        {/* List header — drag handle for reordering lists */}
        <div
          className="flex items-center justify-between px-3 py-3 cursor-grab active:cursor-grabbing"
          draggable
          onDragStart={handleListDragStart}
          onDragEnd={handleListDragEnd}
        >
          <div className="flex items-center gap-2">
            <GripVertical className="h-4 w-4 shrink-0" style={{ color: 'var(--muted-foreground)' }} />
            <h3 className="font-medium" style={{ color: 'var(--card-foreground)' }}>{list.title}</h3>
            <span className="rounded-full px-2 py-0.5 text-xs"
              style={{ backgroundColor: 'var(--muted)', color: 'var(--muted-foreground)' }}>
              {list.cards.length}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            className="h-7 w-7"
            onClick={() => onDeleteList(list.id)}
            aria-label={`Delete ${list.title} list`}
            style={{ color: 'var(--muted-foreground)' }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Cards */}
        <div className="flex max-h-[calc(100vh-280px)] flex-1 flex-col gap-2 overflow-y-auto px-3 pb-2 scrollbar-thin">
          {list.cards.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-8 text-center rounded-lg border-2 border-dashed transition-colors"
              style={{
                borderColor: isDragOver ? 'var(--primary)' : 'transparent',
                backgroundColor: isDragOver ? 'var(--muted)' : 'transparent',
              }}
            >
              <Inbox className="mb-2 h-8 w-8" style={{ color: 'var(--muted-foreground)' }} />
              <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                {isDragOver ? 'Drop here' : 'No cards yet'}
              </p>
            </div>
          ) : (
            list.cards.map((card) => (
              <Card
                key={card.id}
                card={card}
                listId={list.id}
                onDelete={(cardId) => onDeleteCard(list.id, cardId)}
                onToggleComplete={(cardId) => onToggleCardComplete(list.id, cardId)}
                onDrop={handleCardDrop}
              />
            ))
          )}
        </div>

        {/* Add card */}
        <div className="border-t p-2" style={{ borderColor: 'var(--border)' }}>
          <Button
            variant="ghost"
            className="w-full justify-start gap-2"
            onClick={() => setIsModalOpen(true)}
            style={{ color: 'var(--muted-foreground)' }}
          >
            <Plus className="h-4 w-4" />
            Add Card
          </Button>
        </div>
      </div>

      <AddCardModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={(title) => onAddCard(list.id, title)}
        listTitle={list.title}
      />
    </>
  )
}
