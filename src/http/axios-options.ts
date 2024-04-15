import { store } from '..'

interface Options {
  headers: {
    Authorization: string
  }
}

export default (): Options => {
  const getIdToken = () => {
    const authResponse = store.getState().auth.gapiAuthResponse
    if (authResponse) {
      return authResponse.id_token
    } else {
      return store.getState().auth.id_token
    }
  }

  return {
    headers: { Authorization: `Bearer ${getIdToken()}` }
  }
}