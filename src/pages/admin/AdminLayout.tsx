import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Book, Users, UserPlus, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';
const sidebarNavItems = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Gerenciar Cursos", href: "/admin/gerenciar-cursos", icon: Book },
  { title: "Gerenciar Acessos", href: "/admin/gerenciar-acessos", icon: Users },
  { title: "Convidar Usuários", href: "/admin/convidar-usuarios", icon: UserPlus },
];
export default function AdminLayout() {
  const location = useLocation();
  return (
    <div className="flex min-h-screen bg-dark-secondary text-foreground">
      <aside className="w-64 flex-shrink-0 border-r border-border/50 bg-dark-primary p-4">
        <div className="flex items-center gap-2 mb-8">
          <GraduationCap className="h-8 w-8 text-neon-green" />
          <span className="text-xl font-bold font-display">Admin Panel</span>
        </div>
        <nav className="space-y-2">
          {sidebarNavItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:bg-neon-green/10 hover:text-neon-green",
                (location.pathname === item.href || (item.href !== '/admin' && location.pathname.startsWith(item.href))) 
                  ? "bg-neon-green/10 text-neon-green" 
                  : "text-foreground/80"
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.title}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-8 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}