import z from "zod";

export const upsertPostReactionSchema = z.object({
  postId: z.string().cuid(),
  postReactionId: z.string().cuid().optional(),
  isLiked: z.boolean(),
});

export const deletePostReactionSchema = z.object({
  postReactionId: z.string().cuid().optional(),
});
