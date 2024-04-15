import { store } from '..'

interface Options {
  auth: {
    bearer: string
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
    auth: {
      bearer: `${getIdToken()}`
    }
  }
}