import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { Module } from '@shared/types';
const moduleFormSchema = z.object({
  title: z.string().min(3, { message: 'O título deve ter pelo menos 3 caracteres.' }).max(100),
});
export type ModuleFormValues = z.infer<typeof moduleFormSchema>;
interface ModuleFormProps {
  module?: Module;
  onSubmit: (values: ModuleFormValues) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}
export default function ModuleForm({ module, onSubmit, onCancel, isSubmitting }: ModuleFormProps) {
  const form = useForm<ModuleFormValues>({
    resolver: zodResolver(moduleFormSchema),
    defaultValues: {
      title: module?.title || '',
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
              <FormLabel>Título do Módulo</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Introdução à Teologia" {...field} className="bg-dark-secondary" />
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
            {isSubmitting ? 'Salvando...' : 'Salvar Módulo'}
          </Button>
        </div>
      </form>
    </Form>
  );
}