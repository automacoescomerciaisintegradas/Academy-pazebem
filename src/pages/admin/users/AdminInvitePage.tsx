import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Toaster, toast } from '@/components/ui/sonner';
import { Send } from 'lucide-react';
const inviteFormSchema = z.object({
  email: z.string().email({ message: 'Por favor, insira um email válido.' }),
  role: z.enum(['user', 'admin']),
});
type InviteFormValues = z.infer<typeof inviteFormSchema>;
export default function AdminInvitePage() {
  const form = useForm<InviteFormValues>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      email: '',
      role: 'user',
    },
  });
  const onSubmit = (values: InviteFormValues) => {
    // Mock implementation
    console.log('Sending invite to:', values);
    toast.success(`Convite enviado para ${values.email} com a permissão de ${values.role}.`);
    form.reset();
  };
  return (
    <>
      <h1 className="text-4xl font-bold font-display mb-8">Convidar Usuários</h1>
      <Card className="bg-dark-primary border-border/50 max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Enviar Convite</CardTitle>
          <CardDescription>Preencha o email e a permissão para convidar um novo usuário para a plataforma.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email do Convidado</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="exemplo@pazebem.com" {...field} className="bg-dark-secondary" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Permissão</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-dark-secondary">
                          <SelectValue placeholder="Selecione uma permissão" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="user">Usuário</SelectItem>
                        <SelectItem value="admin">Administrador</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex justify-end">
                <Button type="submit" className="bg-neon-green text-dark-primary font-bold hover:bg-neon-green/90">
                  <Send className="mr-2 h-4 w-4" />
                  Enviar Convite
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Toaster richColors closeButton />
    </>
  );
}