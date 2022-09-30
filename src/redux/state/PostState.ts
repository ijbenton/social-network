import { PostWithSubData } from "../../model/Post";

export interface PostsState {
  posts: Record<string, PostWithSubData>;
}
