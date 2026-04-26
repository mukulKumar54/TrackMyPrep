import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  RiDashboardLine, RiTaskLine, RiBuildingLine,
  RiRobot2Line, RiLogoutBoxLine, RiUser3Line,
} from 'react-icons/ri';

const navItems = [
  { to: '/',        label: 'Dashboard',  icon: RiDashboardLine, color: 'text-blue-500',   bg: 'bg-blue-50' },
  { to: '/tasks',   label: 'Tasks',      icon: RiTaskLine,      color: 'text-indigo-500', bg: 'bg-indigo-50' },
  { to: '/tracker', label: 'Interviews', icon: RiBuildingLine,  color: 'text-violet-500', bg: 'bg-violet-50' },
  { to: '/ai',      label: 'AI Coach',   icon: RiRobot2Line,    color: 'text-sky-500',    bg: 'bg-sky-50' },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <aside className="fixed left-0 top-0 h-screen w-60 flex flex-col z-40 border-r border-slate-100"
      style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}>

      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)', boxShadow: '0 4px 12px rgba(59,130,246,0.3)' }}>
            <span className="text-white font-black text-sm">T</span>
          </div>
          <div>
            <h1 className="text-slate-800 font-bold text-sm leading-none">TrackMyPrep</h1>
            <p className="text-slate-400 text-xs mt-0.5">Interview Dashboard</p>
          </div>
        </div>
      </div>

      {/* Nav label */}
      <div className="px-5 pt-5 pb-2">
        <p className="text-xs font-semibold text-slate-300 uppercase tracking-widest">Menu</p>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon, color, bg }) => (
          <NavLink key={to} to={to} end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-gradient-to-r from-brand-50 to-sky-50 text-brand-700 border border-brand-100 shadow-soft'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-200 ${
                  isActive ? `${bg} ${color}` : 'bg-slate-50 text-slate-400 group-hover:bg-slate-100'
                }`}>
                  <Icon className="text-base" />
                </span>
                {label}
                {isActive && (
                  <span className="ml-auto w-1.5 h-4 rounded-full bg-brand-400 flex-shrink-0" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom section */}
      <div className="p-3 border-t border-slate-100 space-y-1">
        {/* User card */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-brand-50 to-sky-50 border border-brand-100 mb-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}>
            <RiUser3Line className="text-white text-sm" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-slate-700 text-xs font-semibold truncate">{user?.name}</p>
            <p className="text-slate-400 text-xs truncate">{user?.email}</p>
          </div>
        </div>
        <button onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                     text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200">
          <span className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center group-hover:bg-red-50">
            <RiLogoutBoxLine className="text-base" />
          </span>
          Sign Out
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
