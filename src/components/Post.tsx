import { Comment, Post, PostReaction, User } from "@prisma/client";
import { User as NextAuthUser } from "next-auth";
import Image from "next/image";
import React, { useMemo } from "react";
import {
  FaThumbsDown,
  FaThumbsUp,
  FaRegThumbsDown,
  FaRegThumbsUp,
} from "react-icons/fa";
import { getReactionsData } from "../utils/post";
import { trpc } from "../utils/trpc";
type PostProps = {
  post: Post & {
    user: User;
    comments: Comment[];
    reactions: PostReaction[];
  };
  user: NextAuthUser;
};

const Post = ({ post, user }: PostProps) => {
  const { numberOfLikes, numberOfDisLikes, postReaction } = useMemo(
    () => getReactionsData(post.reactions, user),
    [post, user]
  );

  const upsert = trpc.useMutation("reaction.upsert-post", {
    // onSuccess({ id }) {},
    onError({ message }) {
      alert(message);
    },
  });

  const remove = trpc.useMutation("reaction.delete-post", {
    // onSuccess({ id }) {},
    // onError({ message }) {},
  });

  const handleReaction = (isLiked: boolean) => {
    // User has already liked/disliked post and is undoing there like/dislike
    if (
      postReaction &&
      ((postReaction.isLiked && isLiked) || (!postReaction.isLiked && !isLiked))
    ) {
      remove.mutate({ postReactionId: postReaction.id });
    }
    // User is either creating a reaction for the first time
    // OR switching their like to a dislike, vice versa
    else {
      upsert.mutate({
        isLiked,
        postId: post.id,
        postReactionId: postReaction?.id,
      });
    }
  };

  return (
    <article className="flex text-white gap-4">
      <div className="mt-4">
        <Image
          className="h-8 w-8 rounded-full"
          src={post.user?.image ?? ""}
          alt=""
          height={48}
          width={48}
        />
      </div>
      <div className="flex-1 flex flex-col gap-2">
        <div className="text-3xl">{post.title}</div>
        <div>{post.body}</div>
        <div className="flex gap-4">
          <div className="flex items-center gap-1">
            <span
              className="cursor-pointer"
              onClick={() => handleReaction(true)}
            >
              {postReaction && postReaction?.isLiked ? (
                <FaThumbsUp />
              ) : (
                <FaRegThumbsUp />
              )}
            </span>
            <span>{numberOfLikes}</span>
          </div>
          <div className="flex items-center gap-1">
            <span
              className="cursor-pointer"
              onClick={() => handleReaction(false)}
            >
              {postReaction && !postReaction.isLiked ? (
                <FaThumbsDown className="cursor-pointer" />
              ) : (
                <FaRegThumbsDown />
              )}
            </span>
            <span>{numberOfDisLikes}</span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default Post;
