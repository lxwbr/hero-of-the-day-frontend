import {
  AssigningEmailTypes,
  AssigningEmailState,
  ASSIGNING_EMAIL
} from './types'

const initialState: AssigningEmailState = {
  email: undefined
}

export function assigningEmailReducer(
  state = initialState,
  action: AssigningEmailTypes
): AssigningEmailState {
  switch (action.type) {
    case ASSIGNING_EMAIL: {
      return {
        ...state,
        email: action.email
      }
    }
    default:
      return state
  }
}