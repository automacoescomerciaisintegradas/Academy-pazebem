import { Link } from 'react-router-dom';
import { Book, Users, UserPlus, ArrowRight, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
const dashboardCards = [
  {
    title: "Gerenciar Cursos",
    description: "Crie, edite e organize os cursos da plataforma.",
    href: "/admin/gerenciar-cursos",
    icon: Book,
  },
  {
    title: "Gerenciar Acessos",
    description: "Visualize e gerencie os usuários e suas permissões.",
    href: "/admin/gerenciar-acessos",
    icon: Users,
  },
  {
    title: "Convidar Usuários",
    description: "Envie convites para novos alunos ou administradores.",
    href: "/admin/convidar-usuarios",
    icon: UserPlus,
  },
];
export default function AdminDashboardPage() {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-4xl font-bold font-display">Admin Dashboard</h1>
        <Button asChild variant="outline">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para a Página Inicial
          </Link>
        </Button>
      </div>
      <p className="text-foreground/80 mb-8">
        Bem-vindo ao painel de administração. Selecione uma opção no menu ou use os atalhos abaixo.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dashboardCards.map((card) => (
          <Link to={card.href} key={card.href}>
            <Card className="bg-dark-primary border-border/50 hover:border-neon-green hover:shadow-glow transition-all duration-300 group h-full flex flex-col">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium text-gold-accent">
                  {card.title}
                </CardTitle>
                <card.icon className="h-6 w-6 text-neon-green" />
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-between">
                <p className="text-foreground/70">
                  {card.description}
                </p>
                <div className="flex items-center text-sm text-neon-green mt-4 font-semibold">
                  Acessar
                  <ArrowRight className="ml-2 h-4 w-4 transform transition-transform group-hover:translate-x-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}