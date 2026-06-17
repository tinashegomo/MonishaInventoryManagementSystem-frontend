import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetCurrentUser } from '../../hooks/InventoryHooks';
import { removeToken } from '../../utils/tokenUtils';

export default function Profile() {
  const { data: user, isLoading, isError } = useGetCurrentUser();
  const navigate = useNavigate();

  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>
        <div className="glass-panel p-6 rounded-xl min-h-[400px] flex items-center justify-center">
          <span className="text-text-muted">Loading profile...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>
        <div className="glass-panel p-6 rounded-xl min-h-[400px] flex items-center justify-center">
          <span className="text-state-danger-main">Failed to load profile.</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>

      <div className="grid gap-6 max-w-2xl">
        {/* User Info Card */}
        <div className="glass-panel p-6 rounded-xl">
          <h2 className="text-lg font-semibold mb-4">Account Details</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-brand-primary flex items-center justify-center">
                <span className="text-2xl font-bold text-white">
                  {user?.username?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
              <div>
                <p className="text-lg font-semibold">{user?.username || 'Unknown'}</p>
                <p className="text-sm text-text-muted capitalize">{user?.userRole || 'user'}</p>
              </div>
            </div>

            <div className="border-t border-border-default pt-4 space-y-3">
              <div>
                <label className="text-xs font-medium text-text-muted uppercase tracking-wide">Username</label>
                <p className="text-text-primary mt-1">{user?.username || '—'}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-text-muted uppercase tracking-wide">Email</label>
                <p className="text-text-primary mt-1">{user?.email || '—'}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-text-muted uppercase tracking-wide">Phone</label>
                <p className="text-text-primary mt-1">{user?.phoneNumber || '—'}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-text-muted uppercase tracking-wide">Role</label>
                <p className="text-text-primary mt-1 capitalize">{user?.userRole || '—'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Theme Toggle Card */}
        <div className="glass-panel p-6 rounded-xl">
          <h2 className="text-lg font-semibold mb-4">Appearance</h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-text-primary font-medium">Dark Mode</p>
              <p className="text-sm text-text-muted">
                {isDark ? 'Currently using dark theme' : 'Currently using light theme'}
              </p>
            </div>
            <button
              onClick={() => setIsDark(!isDark)}
              className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
                isDark ? 'bg-brand-primary' : 'bg-neutral-300'
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform ${
                  isDark ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>

        {/* Logout Card */}
        <div className="glass-panel p-6 rounded-xl">
          <h2 className="text-lg font-semibold mb-4">Session</h2>
          <button
            onClick={handleLogout}
            className="rounded-lg bg-state-danger-main px-4 py-2.5 text-sm font-semibold text-white hover:bg-state-danger-hover active:bg-state-danger-pressed transition-colors"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
