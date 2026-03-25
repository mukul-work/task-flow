import { useState } from 'react'
import { Navbar } from '@/components/Navbar'
import { Sidebar } from '@/components/Sidebar'
import { Board } from '@/components/Board'

export default function App() {
  const [boards, setBoards] = useState([])
  const [selectedBoardId, setSelectedBoardId] = useState('')
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  const selectedBoard = boards.find((b) => b.id === selectedBoardId)

  const filteredBoard =
    selectedBoard && searchQuery.trim()
      ? {
          ...selectedBoard,
          lists: selectedBoard.lists.map((list) => ({
            ...list,
            cards: list.cards.filter(
              (card) =>
                card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                card.description?.toLowerCase().includes(searchQuery.toLowerCase())
            ),
          })),
        }
      : selectedBoard

  // Board handlers
  const handleAddBoard = (boardTitle) => {
    const newBoard = { id: `b${Date.now()}`, title: boardTitle, lists: [] }
    setBoards((prev) => [...prev, newBoard])
    setSelectedBoardId(newBoard.id)
  }

  const handleDeleteBoard = (boardId) => {
    setBoards((prevBoards) => {
      const remaining = prevBoards.filter((b) => b.id !== boardId)
      if (boardId === selectedBoardId) setSelectedBoardId(remaining[0]?.id || '')
      return remaining
    })
  }

  // List handlers
  const handleAddList = (listTitle) => {
    setBoards((prev) =>
      prev.map((board) => {
        if (board.id !== selectedBoardId) return board
        return {
          ...board,
          lists: [...board.lists, { id: `l${Date.now()}`, title: listTitle, cards: [] }],
        }
      })
    )
  }

  const handleDeleteList = (listId) => {
    setBoards((prev) =>
      prev.map((board) => {
        if (board.id !== selectedBoardId) return board
        return { ...board, lists: board.lists.filter((l) => l.id !== listId) }
      })
    )
  }

  // Card handlers
  const handleAddCard = (listId, cardTitle) => {
    setBoards((prev) =>
      prev.map((board) => {
        if (board.id !== selectedBoardId) return board
        return {
          ...board,
          lists: board.lists.map((list) => {
            if (list.id !== listId) return list
            return { ...list, cards: [...list.cards, { id: `c${Date.now()}`, title: cardTitle }] }
          }),
        }
      })
    )
  }

  const handleDeleteCard = (listId, cardId) => {
    setBoards((prev) =>
      prev.map((board) => {
        if (board.id !== selectedBoardId) return board
        return {
          ...board,
          lists: board.lists.map((list) => {
            if (list.id !== listId) return list
            return { ...list, cards: list.cards.filter((c) => c.id !== cardId) }
          }),
        }
      })
    )
  }

  const handleToggleCardComplete = (listId, cardId) => {
    setBoards((prev) =>
      prev.map((board) => {
        if (board.id !== selectedBoardId) return board
        return {
          ...board,
          lists: board.lists.map((list) => {
            if (list.id !== listId) return list
            return {
              ...list,
              cards: list.cards.map((card) => {
                if (card.id !== cardId) return card
                return { ...card, completed: !card.completed }
              }),
            }
          }),
        }
      })
    )
  }

  // Drag & Drop handler
  // For card: dragInfo = { cardId, fromListId }
  // For list: dragInfo = { listId }
  const handleDrop = (dragInfo, targetListId, targetCardId = null) => {
    if (dragInfo.listId) {
      // Reorder lists
      setBoards((prev) =>
        prev.map((board) => {
          if (board.id !== selectedBoardId) return board
          const lists = [...board.lists]
          const fromIdx = lists.findIndex((l) => l.id === dragInfo.listId)
          const toIdx = lists.findIndex((l) => l.id === targetListId)
          if (fromIdx === -1 || toIdx === -1 || fromIdx === toIdx) return board
          const [moved] = lists.splice(fromIdx, 1)
          lists.splice(toIdx, 0, moved)
          return { ...board, lists }
        })
      )
      return
    }

    const { cardId, fromListId } = dragInfo
    if (!cardId || !fromListId || !targetListId) return

    setBoards((prev) =>
      prev.map((board) => {
        if (board.id !== selectedBoardId) return board
        const fromList = board.lists.find((l) => l.id === fromListId)
        if (!fromList) return board
        const card = fromList.cards.find((c) => c.id === cardId)
        if (!card) return board

        // Remove card from source list
        let newLists = board.lists.map((list) => {
          if (list.id !== fromListId) return list
          return { ...list, cards: list.cards.filter((c) => c.id !== cardId) }
        })

        // Insert card into target list
        newLists = newLists.map((list) => {
          if (list.id !== targetListId) return list
          const cards = [...list.cards]
          if (targetCardId) {
            const idx = cards.findIndex((c) => c.id === targetCardId)
            cards.splice(idx !== -1 ? idx : cards.length, 0, card)
          } else {
            cards.push(card)
          }
          return { ...list, cards }
        })

        return { ...board, lists: newLists }
      })
    )
  }

  return (
    <div style={{ display: 'flex', height: '100vh', flexDirection: 'column', overflow: 'hidden' }}>
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        <Sidebar
          boards={boards}
          selectedBoardId={selectedBoardId}
          onSelectBoard={setSelectedBoardId}
          onDeleteBoard={handleDeleteBoard}
          onAddBoard={handleAddBoard}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />
        <main style={{ flex: 1, overflow: 'hidden', backgroundColor: 'var(--background)' }}>
          {selectedBoard && (
            <div className="flex h-12 items-center border-b px-6" style={{ borderColor: 'var(--border)' }}>
              <h1 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
                {selectedBoard.title}
              </h1>
            </div>
          )}
          <div style={{ height: selectedBoard ? 'calc(100% - 3rem)' : '100%' }}>
            <Board
              board={filteredBoard}
              boards={boards}
              onAddCard={handleAddCard}
              onAddList={handleAddList}
              onDeleteCard={handleDeleteCard}
              onDeleteList={handleDeleteList}
              onToggleCardComplete={handleToggleCardComplete}
              onDrop={handleDrop}
              onAddBoard={handleAddBoard}
            />
          </div>
        </main>
      </div>
    </div>
  )
}
