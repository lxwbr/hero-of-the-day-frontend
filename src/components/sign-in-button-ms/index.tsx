import React from 'react'
import { AuthResponse, AuthError, UserAgentApplication } from 'msal'
import { User } from '@microsoft/microsoft-graph-types'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { AuthTypes, AuthState } from '../../store/auth/types'
import { updateSession } from '../../store/auth/actions'
import MicrosoftLogin from 'react-microsoft-login'

const REACT_APP_MS_CLIENT_ID = process.env.REACT_APP_MS_CLIENT_ID
if (!REACT_APP_MS_CLIENT_ID) {
  throw new Error('REACT_APP_MS_CLIENT_ID is not set')
}
const REACT_APP_MS_TENANT_URL = process.env.REACT_APP_MS_TENANT_URL
if (!REACT_APP_MS_TENANT_URL) {
  throw new Error('REACT_APP_MS_TENANT_URL is not set')
}
const REACT_APP_MS_REDIRECT_URI = process.env.REACT_APP_MS_REDIRECT_URI
if (!REACT_APP_MS_REDIRECT_URI) {
  throw new Error('REACT_APP_MS_REDIRECT_URI is not set')
}

const SignInButton: React.FC<AppProps> = ({ updateSession }) =>
  <MicrosoftLogin
    clientId={REACT_APP_MS_CLIENT_ID}
    authCallback={(err: AuthError | null, data?: AuthResponse | (AuthResponse & User), instance?: UserAgentApplication) => {
      if (data && instance) {
        updateSession({
          id_token: data.idToken.rawIdToken,
          msAuthInstance: instance,
          userEmail: data.idToken.preferredName,
          userName: data.idToken.name
        })
      } else {
        console.log(err, data)
      }
    }}
    redirectUri={REACT_APP_MS_REDIRECT_URI}
    tenantUrl={REACT_APP_MS_TENANT_URL}
/>

interface AppProps {
  updateSession: typeof updateSession
}

const mapDispatchToProps = (dispatch: Dispatch<AuthTypes>): AppProps => ({
  updateSession: (authState: AuthState) => dispatch(updateSession(authState))
})

export default connect(undefined, mapDispatchToProps)(SignInButton)
