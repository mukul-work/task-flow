"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession, signIn } from "next-auth/react";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { Board } from "@/components/Board";
import { getBoards, createBoard, deleteBoard } from "@/lib/api/boards";
import { getLists, createList, deleteList } from "@/lib/api/lists";
import { getCards, createCard, deleteCard, updateCard } from "@/lib/api/cards";
import api from "@/lib/api/fetcher";

// Normalize MongoDB _id -> id for consistent frontend use
function norm(doc) {
  return { ...doc, id: doc._id ? doc._id.toString() : doc.id };
}

export default function Home() {
  const { status } = useSession();
  const [boards, setBoards] = useState([]);
  const [selectedBoardId, setSelectedBoardId] = useState("");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Auth form state
  const [isSignUp, setIsSignUp] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);

  const handleCredentialsSubmit = async (e) => {
    e.preventDefault();
    setAuthError("");
    setAuthLoading(true);
    try {
      if (isSignUp) {
        const { data } = await api.post("/api/auth/signup", {
          email: authEmail,
          password: authPassword,
          name: authName,
        });
        if (!data?.user) throw new Error("Signup failed");
      }
      const res = await signIn("credentials", {
        email: authEmail,
        password: authPassword,
        redirect: false,
      });
      if (res?.error) setAuthError("Invalid email or password");
    } catch (err) {
      setAuthError(
        err.response?.data?.error || err.message || "Something went wrong",
      );
    } finally {
      setAuthLoading(false);
    }
  };

  const selectedBoard = boards.find((b) => b.id === selectedBoardId);

  const filteredBoard =
    selectedBoard && searchQuery.trim()
      ? {
          ...selectedBoard,
          lists: selectedBoard.lists.map((list) => ({
            ...list,
            cards: list.cards.filter(
              (card) =>
                card.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                card.description
                  ?.toLowerCase()
                  .includes(searchQuery.toLowerCase()),
            ),
          })),
        }
      : selectedBoard;

  // Load all boards -> lists -> cards on mount
  const loadBoards = useCallback(async () => {
    try {
      setLoading(true);
      const rawBoards = await getBoards();

      const populated = await Promise.all(
        rawBoards.map(async (board) => {
          const boardId = board._id?.toString() || board.id;
          const rawLists = await getLists(boardId);

          const listsWithCards = await Promise.all(
            rawLists.map(async (list) => {
              const listId = list._id?.toString() || list.id;
              const rawCards = await getCards(listId);
              return { ...norm(list), cards: rawCards.map(norm) };
            }),
          );

          return { ...norm(board), lists: listsWithCards };
        }),
      );

      setBoards(populated);
      if (populated.length > 0) {
        setSelectedBoardId((prev) => prev || populated[0].id);
      }
    } catch (err) {
      console.error("Failed to load boards:", err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === "authenticated") {
      loadBoards();
    } else if (status !== "loading") {
      setLoading(false);
    }
  }, [status, loadBoards]);

  // Board handlers
  const handleAddBoard = async (boardTitle) => {
    try {
      const raw = await createBoard(boardTitle);
      const newBoard = { ...norm(raw), lists: [] };
      setBoards((prev) => [...prev, newBoard]);
      setSelectedBoardId(newBoard.id);
    } catch (err) {
      console.error("Failed to create board:", err.message);
    }
  };

  const handleDeleteBoard = async (boardId) => {
    try {
      await deleteBoard(boardId);
      setBoards((prev) => {
        const remaining = prev.filter((b) => b.id !== boardId);
        if (boardId === selectedBoardId) {
          setSelectedBoardId(remaining[0]?.id || "");
        }
        return remaining;
      });
    } catch (err) {
      console.error("Failed to delete board:", err.message);
    }
  };

  // List handlers
  const handleAddList = async (listTitle) => {
    try {
      const order = (selectedBoard?.lists?.length ?? 0) + 1;
      const raw = await createList(listTitle, selectedBoardId, order);
      const newList = { ...norm(raw), cards: [] };
      setBoards((prev) =>
        prev.map((b) =>
          b.id !== selectedBoardId ? b : { ...b, lists: [...b.lists, newList] },
        ),
      );
    } catch (err) {
      console.error("Failed to create list:", err.message);
    }
  };

  const handleDeleteList = async (listId) => {
    try {
      await deleteList(listId);
      setBoards((prev) =>
        prev.map((b) =>
          b.id !== selectedBoardId
            ? b
            : { ...b, lists: b.lists.filter((l) => l.id !== listId) },
        ),
      );
    } catch (err) {
      console.error("Failed to delete list:", err.message);
    }
  };

  // Card handlers
  const handleAddCard = async (listId, cardTitle) => {
    try {
      const list = selectedBoard?.lists?.find((l) => l.id === listId);
      const order = (list?.cards?.length ?? 0) + 1;
      const raw = await createCard(cardTitle, listId, order);
      const newCard = norm(raw);
      setBoards((prev) =>
        prev.map((b) =>
          b.id !== selectedBoardId
            ? b
            : {
                ...b,
                lists: b.lists.map((l) =>
                  l.id !== listId ? l : { ...l, cards: [...l.cards, newCard] },
                ),
              },
        ),
      );
    } catch (err) {
      console.error("Failed to create card:", err.message);
    }
  };

  const handleDeleteCard = async (listId, cardId) => {
    try {
      await deleteCard(cardId);
      setBoards((prev) =>
        prev.map((b) =>
          b.id !== selectedBoardId
            ? b
            : {
                ...b,
                lists: b.lists.map((l) =>
                  l.id !== listId
                    ? l
                    : { ...l, cards: l.cards.filter((c) => c.id !== cardId) },
                ),
              },
        ),
      );
    } catch (err) {
      console.error("Failed to delete card:", err.message);
    }
  };

  const handleToggleCardComplete = async (listId, cardId) => {
    // Optimistic update then persist
    let newCompleted;
    setBoards((prev) =>
      prev.map((b) => {
        if (b.id !== selectedBoardId) return b;
        return {
          ...b,
          lists: b.lists.map((l) => {
            if (l.id !== listId) return l;
            return {
              ...l,
              cards: l.cards.map((c) => {
                if (c.id !== cardId) return c;
                return { ...c, completed: newCompleted };
              }),
            };
          }),
        };
      }),
    );
    try {
      await updateCard(cardId, { completed: newCompleted });
    } catch (err) {
      console.error("Failed to update card:", err.message);
      // Revert on failure
      setBoards((prev) =>
        prev.map((b) => {
          if (b.id !== selectedBoardId) return b;
          return {
            ...b,
            lists: b.lists.map((l) => {
              if (l.id !== listId) return l;
              return {
                ...l,
                cards: l.cards.map((c) =>
                  c.id !== cardId ? c : { ...c, completed: !newCompleted },
                ),
              };
            }),
          };
        }),
      );
    }
  };

  // Drag & Drop (client-side reorder only)
  const handleDrop = (dragInfo, targetListId, targetCardId = null) => {
    if (dragInfo.listId) {
      setBoards((prev) =>
        prev.map((b) => {
          if (b.id !== selectedBoardId) return b;
          const lists = [...b.lists];
          const fromIdx = lists.findIndex((l) => l.id === dragInfo.listId);
          const toIdx = lists.findIndex((l) => l.id === targetListId);
          if (fromIdx === -1 || toIdx === -1 || fromIdx === toIdx) return b;
          const [moved] = lists.splice(fromIdx, 1);
          lists.splice(toIdx, 0, moved);
          return { ...b, lists };
        }),
      );
      return;
    }

    const { cardId, fromListId } = dragInfo;

    setBoards((prev) =>
      prev.map((b) => {
        if (b.id !== selectedBoardId) return b;

        const fromList = b.lists.find((l) => l.id === fromListId);

        const card = fromList.cards.find((c) => c.id === cardId);

        let newLists = b.lists.map((l) =>
          l.id !== fromListId
            ? l
            : { ...l, cards: l.cards.filter((c) => c.id !== cardId) },
        );

        newLists = newLists.map((l) => {
          if (l.id !== targetListId) return l;
          const cards = [...l.cards];
          if (targetCardId) {
            const idx = cards.findIndex((c) => c.id === targetCardId);
            cards.splice(idx !== -1 ? idx : cards.length, 0, card);
          } else {
            cards.push(card);
          }
          return { ...l, cards };
        });

        return { ...b, lists: newLists };
      }),
    );
  };

  // Render
  if (status === "loading" || loading) {
    return (
      <div
        className="flex h-screen items-center justify-center"
        style={{
          backgroundColor: "var(--background)",
          color: "var(--foreground)",
        }}
      >
        <span>Loading…</span>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div
        className="flex h-screen items-center justify-center"
        style={{
          backgroundColor: "var(--background)",
          color: "var(--foreground)",
        }}
      >
        <div
          className="w-full max-w-sm rounded-xl border p-8 shadow-lg"
          style={{
            backgroundColor: "var(--card)",
            borderColor: "var(--border)",
          }}
        >
          <h1 className="mb-1 text-2xl font-semibold text-center">TaskFlow</h1>
          <p
            className="mb-6 text-sm text-center"
            style={{ color: "var(--muted-foreground)" }}
          >
            {isSignUp ? "Create a new account" : "Sign in to your account"}
          </p>

          <form
            onSubmit={handleCredentialsSubmit}
            className="flex flex-col gap-3"
          >
            {isSignUp && (
              <input
                type="text"
                placeholder="Name"
                value={authName}
                onChange={(e) => setAuthName(e.target.value)}
                required
                className="rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
                style={{
                  backgroundColor: "var(--input)",
                  borderColor: "var(--border)",
                  color: "var(--foreground)",
                }}
              />
            )}
            <input
              type="email"
              placeholder="Email"
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
              required
              className="rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
              style={{
                backgroundColor: "var(--input)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            />
            <input
              type="password"
              placeholder="Password"
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
              required
              className="rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-2"
              style={{
                backgroundColor: "var(--input)",
                borderColor: "var(--border)",
                color: "var(--foreground)",
              }}
            />

            {authError && (
              <p className="text-sm" style={{ color: "var(--destructive)" }}>
                {authError}
              </p>
            )}

            <button
              type="submit"
              disabled={authLoading}
              className="rounded-lg py-2 text-sm font-medium transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{
                backgroundColor: "var(--primary)",
                color: "var(--primary-foreground)",
              }}
            >
              {authLoading
                ? "Please wait…"
                : isSignUp
                  ? "Create account"
                  : "Sign in"}
            </button>
          </form>

          <div className="my-4 flex items-center gap-2">
            <div
              className="flex-1 border-t"
              style={{ borderColor: "var(--border)" }}
            />
            <span
              className="text-xs"
              style={{ color: "var(--muted-foreground)" }}
            >
              or
            </span>
            <div
              className="flex-1 border-t"
              style={{ borderColor: "var(--border)" }}
            />
          </div>

          <button
            onClick={() => signIn("google")}
            className="w-full rounded-lg border py-2 text-sm font-medium transition-opacity hover:opacity-80"
            style={{
              borderColor: "var(--border)",
              backgroundColor: "var(--secondary)",
              color: "var(--secondary-foreground)",
            }}
          >
            Continue with Google
          </button>

          <p
            className="mt-4 text-center text-xs"
            style={{ color: "var(--muted-foreground)" }}
          >
            {isSignUp ? "Already have an account? " : "Don't have an account? "}
            <button
              onClick={() => {
                setIsSignUp((v) => !v);
                setAuthError("");
              }}
              className="underline"
              style={{ color: "var(--primary)" }}
            >
              {isSignUp ? "Sign in" : "Sign up"}
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden">
      <Navbar searchQuery={searchQuery} onSearchChange={setSearchQuery} />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          boards={boards}
          selectedBoardId={selectedBoardId}
          onSelectBoard={setSelectedBoardId}
          onDeleteBoard={handleDeleteBoard}
          onAddBoard={handleAddBoard}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed((v) => !v)}
        />

        <main className="flex-1 overflow-hidden bg-[var(--background)]">
          {selectedBoard && (
            <div className="flex h-12 items-center border-b px-6 border-[var(--border)]">
              <h1 className="text-lg font-semibold text-[var(--foreground)]">
                {selectedBoard.title}
              </h1>
            </div>
          )}

          <div className={selectedBoard ? "h-[calc(100%-3rem)]" : "h-full"}>
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
  );
}
