import { Button } from 'antd'
import React from 'react'
import { AppState } from '../../store'
import { AuthState } from '../../store/auth/types'
import { UserAgentApplication } from 'msal'
import { connect } from 'react-redux'
import { Dispatch, AnyAction } from 'redux'
import { updateSession } from '../../store/auth/actions'
import { selectHero } from '../../store/heroes-list/actions'

const SignOutButton: React.FC<AppDispatchProps & AppStateProps> = ({ cleanSession, auth }) =>
  <Button type="primary" onClick={ async () => { cleanSession(auth.msAuthInstance) } }>Sign out</Button>

  interface AppDispatchProps {
    cleanSession: (msAuthInstance?: UserAgentApplication) => void
  }

  const mapStateToProps = (state: AppState): AppStateProps => ({
    auth: state.auth
  })
  
  interface AppStateProps {
    auth: AuthState
  }
  
  const mapDispatchToProps = (dispatch: Dispatch<AnyAction>): AppDispatchProps => ({
    cleanSession: (msAuthInstance?: UserAgentApplication) => {
      if (msAuthInstance) {
        msAuthInstance.logout()
      }
      dispatch(updateSession({ gapiAuthResponse: undefined, id_token: undefined, userEmail: undefined, userName: undefined }))
      dispatch(selectHero(undefined))
    }
  })
  
  export default connect(mapStateToProps, mapDispatchToProps)(SignOutButton)