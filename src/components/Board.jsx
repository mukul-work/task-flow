"use client"

import { useState } from 'react'
import { ListColumn } from './ListColumn'
import { AddListButton } from './AddListButton'
import { LayoutDashboard, Plus, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'

function EmptyBoard({ onAddList }) {
  const [isAdding, setIsAdding] = useState(false)
  const [title, setTitle] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (title.trim()) {
      onAddList(title.trim())
      setTitle('')
      setIsAdding(false)
    }
  }

  if (isAdding) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <LayoutDashboard className="mb-4 h-16 w-16" style={{ color: 'var(--muted-foreground)' }} />
        <h2 className="mb-2 text-xl font-semibold" style={{ color: 'var(--foreground)' }}>Create your first list</h2>
        <form onSubmit={handleSubmit} className="mt-4 w-72">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Escape' && setIsAdding(false)}
            placeholder="Enter list title..."
            autoFocus
            className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--input)', color: 'var(--foreground)' }}
          />
          <div className="mt-2 flex items-center gap-2">
            <Button type="submit" size="sm" disabled={!title.trim()}>Add List</Button>
            <Button type="button" variant="ghost" size="icon-sm" onClick={() => setIsAdding(false)}
              style={{ color: 'var(--muted-foreground)' }}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <LayoutDashboard className="mb-4 h-16 w-16" style={{ color: 'var(--muted-foreground)' }} />
      <h2 className="mb-2 text-xl font-semibold" style={{ color: 'var(--foreground)' }}>No lists yet</h2>
      <p className="mb-4" style={{ color: 'var(--muted-foreground)' }}>Get started by creating your first list</p>
      <Button className="gap-2" onClick={() => setIsAdding(true)}>
        <Plus className="h-4 w-4" /> Create List
      </Button>
    </div>
  )
}

function NoBoard({ onAddBoard }) {
  const [isAdding, setIsAdding] = useState(false)
  const [title, setTitle] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (title.trim()) {
      onAddBoard(title.trim())
      setTitle('')
      setIsAdding(false)
    }
  }

  if (isAdding) {
    return (
      <div className="flex h-full flex-col items-center justify-center">
        <LayoutDashboard className="mb-4 h-16 w-16" style={{ color: 'var(--muted-foreground)' }} />
        <h2 className="mb-2 text-xl font-semibold" style={{ color: 'var(--foreground)' }}>Name your board</h2>
        <form onSubmit={handleSubmit} className="mt-4 w-72">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={(e) => e.key === 'Escape' && setIsAdding(false)}
            placeholder="e.g. Project Alpha"
            autoFocus
            className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
            style={{ borderColor: 'var(--border)', backgroundColor: 'var(--input)', color: 'var(--foreground)' }}
          />
          <div className="mt-2 flex items-center gap-2">
            <Button type="submit" size="sm" disabled={!title.trim()}>Create Board</Button>
            <Button type="button" variant="ghost" size="icon-sm" onClick={() => setIsAdding(false)}
              style={{ color: 'var(--muted-foreground)' }}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col items-center justify-center">
      <LayoutDashboard className="mb-4 h-20 w-20" style={{ color: 'var(--muted-foreground)' }} />
      <h2 className="mb-2 text-2xl font-semibold" style={{ color: 'var(--foreground)' }}>Welcome to TaskFlow</h2>
      <p className="mb-6 text-center max-w-xs" style={{ color: 'var(--muted-foreground)' }}>
        Create your first board to start organizing your tasks
      </p>
      <Button className="gap-2 px-6" onClick={() => setIsAdding(true)}>
        <Plus className="h-4 w-4" /> Create Your First Board
      </Button>
    </div>
  )
}

export function Board({ board, boards, onAddCard, onAddList, onDeleteCard, onDeleteList, onToggleCardComplete, onDrop, onAddBoard }) {
  // No board selected and no boards exist
  if (!board && boards.length === 0) {
    return <NoBoard onAddBoard={onAddBoard} />
  }

  // Boards exist but none selected
  if (!board) {
    return (
      <div className="flex h-full items-center justify-center">
        <p style={{ color: 'var(--muted-foreground)' }}>Select a board to get started</p>
      </div>
    )
  }

  if (board.lists.length === 0) {
    return <EmptyBoard onAddList={onAddList} />
  }

  return (
    <div className="flex h-full gap-4 overflow-x-auto p-6 scrollbar-thin">
      {board.lists.map((list) => (
        <ListColumn
          key={list.id}
          list={list}
          onAddCard={onAddCard}
          onDeleteCard={onDeleteCard}
          onDeleteList={onDeleteList}
          onToggleCardComplete={onToggleCardComplete}
          onDrop={onDrop}
        />
      ))}
      <AddListButton onAdd={onAddList} />
    </div>
  )
}
