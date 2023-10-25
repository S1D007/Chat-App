import '@/styles/globals.css'
import { redirect, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useStore } from '../../suppliers/zustand'
import { useRouter } from 'next/router'

export default function App({ Component, pageProps }) {

  const pathname = usePathname()

  const { isUserAuthenticated, checkUserAlreadyAuthenticated, getMyProfile, user, getUsers, getChats, getAvailableUsers } = useStore()

  const router = useRouter()

  useEffect(() => {
    checkUserAlreadyAuthenticated()
  }, [isUserAuthenticated])

  useEffect(() => {
    if (!user && isUserAuthenticated) {
      getMyProfile();
    }
  }, [user, isUserAuthenticated]);


  useEffect(() => {
    if (isUserAuthenticated) {
      getChats()
      getUsers()
      getAvailableUsers()
    }
  }, [isUserAuthenticated]);

  // check if user is authenticated then push him to / page if he is trying to access / page without authentication he will be redirected to /signin page and if he succesfully signup then he will be redirected to / page
  useEffect(() => {
    if (pathname === '/' && isUserAuthenticated) {
      return
    } else if (pathname === '/' && !isUserAuthenticated) {
      router.push('/signin')
    } else if (pathname === '/signin' && isUserAuthenticated) {
      router.push('/')
    } else if (pathname === '/signup' && isUserAuthenticated) {
      router.push('/')
    }
  }, [pathname, isUserAuthenticated])

  return <>
    <ToastContainer />
    <Component {...pageProps} />
  </>
}
