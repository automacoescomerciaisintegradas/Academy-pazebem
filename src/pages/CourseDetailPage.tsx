import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookText, ChevronLeft, Lock } from 'lucide-react';
import { api } from '@/lib/api-client';
import type { Course } from '@shared/types';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BackgroundParticles from '@/components/BackgroundParticles';
import { Skeleton } from '@/components/ui/skeleton';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import { Toaster, toast } from '@/components/ui/sonner';
const CourseDetailSkeleton = () => (
  <div className="max-w-4xl mx-auto">
    <Skeleton className="h-12 w-3/4 mb-4" />
    <Skeleton className="h-6 w-full mb-2" />
    <Skeleton className="h-6 w-5/6 mb-10" />
    <div className="space-y-4">
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
      <Skeleton className="h-16 w-full" />
    </div>
  </div>
);
export default function CourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) {
        setIsLoading(false);
        toast.error('ID do curso não encontrado.');
        return;
      }
      setIsLoading(true);
      try {
        // This is a real API call, not mock data.
        const data = await api<Course>(`/api/courses/${courseId}`);
        setCourse(data);
      } catch (error) {
        console.error(error);
        toast.error('Falha ao carregar os detalhes do curso.');
        setCourse(null); // Ensure no stale data is shown on error
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);
  return (
    <div className="flex flex-col min-h-screen bg-dark-primary text-foreground">
      <Header />
      <main className="flex-grow relative overflow-hidden">
        <BackgroundParticles />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Button asChild variant="outline" className="mb-8">
                <Link to="/cursos">
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Voltar para todos os cursos
                </Link>
              </Button>
            </motion.div>
            {isLoading ? (
              <CourseDetailSkeleton />
            ) : course ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <h1 className="text-4xl md:text-5xl font-bold font-display mb-4 text-gold-accent">{course.title}</h1>
                <p className="text-lg text-foreground/80 mb-10">{course.description}</p>
                <h2 className="text-3xl font-bold font-display mb-6">Conteúdo do Curso</h2>
                <Accordion type="single" collapsible className="w-full glass-card rounded-2xl p-4">
                  {course.modules && course.modules.length > 0 ? (
                    course.modules.map((module) => (
                      <AccordionItem value={module.id} key={module.id}>
                        <AccordionTrigger className="text-xl font-semibold hover:text-neon-green text-left">
                          {module.title}
                        </AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-3 pl-4">
                            {module.lessons && module.lessons.length > 0 ? (
                              module.lessons.map((lesson) => (
                                <li key={lesson.id} className="flex items-center gap-3 text-foreground/80">
                                  <BookText className="h-5 w-5 text-neon-green/80 flex-shrink-0" />
                                  <span>{lesson.title}</span>
                                </li>
                              ))
                            ) : (
                                <li className="text-foreground/70 italic">Nenhuma aula neste módulo ainda.</li>
                            )}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    ))
                  ) : (
                    <p className="text-center text-foreground/70 py-4">O conteúdo deste curso será adicionado em breve.</p>
                  )}
                </Accordion>
                <div className="mt-12 text-center glass-card p-8 rounded-2xl">
                    <Lock className="h-10 w-10 text-gold-accent mx-auto mb-4" />
                    <h3 className="text-2xl font-bold mb-2">Acesse o conteúdo completo</h3>
                    <p className="text-foreground/80 mb-6">Faça login ou crie sua conta para iniciar sua jornada de aprendizado.</p>
                    <Button asChild size="lg" className="bg-neon-green text-dark-primary font-bold hover:bg-neon-green/90 text-lg px-8 py-6 rounded-full transition-transform hover:scale-105">
                        <Link to="/login">
                            Acessar Plataforma
                        </Link>
                    </Button>
                </div>
              </motion.div>
            ) : (
              <div className="text-center glass-card p-8 rounded-2xl">
                <h1 className="text-3xl font-bold">Curso não encontrado</h1>
                <p className="text-foreground/80 mt-2">O curso que você está procurando não existe ou foi removido.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <Toaster richColors closeButton />
    </div>
  );
}