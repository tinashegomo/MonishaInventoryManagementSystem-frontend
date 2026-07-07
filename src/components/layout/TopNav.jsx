import { useNavigate } from 'react-router-dom';
import { NavLink } from 'react-router-dom';
import { LogOut, ChevronDown } from 'lucide-react';
import { PRIMARY_LINKS, DROPDOWN_LINKS } from './NavLinks';
import { useGetCurrentUser } from '../../hooks/InventoryHooks';
import { removeToken } from '../../utils/tokenUtils';

/**
 * TopNav — desktop navigation bar (hidden on mobile).
 *
 * Uses the native HTML5 Popover API for the user profile dropdown.
 * The browser manages open/close behavior — no React state needed.
 *
 * Popover pattern:
 *   - Trigger button: `popovertarget="user-menu"` (opens/closes the popover)
 *   - Dropdown div: `id="user-menu" popover="auto"` (browser manages visibility)
 *   - Light-dismiss: clicking outside or pressing ESC closes it automatically
 *
 * When navigating away via a link, we manually close the popover to prevent
 * it from staying open on the next page.
 */
export default function TopNav() {

  const { data: user } = useGetCurrentUser();
  const navigate = useNavigate();

  // ─── Helpers ────────────────────────────────────────────────

  // Extract up to 2 uppercase initials from the user's name.
  // "Tinashe Gomo" → "TG", "Admin" → "A", null → "U"
  const getInitials = (name) => {
    if (!name) return 'U';
    const words = name.split(' ');
    const firstLetters = words.map(w => w[0]);
    const joined = firstLetters.join('');
    const uppercased = joined.toUpperCase();
    return uppercased.slice(0, 2);
  };

  const initials = getInitials(user?.userName);

  // Capitalize the first letter of the role: "ADMIN" → "Admin"
  const formatRole = (role) => {
    if (!role) return 'User';
    const lower = role.toLowerCase();
    const capitalized = lower.charAt(0).toUpperCase();
    const rest = lower.slice(1);
    return capitalized + rest;
  };

  const formattedRole = formatRole(user?.userRole);

  // ─── Handlers ───────────────────────────────────────────────

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  // Close the popover before navigating, otherwise it stays open on the new page.
  const handleNavigate = (path) => {
    document.getElementById('user-menu')?.hidePopover();
    navigate(path);
  };

  // ─── Render ─────────────────────────────────────────────────

  return (
    <header className="hidden lg:flex items-center h-14 px-6 md:px-8 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80 shadow-sm sticky top-0 z-40">

      {/* Left: Brand */}
      <div className="flex items-center gap-2 min-w-[160px]">
        <span className="text-xl md:text-2xl font-bold text-gray-900 leading-none">Monisha</span>
        <span className="text-sm font-medium text-gray-500 tracking-wider">IMS</span>
      </div>

      {/* Center: Primary Nav Links */}
      <nav className="flex-1 flex items-center justify-center gap-2">
        {PRIMARY_LINKS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-2 px-5 py-2.5 rounded-full text-base font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
              }`
            }
          >
            {item.icon}
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Right: User Profile Dropdown (Popover) */}
      <div className="min-w-[180px] flex justify-end">
        <div className="relative">

          {/* Trigger: clicking this opens/closes the popover. */}
          {/* The browser handles aria-expanded and focus management. */}
          <button
            popovertarget="user-menu"
            className="flex items-center gap-2.5 p-1 pl-1 pr-3 rounded-full transition-colors hover:bg-gray-100 press-scale"
            aria-label="User menu"
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center text-white font-bold text-sm shrink-0">
              {initials}
            </div>
            <span className="text-base font-medium text-gray-900 hidden xl:block">{user?.userName || 'User'}</span>
            <ChevronDown className="w-5 h-5 text-gray-500" />
          </button>

          {/* Dropdown: the browser shows/hides this when the trigger is clicked. */}
          {/* `popover="auto"` enables light-dismiss (click outside closes). */}
          <div
            id="user-menu"
            popover="auto"
            className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden outline-none"
          >
            {/* User info header */}
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-semibold text-gray-900 m-0">{user?.userName || 'User'}</p>
              <p className="text-xs text-gray-500 m-0">{formattedRole}</p>
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
      </div>
    </header>
  );
}
