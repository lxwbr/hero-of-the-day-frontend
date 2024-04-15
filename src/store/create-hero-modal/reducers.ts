import {
  CreateHeroModalTypes,
  CreateHeroModalState,
  HERO_HANDLE,
  MEMBERS
} from './types'

const initialState: CreateHeroModalState = {
  handle: undefined,
  members: undefined,
}

export function createHeroModalReducer(
  state = initialState,
  action: CreateHeroModalTypes
): CreateHeroModalState {
  switch (action.type) {
    case HERO_HANDLE: {
      return {
        ...state,
        handle: action.handle
      }
    }
    case MEMBERS: {
      return {
        ...state,
        members: action.members
      }
    }
    default:
      return state
  }
}