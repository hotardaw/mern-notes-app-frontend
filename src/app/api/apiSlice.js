import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { setCredentials } from '../../features/auth/authSlice'

// This baseQuery is applied to every request we send
const baseQuery = fetchBaseQuery({
  baseUrl: 'http://localhost:3500',
  // Ensure our cookie is always sent
  credentials: 'include',
  // Extract the token from application state, then set 'authorization' header with the Bearer token value
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token

    if (token) {
      headers.set('authorization', `Bearer ${token}`)
    }
    return headers
  }
})

// Query wrapper:
const baseQueryWithReauth = async (args, api, extraOptions) => {
  // console.log(args) // request url, method, body
  // console.log(api) // signal, dispatch, getState()
  // console.log(extraOptions) //custom like {shout: true}

  let result = await baseQuery(args, api, extraOptions)

  if (result?.error?.status === 403) {
    console.log('sending refresh token')

    // Send refresh token to get new access token
    const refreshResult = await baseQuery('/auth/refresh', api, extraOptions)

    if (refreshResult?.data) {
      // Store the new token
      api.dispatch(setCredentials({ ...refreshResult.data }))
      // Retry original query with new access token
      result = await baseQuery(args, api, extraOptions)
    } else {
      if (refreshResult?.error?.status === 403) {
        refreshResult.error.data.message = 'Your login has expired.'
      }
      return refreshResult
    }
  }
  return result
}

export const apiSlice = createApi({
  baseQuery: baseQueryWithReauth,
  // These are used for cached data. When we invalidate different caches
  // or types, we'll be referring to the Note and User data both.
  tagTypes: ['Note', 'User'],
  // We'll apply extended slices to attach to this API slice later
  // Those  ones are where we'll add details to provide the actual
  // endpoints. This is just a base to start w the API slice we need.
  endpoints: (builder) => ({})
})
// A slice: comes from splitting up redux state objects into multiple slices of state, so a slice is really a collection of reducer logic and actions for a single feature in an app. A blog might have a slice for posts, and another slice for comments. You'd handle the logic of each differently, so they'd easch get their own slice.
