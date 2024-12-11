import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";

export interface Post {
  id: string; // 고유 ID
  title: string;
  content: string;
  timestamp: string;
}
const initialState: Post[] = [];

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    addPost: (state, action) => {
      state.push({
        id: uuidv4(),
        title: action.payload.title,
        content: action.payload.content,
        timestamp: action.payload.timestamp,
      });
    },
    updatePost: (state, action: PayloadAction<Post>) => {
      const { id, title, content, timestamp } = action.payload;
      const existingPost = state.find((post) => post.id === id);
      if (existingPost) {
        existingPost.title = title;
        existingPost.content = content;
        existingPost.timestamp = timestamp;
      }
    },
    deletePost: (state, action: PayloadAction<string>) => {
      return state.filter((post) => post.id !== action.payload);
    },
  },
});

export const { addPost, updatePost, deletePost } = postSlice.actions;
export default postSlice.reducer;
