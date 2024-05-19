import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from './api/apiSlice'

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true
})

// A store is a JS object that holds the state of an application. It's a container that holds the state, actions and reducers that make up an app. The store has several responsibilities, including holding the state, updating the state, registering listener callbacks (through subscribe(listener)), and unregistering listeners
/* 
Using Redux requires the same consistent set of steps: 
1) Create a Redux store
2) Subscribe to updates
3) Inside the subscription callback:
  a) Get the current store state
  b) Extract the data needed by this piece of the UI
  c) Update the UI with the data
4) If necessary, render the UI with initial state
5) Respond to UI inputs by dispatching Redux actions

Store: globalized JS object that holds all the data/state for the application
Reducer: pure function that updates the app state when it receives actions. Checks which action occurred, and based on the action it updates the store.
Action: what tells a reducer to manipulate the store data; carries the name and (optionally) some data. Eg: event click
Dispatch: How we execute the action; eg: Dispatch the action to the reducer, then reducer checks what to do & store gets updated.

Reducer is usually a switch statement that switches between all possible actions (cases) and then manipulates the store data based on the action. When reducer data changes within redux, the properties in your components are changed and then re-rendering occurs.

*/
