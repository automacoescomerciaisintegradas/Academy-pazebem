import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { PlusCircle } from 'lucide-react';
import { useAuthStore } from '@/lib/authStore';
import { useNoteStore, type Note } from '@/lib/noteStore';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import NoteCard from '@/components/NoteCard';
import NoteForm from '@/components/NoteForm';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const { notes, addNote, updateNote, deleteNote } = useNoteStore();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | undefined>(undefined);
  const handleOpenDialog = (note?: Note) => {
    setEditingNote(note);
    setIsDialogOpen(true);
  };
  const handleCloseDialog = () => {
    setEditingNote(undefined);
    setIsDialogOpen(false);
  };
  const handleFormSubmit = (values: { title: string; content: string }) => {
    if (editingNote) {
      updateNote(editingNote.id, values);
    } else {
      addNote(values);
    }
    handleCloseDialog();
  };
  return (
    <div className="flex flex-col min-h-screen bg-dark-secondary text-foreground">
      <Header />
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12">
            <div>
              <h1 className="text-4xl font-bold font-display">Painel do Usuário</h1>
              {user && (
                <p className="mt-2 text-xl text-foreground/80">
                  Bem-vindo, <span className="text-neon-green">{user.name}</span>!
                </p>
              )}
            </div>
            <Button 
              onClick={() => handleOpenDialog()} 
              className="mt-4 sm:mt-0 bg-neon-green text-dark-primary font-bold hover:bg-neon-green/90 transition-transform hover:scale-105"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Nova Nota
            </Button>
          </div>
          {notes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {notes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onEdit={() => handleOpenDialog(note)}
                    onDelete={deleteNote}
                  />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="text-center py-20 glass-card rounded-2xl">
              <h2 className="text-2xl font-semibold">Nenhuma nota encontrada.</h2>
              <p className="text-foreground/70 mt-2">Clique em "Nova Nota" para começar a escrever.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[625px] bg-dark-primary border-border/50">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-gold-accent">
              {editingNote ? 'Editar Nota' : 'Criar Nova Nota'}
            </DialogTitle>
            <DialogDescription>
              {editingNote ? 'Faça alterações na sua nota.' : 'Adicione um título e conteúdo para sua nova nota.'}
            </DialogDescription>
          </DialogHeader>
          <NoteForm
            note={editingNote}
            onSubmit={handleFormSubmit}
            onCancel={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}