import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, MoreHorizontal, Edit, Trash2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Toaster, toast } from '@/components/ui/sonner';
import { api } from '@/lib/api-client';
import type { Course } from '@shared/types';
import CourseForm, { type CourseFormValues } from '@/components/admin/CourseForm';
export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | undefined>(undefined);
  const [deletingCourse, setDeletingCourse] = useState<Course | undefined>(undefined);
  const fetchCourses = async () => {
    setIsLoading(true);
    try {
      const data = await api<Course[]>('/api/courses');
      setCourses(data);
    } catch (error) {
      toast.error('Falha ao carregar cursos.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchCourses();
  }, []);
  const handleOpenDialog = (course?: Course) => {
    setEditingCourse(course);
    setIsDialogOpen(true);
  };
  const handleCloseDialog = () => {
    setEditingCourse(undefined);
    setIsDialogOpen(false);
  };
  const handleFormSubmit = async (values: CourseFormValues) => {
    setIsSubmitting(true);
    try {
      if (editingCourse) {
        await api(`/api/courses/${editingCourse.id}`, {
          method: 'PUT',
          body: JSON.stringify(values),
        });
        toast.success('Curso atualizado com sucesso!');
      } else {
        await api('/api/courses', {
          method: 'POST',
          body: JSON.stringify(values),
        });
        toast.success('Curso criado com sucesso!');
      }
      fetchCourses();
      handleCloseDialog();
    } catch (error) {
      toast.error(`Falha ao ${editingCourse ? 'atualizar' : 'criar'} curso.`);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleDeleteCourse = async () => {
    if (!deletingCourse) return;
    try {
      await api(`/api/courses/${deletingCourse.id}`, { method: 'DELETE' });
      toast.success('Curso deletado com sucesso!');
      fetchCourses();
      setDeletingCourse(undefined);
    } catch (error) {
      toast.error('Falha ao deletar curso.');
    }
  };
  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold font-display">Gerenciar Cursos</h1>
        <Button onClick={() => handleOpenDialog()} className="bg-neon-green text-dark-primary font-bold hover:bg-neon-green/90">
          <PlusCircle className="mr-2 h-5 w-5" />
          Novo Curso
        </Button>
      </div>
      <Card className="bg-dark-primary border-border/50">
        <CardHeader>
          <CardTitle>Lista de Cursos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Módulos</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={3} className="text-center">Carregando...</TableCell></TableRow>
              ) : courses.length > 0 ? (
                courses.map((course) => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">
                      <Link to={`/admin/gerenciar-cursos/${course.id}`} className="hover:text-neon-green flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        {course.title}
                      </Link>
                    </TableCell>
                    <TableCell>{course.modules.length}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleOpenDialog(course)}>
                            <Edit className="mr-2 h-4 w-4" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setDeletingCourse(course)} className="text-red-500">
                            <Trash2 className="mr-2 h-4 w-4" /> Deletar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={3} className="text-center">Nenhum curso encontrado.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[625px] bg-dark-primary border-border/50">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gold-accent">
              {editingCourse ? 'Editar Curso' : 'Criar Novo Curso'}
            </DialogTitle>
            <DialogDescription>
              {editingCourse ? 'Faça alterações nos detalhes do curso.' : 'Preencha as informações para criar um novo curso.'}
            </DialogDescription>
          </DialogHeader>
          <CourseForm
            course={editingCourse}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseDialog}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>
      <AlertDialog open={!!deletingCourse} onOpenChange={(open) => !open && setDeletingCourse(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso irá deletar permanentemente o curso "{deletingCourse?.title}" e todos os seus módulos e aulas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteCourse} className="bg-red-600 hover:bg-red-700">
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Toaster richColors closeButton />
    </>
  );
}