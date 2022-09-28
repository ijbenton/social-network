import superjson from "superjson";

// src/server/router/index.ts
import { createRouter } from "./context";
import { postRouter } from "./post.router";
import { reactionRouter } from "./reaction.router";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("post.", postRouter)
  .merge("reaction.", reactionRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
