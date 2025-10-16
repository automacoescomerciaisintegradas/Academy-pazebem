import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/lib/authStore';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BackgroundParticles from '@/components/BackgroundParticles';
import { Shield } from 'lucide-react';
export default function LoginPage() {
  const { login, isAuthenticated, user } = useAuthStore();
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated) {
      if (user?.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [isAuthenticated, user, navigate]);
  return (
    <div className="flex flex-col min-h-screen bg-dark-primary text-foreground">
      <Header />
      <main className="flex-grow flex items-center justify-center relative">
        <BackgroundParticles />
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="glass-card w-full max-w-md p-8 rounded-2xl shadow-lg text-center"
        >
          <h1 className="text-3xl font-bold font-display mb-2">Bem-vindo de volta!</h1>
          <p className="text-foreground/70 mb-8">Escolha um método para continuar.</p>
          <div className="space-y-4">
            <Button
              onClick={() => login('google')}
              className="w-full h-12 text-lg bg-white/10 hover:bg-white/20"
            >
              <span className="mr-2 font-bold">G</span> Continuar com Google
            </Button>
            <Button
              onClick={() => login('github')}
              className="w-full h-12 text-lg bg-white/10 hover:bg-white/20"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.168 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.03 1.595 1.03 2.688 0 3.848-2.338 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z" clipRule="evenodd" /></svg>
              Continuar com GitHub
            </Button>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-dark-primary px-2 text-muted-foreground">
                  Ou
                </span>
              </div>
            </div>
            <Button
              onClick={() => login('admin')}
              variant="outline"
              className="w-full h-12 text-lg border-gold-accent/50 hover:bg-gold-accent/10 hover:text-gold-accent"
            >
              <Shield className="mr-2 h-5 w-5" /> Login como Admin (Demo)
            </Button>
          </div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}