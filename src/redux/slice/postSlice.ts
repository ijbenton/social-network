import { PostReaction } from "@prisma/client";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import isUndefined from "lodash.isundefined";

import { PostWithSubData } from "../../model/Post";
import { PostsState } from "../state/PostState";

const initialState: PostsState = {
  posts: {},
};

export const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    setPosts: (state, action: PayloadAction<PostWithSubData[]>) => {
      action.payload.forEach((post) => {
        state.posts[post.id] = post;
      });
    },
    reactToPost: (state: PostsState, action: PayloadAction<PostReaction>) => {
      if (state.posts[action.payload.postId]) {
        const foundReaction = state.posts[
          action.payload.postId
        ]?.reactions.find((reaction) => reaction.id === action.payload.id);
        // Update previous reaction (like/dislike)
        if (foundReaction) {
          state.posts[action.payload.postId].reactions =
            state.posts[action.payload.postId]?.reactions.map((reaction) => {
              if (reaction.id === action.payload.id) {
                return { ...reaction, isLiked: action.payload.isLiked };
              }

              return reaction;
            }) ?? [];
        }
        // Add new reaction
        else {
          state.posts[action.payload.postId]?.reactions.push(action.payload);
        }
      }
    },
    removeReaction: (state, action: PayloadAction<PostReaction>) => {
      if (state.posts[action.payload.postId]) {
        const foundReactionIndex = state.posts[
          action.payload.postId
        ]?.reactions.findIndex((reaction) => reaction.id === action.payload.id);
        if (!isUndefined(foundReactionIndex)) {
          state.posts[action.payload.postId]?.reactions.splice(
            foundReactionIndex,
            1
          );
        }
      }
    },
  },
});

export const { setPosts, reactToPost, removeReaction } = postSlice.actions;

export default postSlice.reducer;
