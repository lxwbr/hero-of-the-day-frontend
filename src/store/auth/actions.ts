import { AuthState, UPDATE_SESSION, AuthTypes } from './types'

export function updateSession(authState: AuthState): AuthTypes {
  return {
    type: UPDATE_SESSION,
    payload: authState
  }
}