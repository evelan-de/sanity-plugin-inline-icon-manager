import {useAppStore} from '../store'

const sanityToast = useAppStore.getState().sanityToast

export const toastError = (e: unknown): void => {
  let message
  if (typeof e === 'string') {
    message = e
  }
  if (e instanceof Error) {
    message = e.message
  }
  console.error(e)
  if (sanityToast)
    sanityToast.push({status: 'error', title: 'Something Went Wrong', description: message})
}