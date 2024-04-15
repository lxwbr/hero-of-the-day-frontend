import { HeroMembersModalTypes, HeroMembersModalState, SET_HERO_MEMBERS_MODAL_VISIBILITY } from './types'

const initialState: HeroMembersModalState = {
  visible: false,
}

export function heroMembersModalReducer(
  state = initialState,
  action: HeroMembersModalTypes
): HeroMembersModalState {
  switch (action.type) {
    case SET_HERO_MEMBERS_MODAL_VISIBILITY: {
      return {
        ...state,
        visible: action.visible
      }
    }
    default:
      return state
  }
}