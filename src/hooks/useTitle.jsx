import { useEffect } from 'react'

const useTitle = (title) => {
  useEffect(() => {
    const prevTitle = document.title
    document.title = title

    // when the component unmounts, restore previous title to what it originally was
    return () => {
      document.title = prevTitle
    }
  }, [title])
}

export default useTitle
