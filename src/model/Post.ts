import { Comment, Post, PostReaction, User } from "@prisma/client";

export interface PostWithSubData extends Post {
  user: User;
  comments: Comment[];
  reactions: PostReaction[];
}
