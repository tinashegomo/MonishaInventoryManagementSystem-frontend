import { useNavigate } from 'react-router-dom';
import { NAV_LINKS } from './NavLinks';
import { NavLink } from 'react-router-dom';
import { useGetCurrentUser } from '../../hooks/InventoryHooks';
import { removeToken } from '../../utils/tokenUtils';

export default function Sidebar({ isOpen, onClose }) {
  const { data: user } = useGetCurrentUser();
  const navigate = useNavigate();

  const initials = user?.username
    ? user.username.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden transition-opacity duration-300"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col w-72 bg-slate-900 text-slate-300 border-r border-slate-800 transition-transform duration-300 lg:translate-x-0 lg:static lg:h-screen ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand / Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800">
          <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-600 text-white shadow-md shadow-brand-500/20">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v18M12 3C9 5.5 5 6.5 5 10c0 4.5 4 6 7 11M12 3c3 2.5 7 3.5 7 7 0 4.5-4 6-7 11" />
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white m-0 leading-tight">Monisha</h1>
            <p className="text-[10px] text-slate-400 font-medium tracking-widest uppercase">Inventory System</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 ml-auto text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 lg:hidden"
            aria-label="Close sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* User Profile Summary */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/30">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-brand-primary flex items-center justify-center text-white font-bold">
                {initials}
              </div>
              <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-400 ring-2 ring-slate-900" />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-sm font-semibold text-white truncate m-0">{user?.username || 'Loading...'}</h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-brand-primary/20 text-brand-300 border border-brand-primary/30 uppercase">
                  {user?.userRole || 'user'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {NAV_LINKS.map((item) => {
            if (item.isFuture) {
              return (
                <div
                  key={item.to}
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg text-slate-500 cursor-not-allowed select-none group"
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span className="text-sm font-medium">{item.label}</span>
                  </div>
                  <span className="text-[9px] font-semibold tracking-wider text-slate-600 bg-slate-800 px-1.5 py-0.5 rounded uppercase">
                    Soon
                  </span>
                </div>
              );
            }

            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2.5 rounded-lg transition-all duration-200 group ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-600/10'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`
                }
              >
                <div className="flex items-center gap-3">
                  {item.icon}
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[9px] font-semibold tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 px-1.5 py-0.5 rounded uppercase">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer — Logout */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/20">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-slate-400 hover:text-white hover:bg-red-500/10 transition-all duration-200 group"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            <span className="text-sm font-medium">Log Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
