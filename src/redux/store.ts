import { configureStore } from "@reduxjs/toolkit";

import postReducer from "./slice/postSlice";
import { PostsState } from "./state/PostState";

export default configureStore({
  reducer: {
    posts: postReducer,
  },
});

export type RootState = {
  posts: PostsState;
};
