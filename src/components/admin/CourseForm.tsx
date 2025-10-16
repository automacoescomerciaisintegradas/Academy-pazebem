import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Course } from '@shared/types';
const courseFormSchema = z.object({
  title: z.string().min(3, { message: 'O título deve ter pelo menos 3 caracteres.' }).max(100),
  description: z.string().min(10, { message: 'A descrição deve ter pelo menos 10 caracteres.' }),
});
export type CourseFormValues = z.infer<typeof courseFormSchema>;
interface CourseFormProps {
  course?: Course;
  onSubmit: (values: CourseFormValues) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}
export default function CourseForm({ course, onSubmit, onCancel, isSubmitting }: CourseFormProps) {
  const form = useForm<CourseFormValues>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      title: course?.title || '',
      description: course?.description || '',
    },
  });
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título do Curso</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Teologia Sistemática" {...field} className="bg-dark-secondary" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição do Curso</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descreva o objetivo e o conteúdo do curso..."
                  className="resize-y min-h-[120px] bg-dark-secondary"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" className="bg-neon-green text-dark-primary hover:bg-neon-green/90" disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Salvar Curso'}
          </Button>
        </div>
      </form>
    </Form>
  );
}