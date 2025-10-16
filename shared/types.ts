export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export interface User {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  role?: 'user' | 'admin';
}
export interface Chat {
  id: string;
  title: string;
}
export interface ChatMessage {
  id: string;
  chatId: string;
  userId: string;
  text: string;
  ts: number; // epoch millis
}
export interface Lesson {
  id: string;
  title: string;
  content: string; // Could be markdown, video URL, etc.
  moduleId: string;
}
export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
  courseId: string;
}
export interface Course {
  id: string;
  title: string;
  description: string;
  modules: Module[];
}