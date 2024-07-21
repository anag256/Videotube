import { configureStore } from '@reduxjs/toolkit'
import { baseAPI } from './baseAPI'
import appReducer from './appState'
// ...

export const store = configureStore({
  reducer: {
    appState:appReducer,
    [baseAPI.reducerPath]: baseAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware().concat(baseAPI.middleware),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch