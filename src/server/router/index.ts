import superjson from "superjson";

import { chatRouter } from "./chat.router";
// src/server/router/index.ts
import { createRouter } from "./context";
import { postRouter } from "./post.router";
import { reactionRouter } from "./reaction.router";
import { userRouter } from "./user.router";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("post.", postRouter)
  .merge("reaction.", reactionRouter)
  .merge("user.", userRouter)
  .merge("chat.", chatRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
