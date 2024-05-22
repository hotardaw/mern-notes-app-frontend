import { store } from '../../app/store'
import { notesApiSlice } from '../notes/notesApiSlice'
import { usersApiSlice } from '../users/usersApiSlice'
import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

const Prefetch = () => {
  useEffect(() => {
    console.log('subscribing')
    // Manual subscriptions to notes & users:
    // Use the apiSlice, then call endpoints, then call the actual query we want, then the initiate method creates the manual subscription.
    const notes = store.dispatch(notesApiSlice.endpoints.getNotes.initiate())
    const users = store.dispatch(usersApiSlice.endpoints.getUsers.initiate())

    // Unsubscribe method:
    return () => {
      console.log('unsubscribing')
      notes.unsubscribe()
      users.unsubscribe()
    }
  }, [])

  return <Outlet />
}

export default Prefetch
