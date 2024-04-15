import { combineReducers } from 'redux'
import { authReducer } from './auth/reducers'
import { teamScheduleReducer } from './team-schedule/reducers'
import { heroesReducer } from './heroes-list/reducers'
import { assigningEmailReducer } from './email-assignment-modal/reducers'
import { createHeroModalReducer } from './create-hero-modal/reducers'
import { heroMembersModalReducer } from './hero-members-modal/reducers'
import { repeatModalReducer } from './repeat-modal/reducers'
import { heroSettingsModalReducer } from './hero-settings-modal/reducers'

export const rootReducer = combineReducers({
  auth: authReducer,
  teamSchedule: teamScheduleReducer,
  heroes: heroesReducer,
  assigningEmail: assigningEmailReducer,
  createHero: createHeroModalReducer,
  heroMembersModal: heroMembersModalReducer,
  heroSettingsModal: heroSettingsModalReducer,
  repeatModal: repeatModalReducer
})

export type AppState = ReturnType<typeof rootReducer>