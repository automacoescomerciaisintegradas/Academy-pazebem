import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import BackgroundParticles from '@/components/BackgroundParticles';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowRight } from 'lucide-react';
import { api } from '@/lib/api-client';
import type { Course } from '@shared/types';
import { Toaster, toast } from '@/components/ui/sonner';
const CourseCardSkeleton = () => (
  <Card className="glass-card h-full flex flex-col rounded-2xl overflow-hidden">
    <CardHeader>
      <Skeleton className="h-7 w-3/4" />
    </CardHeader>
    <CardContent className="flex-grow space-y-2">
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
    </CardContent>
    <CardFooter>
      <Skeleton className="h-10 w-full" />
    </CardFooter>
  </Card>
);
export default function CursosPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchCourses = async () => {
      setIsLoading(true);
      try {
        const data = await api<Course[]>('/api/courses');
        setCourses(data);
      } catch (error) {
        console.error(error);
        toast.error('Falha ao carregar os cursos.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourses();
  }, []);
  return (
    <div className="flex flex-col min-h-screen bg-dark-primary text-foreground">
      <Header />
      <main className="flex-grow relative overflow-hidden">
        <BackgroundParticles />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-4xl md:text-6xl font-bold font-display">
              Nossos <span className="text-gradient-green">Cursos</span>
            </h1>
            <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto text-foreground/80">
              Mergulhe em um oceano de conhecimento e transforme sua perspectiva.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <CourseCardSkeleton key={index} />
              ))
            ) : courses.length > 0 ? (
              courses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="glass-card h-full flex flex-col rounded-2xl overflow-hidden transition-all duration-300 hover:border-neon-green hover:shadow-glow hover:-translate-y-2">
                    <CardHeader>
                      <CardTitle className="text-2xl font-bold text-gold-accent">{course.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="flex-grow">
                      <p className="text-foreground/80 line-clamp-3">{course.description}</p>
                    </CardContent>
                    <CardFooter>
                      <Button asChild className="w-full bg-neon-green/10 text-neon-green hover:bg-neon-green/20">
                        <Link to={`/cursos/${course.id}`}>
                          Ver Detalhes <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </CardFooter>
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-20 glass-card rounded-2xl">
                <h2 className="text-2xl font-semibold">Nenhum curso dispon��vel.</h2>
                <p className="text-foreground/70 mt-2">Por favor, volte mais tarde.</p>
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