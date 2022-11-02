import z from "zod";

export const createPostSchema = z.object({
  title: z.string().max(256, "Max title length is 256"),
  body: z.string().min(10),
});

export const deletePostSchema = z.object({
  postId: z.string().cuid(),
});

export const getSinglePostSchema = z.object({
  postId: z.string().cuid(),
});
