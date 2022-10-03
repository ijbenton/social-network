import * as trpc from "@trpc/server";

import {
  deletePostReactionSchema,
  upsertPostReactionSchema,
} from "../schema/reaction.schema";
import { createRouter } from "./context";

export const reactionRouter = createRouter()
  .mutation("upsert-post", {
    input: upsertPostReactionSchema,
    async resolve({ input, ctx }) {
      if (!ctx.session || !ctx.session.user) {
        throw new trpc.TRPCError({
          code: "FORBIDDEN",
          message: "Can not like/dislike a post while logged out",
        });
      }

      const upsertReaction = await ctx.prisma.postReaction.upsert({
        where: {
          id: input.postReactionId ?? "",
        },
        update: {
          isLiked: input.isLiked,
        },
        create: {
          isLiked: input.isLiked,
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          post: {
            connect: {
              id: input.postId,
            },
          },
        },
      });

      return upsertReaction;
    },
  })
  .mutation("delete-post", {
    input: deletePostReactionSchema,
    async resolve({ input, ctx }) {
      if (!ctx.session || !ctx.session.user) {
        throw new trpc.TRPCError({
          code: "FORBIDDEN",
          message: "Can not undo like/dislike while logged out",
        });
      }

      const deletedReaction = await ctx.prisma.postReaction.delete({
        where: { id: input.postReactionId },
      });

      return deletedReaction;
    },
  });
