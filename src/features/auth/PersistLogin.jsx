import { Outlet, Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { useRefreshMutation } from './authApiSlice'
import usePersist from '../../hooks/usePersist'
import { useSelector } from 'react-redux'
import { selectCurrentToken } from './authSlice'

// import React from 'react'

const PersistLogin = () => {
  const [persist] = usePersist()
  const token = useSelector(selectCurrentToken)
  const effectRan = useRef(false)

  const [trueSuccess, setTrueSuccess] = useState(false)

  // Refresh mutation:
  const [refresh, { isUninitialized, isLoading, isSuccess, isError, error }] =
    useRefreshMutation()

  useEffect(() => {
    if (effectRan.current === true || process.env.NODE_ENV !== 'development') {
      // Because React 18's Strict Mode only happens in development
      const verifyRefreshToken = async () => {
        console.log('verifying refresh token')
        try {
          // const response =
          await refresh()
          // const {accessToken} =response.data
          setTrueSuccess(true)
        } catch (err) {
          console.error(err)
        }
      }
      // There will be no token if you refresh the page, thus wiping the state out.
      //
      if (!token && persist) verifyRefreshToken()
    }
    return () => (effectRan.current = true)
    // eslint-disable-next-line
  }, [])

  let content
  if (!persist) {
    // persist: no
    console.log('no persist')
    content = <Outlet />
  } else if (isLoading) {
    //persist: yes, token: no
    console.log('loading')
    content = <p>Loading...</p>
  } else if (isError) {
    //persist: yes, token: no
    console.log('error')
    content = (
      <p className="errmsg">
        {error.data?.message}
        <Link to="/login">Please login again</Link>.
      </p>
    )
  } else if (isSuccess && trueSuccess) {
    //persist: yes, token: yes
    console.log('success')
    content = <Outlet />
  } else if (token && isUninitialized) {
    //persist: yes, token: yes
    console.log('token and uninit')
    console.log(isUninitialized)
    content = <Outlet />
  }

  return content
}

export default PersistLogin
