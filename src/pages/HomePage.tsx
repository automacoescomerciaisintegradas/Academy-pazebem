import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, BookOpen, Users, Award, Cloud, Bot, Database, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BackgroundParticles from '@/components/BackgroundParticles';
import InfiniteCarousel from '@/components/InfiniteCarousel';
const featureCards = [
  {
    icon: BookOpen,
    title: 'Cursos Abrangentes',
    description: 'Explore uma vasta gama de cursos, do básico ao avançado, em teologia, filosofia e mais.',
  },
  {
    icon: Users,
    title: 'Comunidade Ativa',
    description: 'Junte-se a uma comunidade de estudantes e professores apaixonados pelo conhecimento e pela fé.',
  },
  {
    icon: Award,
    title: 'Certificação Reconhecida',
    description: 'Receba certificados ao concluir os cursos e fortaleça sua jornada acadêmica e espiritual.',
  },
];
const techLogos = [
  { icon: Cloud, name: 'Cloudflare' },
  { icon: Bot, name: 'AI' },
  { icon: Database, name: 'Durable Objects' },
  { icon: Code, name: 'Hono' },
  { icon: Users, name: 'Workers' },
];
export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen bg-dark-primary text-foreground">
      <Header />
      <main className="flex-grow">
        <section className="relative overflow-hidden">
          <BackgroundParticles />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32 lg:py-40 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold font-display tracking-tight">
                Desperte sua Sabedoria na{' '}
                <span className="text-gradient-green">Paz & Bem Academy</span>
              </h1>
              <p className="mt-6 text-lg md:text-xl max-w-3xl mx-auto text-foreground/80">
                Sua jornada de conhecimento e espiritualidade começa aqui. Cursos online para transformar sua mente e seu espírito.
              </p>
              <div className="mt-10 flex justify-center gap-4">
                <Button asChild size="lg" className="bg-neon-green text-dark-primary font-bold hover:bg-neon-green/90 text-lg px-8 py-6 rounded-full transition-transform hover:scale-105">
                  <Link to="/cursos">
                    Explorar Cursos <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
        <div className="bg-section-separator-gradient">
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-display">Por que escolher a Paz & Bem?</h2>
              <p className="mt-4 text-lg text-foreground/70">
                Oferecemos uma plataforma completa para seu desenvolvimento.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {featureCards.map((card, index) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="glass-card p-8 rounded-2xl text-center flex flex-col items-center"
                >
                  <div className="bg-neon-green/10 p-4 rounded-full mb-6">
                    <card.icon className="h-10 w-10 text-neon-green" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{card.title}</h3>
                  <p className="text-foreground/80 flex-grow">{card.description}</p>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
        <section className="bg-dark-primary py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold font-display">Tecnologias e Parceiros</h2>
              <p className="mt-4 text-lg text-foreground/70">
                Construído com as melhores ferramentas para uma experiência de ponta.
              </p>
            </div>
            <InfiniteCarousel>
              {[...techLogos, ...techLogos].map((logo, index) => (
                <div key={index} className="flex flex-col items-center justify-center h-24 w-40 text-foreground/60">
                  <logo.icon className="h-10 w-10" />
                  <span className="mt-2 text-sm font-medium">{logo.name}</span>
                </div>
              ))}
            </InfiniteCarousel>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}