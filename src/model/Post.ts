import { Comment, Post, PostReaction, User } from "@prisma/client";

export type PostWithSubData = Post & {
  user: User;
  comments: Comment[];
  reactions: PostReaction[];
};
