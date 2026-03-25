import { LayoutGrid, Bell, Search, X } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/Button'

export function Navbar({ searchQuery, onSearchChange }) {
  return (
    <header className="flex h-14 items-center justify-between border-b px-4"
      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--sidebar)' }}>
      
      {/* Logo */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg"
            style={{ backgroundColor: 'var(--primary)' }}>
            <LayoutGrid className="h-4 w-4" style={{ color: 'var(--primary-foreground)' }} />
          </div>
          <span className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
            TaskFlow
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="relative w-full max-w-md">
          <Search
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2"
            style={{ color: 'var(--muted-foreground)' }}
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search cards..."
            className="w-full rounded-lg border py-2 pl-10 pr-10 text-sm focus:outline-none focus:ring-2"
            style={{
              borderColor: 'var(--border)',
              backgroundColor: 'var(--input)',
              color: 'var(--foreground)',
            }}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon-sm"
              className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
              onClick={() => onSearchChange('')}
              style={{ color: 'var(--muted-foreground)' }}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          style={{ color: 'var(--muted-foreground)' }}
        >
          <Bell className="h-4 w-4" />
          <span className="sr-only">Notifications</span>
        </Button>
        <Avatar className="h-8 w-8 cursor-pointer">
          <AvatarImage
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=user"
            alt="User avatar"
          />
          <AvatarFallback style={{ backgroundColor: 'var(--secondary)', color: 'var(--secondary-foreground)' }}>
            U
          </AvatarFallback>
        </Avatar>
      </div>
    </header>
  )
}
