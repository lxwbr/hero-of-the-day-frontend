/* global gapi */

import {
  AuthState,
  AuthTypes,
  UPDATE_SESSION
} from './types'

const dummyAuthResponse: gapi.auth2.AuthResponse = {
  access_token: 'foobar',
  id_token: 'foobar',
  login_hint: 'foobar',
  scope: 'foobar',
  expires_in: 0,
  first_issued_at: 0,
  expires_at: 0
}

const initialState: AuthState = process.env.NODE_ENV === 'development' ? {
  gapiAuthResponse: dummyAuthResponse,
  id_token: undefined,
  msAuthInstance: undefined,
  userEmail: 'alex@test.io',
  userName: 'Alex'
} : {
  gapiAuthResponse: undefined,
  id_token: undefined,
  msAuthInstance: undefined,
  userEmail: undefined,
  userName: undefined
}

export function authReducer(
  state = initialState,
  action: AuthTypes
): AuthState {
  switch (action.type) {
    case UPDATE_SESSION: {
      return {
        ...state,
        ...action.payload
      }
    }
    default:
      return state
  }
}