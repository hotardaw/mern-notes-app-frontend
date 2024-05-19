import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const apiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3500' }),
  // These are used for cached data. When we invalidate different caches
  // or types, we'll be referring to the Note and User data both.
  tagTypes: ['Note', 'User'],
  // We'll apply extended slices to attach to this API slice later
  // Those  ones are where we'll add details to provide the actual
  // endpoints. This is just a base to start w the API slice we need.
  endpoints: (builder) => ({})
})
// A slice: comes from splitting up redux state objects into multiple slices of state, so a slice is really a collection of reducer logic and actions for a single feature in an app. A blog might have a slice for posts, and another slice for comments. You'd handle the logic of each differently, so they'd easch get their own slice.
