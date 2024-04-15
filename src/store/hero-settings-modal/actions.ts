import { SET_HERO_SETTINGS_MODAL_VISIBILITY, HeroSettingsModalTypes } from './types'

export function setHeroSettingsModalVisibility(visible: boolean): HeroSettingsModalTypes {
  return {
    type: SET_HERO_SETTINGS_MODAL_VISIBILITY,
    visible
  }
}
