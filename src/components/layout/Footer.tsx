import { Link } from 'react-router-dom';
import { GraduationCap, Instagram, Youtube, Twitter, MessageSquare } from 'lucide-react';
const socialLinks = [
  { icon: Instagram, href: '#', name: 'Instagram' },
  { icon: Youtube, href: '#', name: 'YouTube' },
  { icon: Twitter, href: '#', name: 'X' },
  { icon: MessageSquare, href: '#', name: 'WhatsApp' },
];
export default function Footer() {
  return (
    <footer className="bg-dark-secondary text-foreground/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <GraduationCap className="h-8 w-8 text-neon-green" />
              <span className="text-xl font-bold font-display text-foreground">
                Paz & Bem Academy
              </span>
            </Link>
            <p className="text-sm">
              Transformando conhecimento em sabedoria para um mundo melhor.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Navegação</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-neon-green transition-colors">Início</Link></li>
              <li><Link to="/cursos" className="hover:text-neon-green transition-colors">Cursos</Link></li>
              <li><Link to="/login" className="hover:text-neon-green transition-colors">Login</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-2">
              <li><a href="#" className="hover:text-neon-green transition-colors">Termos de Serviço</a></li>
              <li><a href="#" className="hover:text-neon-green transition-colors">Política de Privacidade</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4">Siga-nos</h3>
            <div className="flex space-x-4">
              {socialLinks.map((social) => (
                <a key={social.name} href={social.href} className="text-foreground/70 hover:text-neon-green transition-colors">
                  <social.icon className="h-6 w-6" />
                  <span className="sr-only">{social.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 border-t border-border/50 pt-8 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Paz & Bem Academy. Todos os direitos reservados.</p>
          <p className="mt-2">Built with ❤️ at Cloudflare</p>
        </div>
      </div>
    </footer>
  );
}