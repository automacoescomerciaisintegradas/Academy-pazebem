import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PlusCircle, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Toaster, toast } from '@/components/ui/sonner';
import { api } from '@/lib/api-client';
import type { Course, Module, Lesson } from '@shared/types';
import LessonForm, { type LessonFormValues } from '@/components/admin/LessonForm';
import AdminBreadcrumbs from '@/components/admin/AdminBreadcrumbs';
import { Skeleton } from '@/components/ui/skeleton';
export default function AdminModuleDetailPage() {
  const { courseId, moduleId } = useParams<{ courseId: string; moduleId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [module, setModule] = useState<Module | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | undefined>(undefined);
  const [deletingLesson, setDeletingLesson] = useState<Lesson | undefined>(undefined);
  const fetchCourseData = useCallback(async () => {
    if (!courseId) return;
    setIsLoading(true);
    try {
      const data = await api<Course>(`/api/courses/${courseId}`);
      setCourse(data);
      const currentModule = data.modules.find(m => m.id === moduleId);
      setModule(currentModule || null);
    } catch (error) {
      toast.error('Falha ao carregar dados do curso e módulo.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [courseId, moduleId]);
  useEffect(() => {
    fetchCourseData();
  }, [fetchCourseData]);
  const handleOpenDialog = (lesson?: Lesson) => {
    setEditingLesson(lesson);
    setIsDialogOpen(true);
  };
  const handleCloseDialog = () => {
    setEditingLesson(undefined);
    setIsDialogOpen(false);
  };
  const handleFormSubmit = async (values: LessonFormValues) => {
    if (!courseId || !moduleId) return;
    setIsSubmitting(true);
    try {
      if (editingLesson) {
        await api(`/api/courses/${courseId}/modules/${moduleId}/lessons/${editingLesson.id}`, {
          method: 'PUT',
          body: JSON.stringify(values),
        });
        toast.success('Aula atualizada com sucesso!');
      } else {
        await api(`/api/courses/${courseId}/modules/${moduleId}/lessons`, {
          method: 'POST',
          body: JSON.stringify(values),
        });
        toast.success('Aula criada com sucesso!');
      }
      fetchCourseData();
      handleCloseDialog();
    } catch (error) {
      toast.error(`Falha ao ${editingLesson ? 'atualizar' : 'criar'} aula.`);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleDeleteLesson = async () => {
    if (!deletingLesson || !courseId || !moduleId) return;
    try {
      await api(`/api/courses/${courseId}/modules/${moduleId}/lessons/${deletingLesson.id}`, { method: 'DELETE' });
      toast.success('Aula deletada com sucesso!');
      fetchCourseData();
      setDeletingLesson(undefined);
    } catch (error) {
      toast.error('Falha ao deletar aula.');
    }
  };
  if (isLoading) {
    return (
      <div>
        <Skeleton className="h-8 w-2/3 mb-6" />
        <Skeleton className="h-12 w-1/2 mb-8" />
        <Card className="bg-dark-primary border-border/50">
          <CardHeader><Skeleton className="h-8 w-48" /></CardHeader>
          <CardContent><Skeleton className="h-48 w-full" /></CardContent>
        </Card>
      </div>
    );
  }
  if (!course || !module) {
    return <div>Curso ou módulo não encontrado.</div>;
  }
  return (
    <>
      <AdminBreadcrumbs items={[
        { label: 'Gerenciar Cursos', href: '/admin/gerenciar-cursos' },
        { label: course.title, href: `/admin/gerenciar-cursos/${courseId}` },
        { label: module.title }
      ]} />
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold font-display">Gerenciar Aulas: {module.title}</h1>
        <Button onClick={() => handleOpenDialog()} className="bg-neon-green text-dark-primary font-bold hover:bg-neon-green/90">
          <PlusCircle className="mr-2 h-5 w-5" />
          Nova Aula
        </Button>
      </div>
      <Card className="bg-dark-primary border-border/50">
        <CardHeader>
          <CardTitle>Aulas do Módulo</CardTitle>
          <CardDescription>Gerencie as aulas deste módulo.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título da Aula</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {module.lessons.length > 0 ? (
                module.lessons.map((lesson) => (
                  <TableRow key={lesson.id}>
                    <TableCell className="font-medium">{lesson.title}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleOpenDialog(lesson)}>
                            <Edit className="mr-2 h-4 w-4" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setDeletingLesson(lesson)} className="text-red-500">
                            <Trash2 className="mr-2 h-4 w-4" /> Deletar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={2} className="text-center">Nenhuma aula encontrada.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[625px] bg-dark-primary border-border/50">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gold-accent">
              {editingLesson ? 'Editar Aula' : 'Criar Nova Aula'}
            </DialogTitle>
            <DialogDescription>
              {editingLesson ? 'Faça alterações nos detalhes da aula.' : 'Preencha as informações para criar uma nova aula.'}
            </DialogDescription>
          </DialogHeader>
          <LessonForm
            lesson={editingLesson}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseDialog}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>
      <AlertDialog open={!!deletingLesson} onOpenChange={(open) => !open && setDeletingLesson(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso irá deletar permanentemente a aula "{deletingLesson?.title}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteLesson} className="bg-red-600 hover:bg-red-700">
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Toaster richColors closeButton />
    </>
  );
}