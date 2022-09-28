import { PostReaction } from "@prisma/client";
import { User } from "next-auth";

export const getReactionsData = (reactions: PostReaction[], user: User) => {
  let numberOfLikes = 0;
  let numberOfDisLikes = 0;
  let postReaction: PostReaction | undefined;

  reactions.forEach((reaction) => {
    if (reaction.isLiked) {
      numberOfLikes++;
    } else {
      numberOfDisLikes++;
    }

    if (reaction.userId === user.id) {
      postReaction = reaction;
    }
  });

  return { numberOfLikes, numberOfDisLikes, postReaction };
};
