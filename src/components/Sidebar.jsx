"use client"

import { useState } from 'react'
import { Plus, LayoutDashboard, ChevronRight, Menu, PanelLeftClose, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export function Sidebar({ boards, selectedBoardId, onSelectBoard, onDeleteBoard, onAddBoard, isCollapsed, onToggleCollapse }) {
  const [hoveredBoardId, setHoveredBoardId] = useState(null)
  const [isAddingBoard, setIsAddingBoard] = useState(false)
  const [newBoardTitle, setNewBoardTitle] = useState('')

  const handleAddBoard = (e) => {
    e.preventDefault()
    if (newBoardTitle.trim()) {
      onAddBoard(newBoardTitle.trim())
      setNewBoardTitle('')
      setIsAddingBoard(false)
    }
  }

  return (
    <aside
      className={cn('flex flex-col border-r transition-all duration-300', isCollapsed ? 'w-14' : 'w-64')}
      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--sidebar)' }}
    >
      {/* Header */}
      <div className={cn('flex items-center p-4', isCollapsed ? 'justify-center' : 'justify-between')}>
        {!isCollapsed && (
          <h2 className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>Your Boards</h2>
        )}
        <div className="flex items-center gap-1">
          {!isCollapsed && (
            <Button
              variant="ghost"
              size="icon-sm"
              style={{ color: 'var(--muted-foreground)' }}
              onClick={() => { setIsAddingBoard(true) }}
              title="Add board"
            >
              <Plus className="h-4 w-4" />
              <span className="sr-only">Create board</span>
            </Button>
          )}
          <Button variant="ghost" size="icon-sm" onClick={onToggleCollapse} style={{ color: 'var(--muted-foreground)' }}>
            {isCollapsed ? <Menu className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Add board inline form */}
      {isAddingBoard && !isCollapsed && (
        <div className="px-2 pb-2">
          <form onSubmit={handleAddBoard}>
            <input
              autoFocus
              type="text"
              value={newBoardTitle}
              onChange={(e) => setNewBoardTitle(e.target.value)}
              onKeyDown={(e) => e.key === 'Escape' && setIsAddingBoard(false)}
              placeholder="Board name..."
              className="w-full rounded-lg border px-3 py-1.5 text-sm focus:outline-none focus:ring-2"
              style={{ borderColor: 'var(--border)', backgroundColor: 'var(--input)', color: 'var(--foreground)' }}
            />
            <div className="mt-1.5 flex gap-1">
              <Button type="submit" size="sm" disabled={!newBoardTitle.trim()} className="flex-1 text-xs h-7">
                Add
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                className="h-7 w-7"
                onClick={() => { setIsAddingBoard(false); setNewBoardTitle('') }}
                style={{ color: 'var(--muted-foreground)' }}
              >
                <X className="h-3.5 w-3.5" />
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Board list */}
      <nav className="flex-1 space-y-1 px-2 overflow-y-auto">
        {isCollapsed ? (
          <>
            {boards.map((board) => (
              <button
                key={board.id}
                onClick={() => onSelectBoard(board.id)}
                title={board.title}
                className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors"
                style={{
                  backgroundColor: selectedBoardId === board.id ? 'var(--sidebar-accent)' : 'transparent',
                  color: selectedBoardId === board.id ? 'var(--sidebar-accent-foreground)' : 'var(--muted-foreground)',
                }}
              >
                <LayoutDashboard className="h-4 w-4" />
              </button>
            ))}
            <button
              onClick={() => { onToggleCollapse(); setIsAddingBoard(true) }}
              title="Add board"
              className="flex h-10 w-10 items-center justify-center rounded-lg transition-colors"
              style={{ color: 'var(--muted-foreground)' }}
            >
              <Plus className="h-4 w-4" />
            </button>
          </>
        ) : boards.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <LayoutDashboard className="mb-2 h-8 w-8" style={{ color: 'var(--muted-foreground)' }} />
            <p className="text-sm mb-2" style={{ color: 'var(--muted-foreground)' }}>No boards yet</p>
            <Button variant="default" size="sm" onClick={() => setIsAddingBoard(true)}>
              <Plus className="h-3.5 w-3.5 mr-1" /> Create Board
            </Button>
          </div>
        ) : (
          boards.map((board) => (
            <div
              key={board.id}
              className="relative flex items-center"
              onMouseEnter={() => setHoveredBoardId(board.id)}
              onMouseLeave={() => setHoveredBoardId(null)}
            >
              <button
                onClick={() => onSelectBoard(board.id)}
                className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors"
                style={{
                  backgroundColor: selectedBoardId === board.id ? 'var(--sidebar-accent)' : 'transparent',
                  color: selectedBoardId === board.id ? 'var(--sidebar-accent-foreground)' : 'var(--muted-foreground)',
                  paddingRight: hoveredBoardId === board.id ? '2rem' : undefined,
                }}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <LayoutDashboard className="h-4 w-4 shrink-0" />
                  <span className="truncate">{board.title}</span>
                </div>
                {hoveredBoardId !== board.id && (
                  <ChevronRight className="h-4 w-4 shrink-0 transition-opacity"
                    style={{ opacity: selectedBoardId === board.id ? 1 : 0 }} />
                )}
              </button>
              {hoveredBoardId === board.id && (
                <button
                  onClick={(e) => { e.stopPropagation(); onDeleteBoard(board.id) }}
                  className="absolute right-2 flex h-6 w-6 items-center justify-center rounded transition-colors"
                  style={{ color: 'var(--muted-foreground)' }}
                  onMouseEnter={(e) => e.currentTarget.style.color = 'var(--destructive)'}
                  onMouseLeave={(e) => e.currentTarget.style.color = 'var(--muted-foreground)'}
                  aria-label={`Delete ${board.title}`}
                  title={`Delete ${board.title}`}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
          ))
        )}
      </nav>
    </aside>
  )
}
