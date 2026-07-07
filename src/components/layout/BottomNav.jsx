import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { PRIMARY_LINKS, DROPDOWN_LINKS } from './NavLinks';
import { useGetCurrentUser } from '../../hooks/InventoryHooks';
import { removeToken } from '../../utils/tokenUtils';

/**
 * BottomNav — mobile navigation bar (visible only on small screens).
 *
 * Uses the native HTML5 Popover API for the profile dropdown.
 * No React state, no onBlur hack, no invisible backdrop div.
 *
 * Popover pattern:
 *   - Trigger: `popovertarget="mobile-profile-menu"`
 *   - Menu: `id="mobile-profile-menu" popover="auto"`
 *   - Light-dismiss: tapping outside closes the menu automatically
 *   - The popover renders in the top layer, so it's immune to
 *     overflow clipping from the bottom nav's position: fixed
 */
export default function BottomNav() {

  const { data: user } = useGetCurrentUser();
  const navigate = useNavigate();

  // ─── Helpers ────────────────────────────────────────────────

  // Extract up to 2 uppercase initials from the user's name.
  const getInitials = (name) => {
    if (!name) return 'U';
    const words = name.split(' ');
    const firstLetters = words.map(w => w[0]);
    const joined = firstLetters.join('');
    const uppercased = joined.toUpperCase();
    return uppercased.slice(0, 2);
  };

  const initials = getInitials(user?.userName);

  // ─── Handlers ───────────────────────────────────────────────

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  // Close the popover before navigating to prevent stale open state.
  const handleNavigate = (path) => {
    document.getElementById('mobile-profile-menu')?.hidePopover();
    navigate(path);
  };

  // ─── Render ─────────────────────────────────────────────────

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-[0_-1px_3px_rgba(0,0,0,0.05)] flex items-center justify-around px-2 z-50 lg:hidden">

      {/* Primary Links */}
      {PRIMARY_LINKS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-0.5 w-14 py-1 rounded-lg transition-colors ${
              isActive
                ? 'text-red-600'
                : 'text-gray-500 hover:text-gray-900'
            }`
          }
        >
          {item.icon}
          <span className="text-[10px] font-medium leading-tight">{item.label.split(' ')[0]}</span>
        </NavLink>
      ))}

      {/* Profile Dropdown (Popover) */}
      <div className="relative">

        {/* Trigger: avatar + "More" label. Click toggles the popover. */}
        <button
          popovertarget="mobile-profile-menu"
          className="flex flex-col items-center justify-center gap-0.5 w-14 py-1 rounded-lg transition-colors text-gray-500 hover:text-gray-900"
          aria-label="Profile menu"
        >
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white font-bold text-[9px]">
            {initials}
          </div>
          <span className="text-[10px] font-medium leading-tight">More</span>
        </button>

        {/* Dropdown menu — positioned above the bottom nav */}
        {/* `popover="auto"` enables light-dismiss and top-layer rendering. */}
        <div
          id="mobile-profile-menu"
          popover="auto"
          className="absolute bottom-full right-0 mb-2 w-52 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden outline-none"
        >
          {/* User info header */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-900 m-0">{user?.userName || 'User'}</p>
            <p className="text-xs text-gray-500 m-0">{user?.userRole || 'user'}</p>
          </div>

          {/* Navigation links */}
          <div className="py-1">
            {DROPDOWN_LINKS.filter((item) => !item.adminOnly || user?.userRole === "ADMIN").map((item) => (
              <button
                key={item.to}
                onClick={() => handleNavigate(item.to)}
                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>

          {/* Sign Out */}
          <div className="border-t border-gray-100 py-1">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>

      </div>
    </nav>
  );
}
