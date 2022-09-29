import { PostReaction } from "@prisma/client";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { PostWithSubData } from "../../model/Post";
import { PostsState } from "../state/PostState";

const initialState: PostsState = {
  posts: [],
};

export const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<PostWithSubData[]>) => {
      state.posts = action.payload;
    },
    reactToPost: (state, action: PayloadAction<PostReaction>) => {
      state.posts = state.posts.map((post) => {
        if (post.id === action.payload.postId) {
          const foundPost = { ...post };
          const foundReaction = foundPost.reactions.find(
            (reaction) => reaction.id === action.payload.id
          );
          // Update prev reaction (like/dislike)
          if (foundReaction) {
            foundPost.reactions = foundPost.reactions.map((reaction) => {
              if (reaction.id === action.payload.id) {
                return { ...reaction, isLiked: action.payload.isLiked };
              }

              return reaction;
            });
          }
          // Add new reaction
          else {
            foundPost.reactions.push(action.payload);
          }

          return foundPost;
        }

        return post;
      });
    },
    removeReaction: (state, action: PayloadAction<PostReaction>) => {
      state.posts = state.posts.map((post) => {
        if (post.id === action.payload.postId) {
          const foundPost = { ...post };
          const foundReactionIndex = foundPost.reactions.findIndex(
            (reaction) => reaction.id === action.payload.id
          );
          foundPost.reactions.splice(foundReactionIndex, 1);

          return foundPost;
        }

        return post;
      });
    },
  },
});

export const { setPosts, reactToPost, removeReaction } = postSlice.actions;

export default postSlice.reducer;
