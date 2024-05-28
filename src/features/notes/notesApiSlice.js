import { createSelector, createEntityAdapter } from '@reduxjs/toolkit'
import { apiSlice } from '../../app/api/apiSlice'

// Entity adapter: allows us to use normalized state
// So we should now work with data that has an IDs array &
// also has entities. Entities can't be iterated over but IDs can,
// so we'll use the IDs to get data from the entities.

// sortComparer sorts completed notes under incompleted notes btw
const notesAdapter = createEntityAdapter({
  sortComparer: (a, b) =>
    a.completed === b.completed ? 0 : a.completed ? 1 : -1
})

const initialState = notesAdapter.getInitialState()
// I THINK the providesTags and invalidatesTags here are used to control caching. If it's a "providesTags" it'll add cache-ability for this data entry, and if it's a "invalidatesTags" it'll remove cache-ability for that data entry. Tags are effectively 'labels' attached to cached data that's read post-mutation, to decide whether the data should be affected by the mutation.
export const notesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getNotes: builder.query({
      query: () => ({
        url: '/notes',
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError
        }
      }),
      transformResponse: (responseData) => {
        const loadedNotes = responseData.map((note) => {
          note.id = note._id
          return note
        })
        return notesAdapter.setAll(initialState, loadedNotes)
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: 'Note', id: 'LIST' },
            ...result.ids.map((id) => ({ type: 'Note', id }))
          ]
        } else return [{ type: 'Note', id: 'LIST' }]
      }
    }),
    addNewNote: builder.mutation({
      query: (initialNote) => ({
        url: '/notes',
        method: 'POST',
        body: {
          ...initialNote
        }
      }),
      invalidatesTags: [
        {
          type: 'Note',
          id: 'LIST'
        }
      ]
    }),
    updateNote: builder.mutation({
      query: (initialNote) => ({
        url: '/notes',
        method: 'PATCH',
        body: {
          ...initialNote
        }
      }),
      invalidatesTags: (result, error, arg) => [
        {
          type: 'Note',
          id: arg.id
        }
      ]
    }),
    deleteNote: builder.mutation({
      query: ({ id }) => ({
        url: `/notes`,
        method: 'DELETE',
        body: { id }
      }),
      invalidatesTags: (result, error, arg) => [
        {
          type: 'Note',
          id: arg.id
        }
      ]
    })
    // deleteNote
  })
})

export const {
  useGetNotesQuery,
  useAddNewNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation
} = notesApiSlice

// returns the query result object
export const selectNotesResult = notesApiSlice.endpoints.getNotes.select()

// creates memoized selector
const selectNotesData = createSelector(
  selectNotesResult,
  (notesResult) => notesResult.data // normalized state object with ids & entities
)

//getSelectors creates these selectors and we rename them with aliases using destructuring
export const {
  selectAll: selectAllNotes,
  selectById: selectNoteById,
  selectIds: selectNoteIds
  // Pass in a selector that returns the notes slice of state
} = notesAdapter.getSelectors((state) => selectNotesData(state) ?? initialState)
