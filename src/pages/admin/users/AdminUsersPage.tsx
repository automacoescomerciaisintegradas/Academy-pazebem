import { useEffect, useState } from 'react';
import { Eye, EyeOff, MoreHorizontal, Shield, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Toaster, toast } from '@/components/ui/sonner';
import { api } from '@/lib/api-client';
import type { User } from '@shared/types';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [visibleEmails, setVisibleEmails] = useState<Record<string, boolean>>({});
  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const data = await api<{ items: User[] }>('/api/users');
      setUsers(data.items);
    } catch (error) {
      toast.error('Falha ao carregar usuários.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchUsers();
  }, []);
  const toggleEmailVisibility = (userId: string) => {
    setVisibleEmails(prev => ({ ...prev, [userId]: !prev[userId] }));
  };
  const formatEmail = (email: string, isVisible: boolean) => {
    if (!email) return 'N/A';
    if (isVisible) return email;
    const [localPart, domain] = email.split('@');
    return `${localPart.slice(0, 2)}****@${domain}`;
  };
  const handleRoleChange = async (userId: string, newRole: 'admin' | 'user') => {
    try {
      await api(`/api/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify({ role: newRole }),
      });
      toast.success('Permissão do usuário atualizada!');
      fetchUsers();
    } catch (error) {
      toast.error('Falha ao atualizar permissão.');
    }
  };
  return (
    <>
      <h1 className="text-4xl font-bold font-display mb-8">Gerenciar Acessos</h1>
      <Card className="bg-dark-primary border-border/50">
        <CardHeader>
          <CardTitle>Lista de Usuários</CardTitle>
          <CardDescription>Visualize e gerencie os usuários da plataforma.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Permissão</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={4} className="text-center">Carregando...</TableCell></TableRow>
              ) : users.length > 0 ? (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      {user.name}
                    </TableCell>
                    <TableCell className="flex items-center gap-2">
                      <span>{formatEmail(user.email || '', !!visibleEmails[user.id])}</span>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleEmailVisibility(user.id)}>
                        {visibleEmails[user.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className={user.role === 'admin' ? 'bg-gold-accent text-dark-primary' : ''}>
                        {user.role === 'admin' ? 'Admin' : 'Usuário'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'admin')} disabled={user.role === 'admin'}>
                            <Shield className="mr-2 h-4 w-4" /> Tornar Admin
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleRoleChange(user.id, 'user')} disabled={user.role === 'user'}>
                            <UserIcon className="mr-2 h-4 w-4" /> Tornar Usuário
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow><TableCell colSpan={4} className="text-center">Nenhum usuário encontrado.</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Toaster richColors closeButton />
    </>
  );
}