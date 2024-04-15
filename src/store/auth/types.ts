/* global gapi */

import { UserAgentApplication } from 'msal'

export const UPDATE_SESSION = 'UPDATE_SESSION'

interface UpdateSessionAction {
  type: typeof UPDATE_SESSION
  payload: AuthState
}

export interface AuthState {
  id_token?: string,
  gapiAuthResponse?: gapi.auth2.AuthResponse,
  msAuthInstance?: UserAgentApplication,
  userEmail?: string,
  userName?: string
}

export type AuthTypes = UpdateSessionAction