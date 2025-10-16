import { Link, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GraduationCap, LogIn, User, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/authStore';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
export default function Header() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    cn(
      "relative text-lg font-medium transition-colors hover:text-neon-green",
      isActive ? "text-neon-green" : "text-foreground/80"
    );
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-4 z-50 mx-auto max-w-7xl"
    >
      <div className="glass-card flex items-center justify-between rounded-2xl p-4 shadow-lg">
        <Link to="/" className="flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-neon-green" />
          <span className="text-2xl font-bold font-display text-foreground">
            Paz & Bem <span className="text-gold-accent">Academy</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-8 md:flex">
          <NavLink to="/" className={navLinkClasses}>
            Início
          </NavLink>
          <NavLink to="/cursos" className={navLinkClasses}>
            Cursos
          </NavLink>
        </nav>
        <div className="flex items-center gap-4">
          {isAuthenticated && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/dashboard"><User className="mr-2 h-4 w-4" />Painel</Link>
                </DropdownMenuItem>
                {user.role === 'admin' && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin"><Shield className="mr-2 h-4 w-4" />Admin</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild className="group relative inline-flex h-12 items-center justify-center overflow-hidden rounded-md bg-dark-secondary px-6 font-medium text-neutral-200 transition-all duration-300 hover:bg-dark-primary hover:ring-2 hover:ring-neon-green hover:ring-offset-2 hover:ring-offset-dark-primary">
              <Link to="/login">
                <LogIn className="mr-2 h-5 w-5" />
                Login
              </Link>
            </Button>
          )}
        </div>
      </div>
    </motion.header>
  );
}