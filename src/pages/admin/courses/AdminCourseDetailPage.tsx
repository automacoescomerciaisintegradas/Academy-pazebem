import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { PlusCircle, MoreHorizontal, Edit, Trash2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Toaster, toast } from '@/components/ui/sonner';
import { api } from '@/lib/api-client';
import type { Course, Module } from '@shared/types';
import ModuleForm, { type ModuleFormValues } from '@/components/admin/ModuleForm';
import AdminBreadcrumbs from '@/components/admin/AdminBreadcrumbs';
import { Skeleton } from '@/components/ui/skeleton';
export default function AdminCourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingModule, setEditingModule] = useState<Module | undefined>(undefined);
  const [deletingModule, setDeletingModule] = useState<Module | undefined>(undefined);
  const fetchCourse = useCallback(async () => {
    if (!courseId) return;
    setIsLoading(true);
    try {
      const data = await api<Course>(`/api/courses/${courseId}`);
      setCourse(data);
    } catch (error) {
      toast.error('Falha ao carregar o curso.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [courseId]);
  useEffect(() => {
    fetchCourse();
  }, [fetchCourse]);
  const handleOpenDialog = (module?: Module) => {
    setEditingModule(module);
    setIsDialogOpen(true);
  };
  const handleCloseDialog = () => {
    setEditingModule(undefined);
    setIsDialogOpen(false);
  };
  const handleFormSubmit = async (values: ModuleFormValues) => {
    if (!courseId) return;
    setIsSubmitting(true);
    try {
      if (editingModule) {
        await api(`/api/courses/${courseId}/modules/${editingModule.id}`, {
          method: 'PUT',
          body: JSON.stringify(values),
        });
        toast.success('Módulo atualizado com sucesso!');
      } else {
        await api(`/api/courses/${courseId}/modules`, {
          method: 'POST',
          body: JSON.stringify(values),
        });
        toast.success('Módulo criado com sucesso!');
      }
      fetchCourse();
      handleCloseDialog();
    } catch (error) {
      toast.error(`Falha ao ${editingModule ? 'atualizar' : 'criar'} módulo.`);
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleDeleteModule = async () => {
    if (!deletingModule || !courseId) return;
    try {
      await api(`/api/courses/${courseId}/modules/${deletingModule.id}`, { method: 'DELETE' });
      toast.success('Módulo deletado com sucesso!');
      fetchCourse();
      setDeletingModule(undefined);
    } catch (error) {
      toast.error('Falha ao deletar módulo.');
    }
  };
  if (isLoading) {
    return (
      <div>
        <Skeleton className="h-8 w-1/2 mb-6" />
        <Skeleton className="h-12 w-1/3 mb-4" />
        <Skeleton className="h-6 w-2/3 mb-8" />
        <Card className="bg-dark-primary border-border/50">
          <CardHeader><Skeleton className="h-8 w-48" /></CardHeader>
          <CardContent><Skeleton className="h-48 w-full" /></CardContent>
        </Card>
      </div>
    );
  }
  if (!course) {
    return <div>Curso não encontrado.</div>;
  }
  return (
    <>
      <AdminBreadcrumbs items={[
        { label: 'Gerenciar Cursos', href: '/admin/gerenciar-cursos' },
        { label: course.title }
      ]} />
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-4xl font-bold font-display">{course.title}</h1>
          <p className="text-foreground/70 mt-1">{course.description}</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="bg-neon-green text-dark-primary font-bold hover:bg-neon-green/90">
          <PlusCircle className="mr-2 h-5 w-5" />
          Novo Módulo
        </Button>
      </div>
      <Card className="bg-dark-primary border-border/50 mt-8">
        <CardHeader>
          <CardTitle>Módulos do Curso</CardTitle>
          <CardDescription>Gerencie os módulos deste curso.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título do Módulo</TableHead>
                <TableHead>Aulas</TableHead>
                <TableHead className="text-right">A��ões</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {course.modules.length > 0 ? (
                course.modules.map((module) => (
                  <TableRow key={module.id}>
                    <TableCell className="font-medium">
                      <Link to={`/admin/gerenciar-cursos/${courseId}/${module.id}`} className="hover:text-neon-green flex items-center gap-2">
                        <BookOpen className="h-4 w-4" />
                        {module.title}
                      </Link>
                    </TableCell>
                    <TableCell>{module.lessons.length}</TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleOpenDialog(module)}>
                            <Edit className="mr-2 h-4 w-4" /> Editar
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setDeletingModule(module)} className="text-red-500">
                            <Trash2 className="mr-2 h-4 w-4" /> Deletar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={3} className="text-center">Nenhum módulo encontrado.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[625px] bg-dark-primary border-border/50">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gold-accent">
              {editingModule ? 'Editar Módulo' : 'Criar Novo Módulo'}
            </DialogTitle>
            <DialogDescription>
              {editingModule ? 'Faça alterações no título do módulo.' : 'Preencha o título para criar um novo módulo.'}
            </DialogDescription>
          </DialogHeader>
          <ModuleForm
            module={editingModule}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseDialog}
            isSubmitting={isSubmitting}
          />
        </DialogContent>
      </Dialog>
      <AlertDialog open={!!deletingModule} onOpenChange={(open) => !open && setDeletingModule(undefined)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso irá deletar permanentemente o módulo "{deletingModule?.title}" e todas as suas aulas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteModule} className="bg-red-600 hover:bg-red-700">
              Deletar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Toaster richColors closeButton />
    </>
  );
}