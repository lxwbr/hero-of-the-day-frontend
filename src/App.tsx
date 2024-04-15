import React from 'react'
import SignInPage from './components/sign-in-page'
import TeamSchedule from './components/team-schedule'
import HeroesList from './components/heroes-list'
import './App.css'
import { AppState } from './store'
import { AuthState } from './store/auth/types'
import { connect } from 'react-redux'

const mapStateToProps = (state: AppState): AppProps => ({
  auth: state.auth,
  selectedHero: state.heroes.selectedHero
})

interface AppProps {
  auth: AuthState,
  selectedHero?: string
}

const App: React.FC<AppProps> = ({ auth, selectedHero }) =>
  <div className="App">
    <header className="App-header">
    {(auth.gapiAuthResponse || auth.id_token) ? (selectedHero ? <TeamSchedule heroHandle={selectedHero} /> : <HeroesList userEmail={auth.userEmail} userName={auth.userName}/>) : <SignInPage/>}
    </header>
  </div>
  

export default connect(mapStateToProps)(App)