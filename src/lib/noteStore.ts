import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { v4 as uuidv4 } from 'uuid';
export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}
interface NoteState {
  notes: Note[];
  addNote: (note: Omit<Note, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateNote: (id: string, note: Partial<Omit<Note, 'id' | 'createdAt'>>) => void;
  deleteNote: (id: string) => void;
}
const getInitialNotes = (): Note[] => {
    const now = new Date().toISOString();
    return [
        {
            id: uuidv4(),
            title: 'Bem-vindo às suas Notas!',
            content: 'Este é um lugar para você anotar insights, reflexões e lembretes dos cursos da Paz & Bem Academy. Sinta-se à vontade para editar ou deletar esta nota de exemplo.',
            createdAt: now,
            updatedAt: now,
        },
        {
            id: uuidv4(),
            title: 'Ideias sobre Teologia Sistemática',
            content: 'A soberania de Deus e a responsabilidade humana não são contraditórias, mas paradoxais. Explorar a tensão entre os dois é fundamental para uma teologia equilibrada.',
            createdAt: now,
            updatedAt: now,
        }
    ];
};
export const useNoteStore = create<NoteState>()(
  persist(
    immer((set) => ({
      notes: getInitialNotes(),
      addNote: (note) =>
        set((state) => {
          const now = new Date().toISOString();
          state.notes.unshift({
            ...note,
            id: uuidv4(),
            createdAt: now,
            updatedAt: now,
          });
        }),
      updateNote: (id, noteUpdate) =>
        set((state) => {
          const note = state.notes.find((n) => n.id === id);
          if (note) {
            Object.assign(note, noteUpdate);
            note.updatedAt = new Date().toISOString();
          }
        }),
      deleteNote: (id) =>
        set((state) => {
          state.notes = state.notes.filter((note) => note.id !== id);
        }),
    })),
    {
      name: 'pazebem-notes-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);