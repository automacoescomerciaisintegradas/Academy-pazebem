import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Lesson } from '@shared/types';
const lessonFormSchema = z.object({
  title: z.string().min(3, { message: 'O título deve ter pelo menos 3 caracteres.' }).max(100),
  content: z.string().min(10, { message: 'O conteúdo deve ter pelo menos 10 caracteres.' }),
});
export type LessonFormValues = z.infer<typeof lessonFormSchema>;
interface LessonFormProps {
  lesson?: Lesson;
  onSubmit: (values: LessonFormValues) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}
export default function LessonForm({ lesson, onSubmit, onCancel, isSubmitting }: LessonFormProps) {
  const form = useForm<LessonFormValues>({
    resolver: zodResolver(lessonFormSchema),
    defaultValues: {
      title: lesson?.title || '',
      content: lesson?.content || '',
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
              <FormLabel>Título da Aula</FormLabel>
              <FormControl>
                <Input placeholder="Ex: A Doutrina da Trindade" {...field} className="bg-dark-secondary" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Conteúdo da Aula</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Insira o conteúdo da aula, como texto, links de vídeo, etc."
                  className="resize-y min-h-[150px] bg-dark-secondary"
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
            {isSubmitting ? 'Salvando...' : 'Salvar Aula'}
          </Button>
        </div>
      </form>
    </Form>
  );
}