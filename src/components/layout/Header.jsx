import { useGetCurrentUser } from '../../hooks/InventoryHooks';

export default function Header({ onMenuToggle }) {
  const { data: user } = useGetCurrentUser();

  const initials = user?.username
    ? user.username.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-surface-default border-b border-border-default shadow-sm">
      {/* Left side: Hamburger (mobile) & Search */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuToggle}
          className="p-1.5 -ml-1 text-text-muted hover:text-text-primary rounded-lg hover:bg-surface-muted lg:hidden"
          aria-label="Open sidebar"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        {/* Global Quick Search */}
        <div className="relative hidden sm:block w-72">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-text-muted">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </span>
          <input
            type="search"
            placeholder="Search stock, batches, products..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-surface-elevated border border-border-default rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all placeholder:text-text-muted"
          />
        </div>
      </div>

      {/* Right side: Alerts, Notifications, Profile */}
      <div className="flex items-center gap-4">
        {/* Notifications / Stock alerts */}
        <button
          className="relative p-2 text-text-muted hover:text-text-primary rounded-lg hover:bg-surface-muted transition-colors"
          aria-label="View notifications"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-state-danger-main opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-state-danger-main"></span>
          </span>
        </button>

        <div className="h-6 w-px bg-border-default" />

        {/* User info */}
        <div className="flex items-center gap-2">
          <div className="text-right hidden sm:block">
            <div className="text-xs font-semibold text-text-primary">{user?.username || 'Loading...'}</div>
            <div className="text-[10px] text-text-muted font-medium capitalize">{user?.userRole || ''}</div>
          </div>
          <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white text-xs font-bold shadow-sm">
            {initials}
          </div>
        </div>
      </div>
    </header>
  );
}
