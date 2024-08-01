import { configureStore } from "@reduxjs/toolkit";
import userAuthorReducer from "./slices/UserAuthorSlice";

export const reduxStore = configureStore({
  reducer: {
    UserAuthorLoginReducer: userAuthorReducer,
  },
});
