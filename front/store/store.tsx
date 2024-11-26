import { configureStore } from "@reduxjs/toolkit";
import toggleReducer from "./toggleSlice";
import daySliceReducer from "./daySlice";
import postsReducer from "./postSlice";
import { loadState, saveState } from "@/utils/Localstorage";

const preloadedState =
  typeof window !== "undefined" ? { posts: loadState() || [] } : { posts: [] };

export const store = configureStore({
  reducer: {
    asideToggle: toggleReducer,
    setDate: daySliceReducer,
    posts: postsReducer,
  },
  preloadedState,
});

if (typeof window !== "undefined") {
  store.subscribe(() => {
    saveState(store.getState().posts);
  });
}
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
