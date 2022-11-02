import * as trpc from "@trpc/server";

import { createPostSchema, deletePostSchema, getSinglePostSchema } from "../schema/post.schema";
import { createRouter } from "./context";

export const postRouter = createRouter()
  .mutation("create-post", {
    input: createPostSchema,
    async resolve({ input, ctx }) {
      if (!ctx.session || !ctx.session.user) {
        throw new trpc.TRPCError({
          code: "FORBIDDEN",
          message: "Can not create a post while logged out",
        });
      }

      const post = await ctx.prisma.post.create({
        data: {
          ...input,
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });

      return post;
    },
  })
  .mutation("delete-post", {
    input: deletePostSchema,
    async resolve({ input, ctx }) {
      if (!ctx.session || !ctx.session.user) {
        throw new trpc.TRPCError({
          code: "FORBIDDEN",
          message: "Can not create a post while logged out",
        });
      }

      const post = await ctx.prisma.post.deleteMany({
        where: {
          id: input.postId,
          userId: ctx.session.user.id,
        },
      });

      return post;
    },
  })

  .query("posts", {
    resolve({ ctx }) {
      return ctx.prisma.post.findMany({
        include: { user: true, comments: true, reactions: true },
      });
    },
  })
  .query("single-post", {
    input: getSinglePostSchema,
    resolve({ input, ctx }) {
      return ctx.prisma.post.findUnique({
        where: { id: input.postId },
        include: { user: true, comments: true, reactions: true },
      });
    },
  });
