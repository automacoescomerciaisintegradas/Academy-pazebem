import { Hono } from "hono";
import type { Env } from './core-utils';
import { UserEntity, ChatBoardEntity, CourseEntity } from "./entities";
import { ok, bad, notFound, isStr } from './core-utils';
import type { Course, Module, Lesson, User } from "@shared/types";
import { v4 as uuidv4 } from 'uuid';
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  app.get('/api/test', (c) => c.json({ success: true, data: { name: 'CF Workers Demo' }}));
  // --- USER MANAGEMENT ---
  app.get('/api/users', async (c) => {
    await UserEntity.ensureSeed(c.env);
    const page = await UserEntity.list(c.env);
    return ok(c, page);
  });
  app.post('/api/users', async (c) => {
    const { name } = (await c.req.json()) as { name?: string };
    if (!name?.trim()) return bad(c, 'name required');
    const newUser: User = { id: crypto.randomUUID(), name: name.trim(), role: 'user' };
    return ok(c, await UserEntity.create(c.env, newUser));
  });
  app.put('/api/users/:id', async (c) => {
    const userId = c.req.param('id');
    const { role } = (await c.req.json()) as { role?: 'user' | 'admin' };
    if (role !== 'user' && role !== 'admin') return bad(c, 'valid role required');
    const user = new UserEntity(c.env, userId);
    if (!await user.exists()) return notFound(c, 'user not found');
    await user.patch({ role });
    return ok(c, await user.getState());
  });
  // --- CHAT MANAGEMENT (Legacy Demo) ---
  app.get('/api/chats', async (c) => {
    await ChatBoardEntity.ensureSeed(c.env);
    const page = await ChatBoardEntity.list(c.env);
    return ok(c, page);
  });
  app.post('/api/chats', async (c) => {
    const { title } = (await c.req.json()) as { title?: string };
    if (!title?.trim()) return bad(c, 'title required');
    const created = await ChatBoardEntity.create(c.env, { id: crypto.randomUUID(), title: title.trim(), messages: [] });
    return ok(c, { id: created.id, title: created.title });
  });
  app.get('/api/chats/:chatId/messages', async (c) => {
    const chat = new ChatBoardEntity(c.env, c.req.param('chatId'));
    if (!await chat.exists()) return notFound(c, 'chat not found');
    return ok(c, await chat.listMessages());
  });
  app.post('/api/chats/:chatId/messages', async (c) => {
    const chatId = c.req.param('chatId');
    const { userId, text } = (await c.req.json()) as { userId?: string; text?: string };
    if (!isStr(userId) || !text?.trim()) return bad(c, 'userId and text required');
    const chat = new ChatBoardEntity(c.env, chatId);
    if (!await chat.exists()) return notFound(c, 'chat not found');
    return ok(c, await chat.sendMessage(userId, text.trim()));
  });
  // --- COURSE MANAGEMENT ---
  app.get('/api/courses', async (c) => {
    const page = await CourseEntity.list(c.env);
    return ok(c, page.items);
  });
  app.get('/api/courses/:id', async (c) => {
    const course = new CourseEntity(c.env, c.req.param('id'));
    if (!await course.exists()) return notFound(c, 'course not found');
    return ok(c, await course.getState());
  });
  app.post('/api/courses', async (c) => {
    const { title, description } = (await c.req.json()) as { title?: string; description?: string };
    if (!isStr(title) || !isStr(description)) return bad(c, 'title and description required');
    const newCourse: Course = { id: uuidv4(), title, description, modules: [] };
    const created = await CourseEntity.create(c.env, newCourse);
    return ok(c, created);
  });
  app.put('/api/courses/:id', async (c) => {
    const courseId = c.req.param('id');
    const { title, description } = (await c.req.json()) as { title?: string; description?: string };
    if (!isStr(title) && !isStr(description)) return bad(c, 'title or description required');
    const course = new CourseEntity(c.env, courseId);
    if (!await course.exists()) return notFound(c, 'course not found');
    const update: Partial<Course> = {};
    if (isStr(title)) update.title = title;
    if (isStr(description)) update.description = description;
    await course.patch(update);
    return ok(c, await course.getState());
  });
  app.delete('/api/courses/:id', async (c) => {
    const deleted = await CourseEntity.delete(c.env, c.req.param('id'));
    return ok(c, { id: c.req.param('id'), deleted });
  });
  // --- MODULE MANAGEMENT ---
  app.post('/api/courses/:courseId/modules', async (c) => {
    const courseId = c.req.param('courseId');
    const { title } = (await c.req.json()) as { title?: string };
    if (!isStr(title)) return bad(c, 'title required');
    const course = new CourseEntity(c.env, courseId);
    if (!await course.exists()) return notFound(c, 'course not found');
    const newModule: Module = { id: uuidv4(), title, lessons: [], courseId };
    const updatedCourse = await course.mutate(s => ({ ...s, modules: [...s.modules, newModule] }));
    return ok(c, updatedCourse);
  });
  app.put('/api/courses/:courseId/modules/:moduleId', async (c) => {
    const { courseId, moduleId } = c.req.param();
    const { title } = (await c.req.json()) as { title?: string };
    if (!isStr(title)) return bad(c, 'title required');
    const course = new CourseEntity(c.env, courseId);
    if (!await course.exists()) return notFound(c, 'course not found');
    const updatedCourse = await course.mutate(s => {
      const moduleIndex = s.modules.findIndex(m => m.id === moduleId);
      if (moduleIndex === -1) return s;
      s.modules[moduleIndex].title = title;
      return s;
    });
    return ok(c, updatedCourse);
  });
  app.delete('/api/courses/:courseId/modules/:moduleId', async (c) => {
    const { courseId, moduleId } = c.req.param();
    const course = new CourseEntity(c.env, courseId);
    if (!await course.exists()) return notFound(c, 'course not found');
    const updatedCourse = await course.mutate(s => ({ ...s, modules: s.modules.filter(m => m.id !== moduleId) }));
    return ok(c, updatedCourse);
  });
  // --- LESSON MANAGEMENT ---
  app.post('/api/courses/:courseId/modules/:moduleId/lessons', async (c) => {
    const { courseId, moduleId } = c.req.param();
    const { title, content } = (await c.req.json()) as { title?: string, content?: string };
    if (!isStr(title) || !isStr(content)) return bad(c, 'title and content required');
    const course = new CourseEntity(c.env, courseId);
    if (!await course.exists()) return notFound(c, 'course not found');
    const newLesson: Lesson = { id: uuidv4(), title, content, moduleId };
    const updatedCourse = await course.mutate(s => {
      const module = s.modules.find(m => m.id === moduleId);
      if (module) {
        module.lessons.push(newLesson);
      }
      return s;
    });
    return ok(c, updatedCourse);
  });
  app.put('/api/courses/:courseId/modules/:moduleId/lessons/:lessonId', async (c) => {
    const { courseId, moduleId, lessonId } = c.req.param();
    const { title, content } = (await c.req.json()) as { title?: string, content?: string };
    if (!isStr(title) || !isStr(content)) return bad(c, 'title and content required');
    const course = new CourseEntity(c.env, courseId);
    if (!await course.exists()) return notFound(c, 'course not found');
    const updatedCourse = await course.mutate(s => {
      const module = s.modules.find(m => m.id === moduleId);
      if (module) {
        const lesson = module.lessons.find(l => l.id === lessonId);
        if (lesson) {
          lesson.title = title;
          lesson.content = content;
        }
      }
      return s;
    });
    return ok(c, updatedCourse);
  });
  app.delete('/api/courses/:courseId/modules/:moduleId/lessons/:lessonId', async (c) => {
    const { courseId, moduleId, lessonId } = c.req.param();
    const course = new CourseEntity(c.env, courseId);
    if (!await course.exists()) return notFound(c, 'course not found');
    const updatedCourse = await course.mutate(s => {
      const module = s.modules.find(m => m.id === moduleId);
      if (module) {
        module.lessons = module.lessons.filter(l => l.id !== lessonId);
      }
      return s;
    });
    return ok(c, updatedCourse);
  });
  // --- DELETION ROUTES (Legacy Demo) ---
  app.delete('/api/users/:id', async (c) => ok(c, { id: c.req.param('id'), deleted: await UserEntity.delete(c.env, c.req.param('id')) }));
  app.post('/api/users/deleteMany', async (c) => {
    const { ids } = (await c.req.json()) as { ids?: string[] };
    const list = ids?.filter(isStr) ?? [];
    if (list.length === 0) return bad(c, 'ids required');
    return ok(c, { deletedCount: await UserEntity.deleteMany(c.env, list), ids: list });
  });
  app.delete('/api/chats/:id', async (c) => ok(c, { id: c.req.param('id'), deleted: await ChatBoardEntity.delete(c.env, c.req.param('id')) }));
  app.post('/api/chats/deleteMany', async (c) => {
    const { ids } = (await c.req.json()) as { ids?: string[] };
    const list = ids?.filter(isStr) ?? [];
    if (list.length === 0) return bad(c, 'ids required');
    return ok(c, { deletedCount: await ChatBoardEntity.deleteMany(c.env, list), ids: list });
  });
}