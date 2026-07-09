import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Calculator,
  FileText,
  Users,
  Settings,
  LogOut,
} from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import logo from '../../assets/logo.jpg';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/cotizador', label: 'Cotizador', icon: Calculator },
  { to: '/clientes', label: 'Clientes', icon: Users },
  { to: '/cotizaciones', label: 'Cotizaciones', icon: FileText },
];

export function Sidebar() {
  const { logout, isAdmin, usuario } = useAuth();

  return (
    <aside className="w-64 min-h-screen bg-card border-r border-slate-700/50 flex flex-col">
      <div className="bg-background p-6 border-b border-slate-700/50">
        <img src={logo} alt="Freelance Estimator" className="w-full" />
        {usuario && (
          <p className="text-primary text-base font-semibold mt-3 truncate">
            {usuario.nombre} {usuario.apellido}
          </p>
        )}
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive
                  ? 'bg-primary/20 text-primary'
                  : 'text-muted hover:text-foreground hover:bg-background'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}

        {isAdmin && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive
                  ? 'bg-primary/20 text-primary'
                  : 'text-muted hover:text-foreground hover:bg-background'
              }`
            }
          >
            <Settings size={18} />
            Admin
          </NavLink>
        )}
      </nav>

      <div className="p-4 border-t border-slate-700/50">
        <button
          onClick={() => logout()}
          className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-muted hover:text-danger hover:bg-background transition w-full"
        >
          <LogOut size={18} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
