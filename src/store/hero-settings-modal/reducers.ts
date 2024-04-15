import { HeroSettingsModalTypes, HeroSettingsModalState, SET_HERO_SETTINGS_MODAL_VISIBILITY } from './types'

const initialState: HeroSettingsModalState = {
  visible: false,
}

export function heroSettingsModalReducer(
  state = initialState,
  action: HeroSettingsModalTypes
): HeroSettingsModalState {
  switch (action.type) {
    case SET_HERO_SETTINGS_MODAL_VISIBILITY: {
      return {
        ...state,
        visible: action.visible
      }
    }
    default:
      return state
  }
}