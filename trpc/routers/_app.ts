
import { projectsRouter } from '@/modules/project/server/procedure';
import { createTRPCRouter } from '../init';

import { messageRouter } from '@/modules/messages/server/procedure';
export const appRouter = createTRPCRouter({
  messages:messageRouter,
  projects:projectsRouter
});
// export type definition of API
export type AppRouter = typeof appRouter;
