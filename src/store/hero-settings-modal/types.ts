export const SET_HERO_SETTINGS_MODAL_VISIBILITY = 'SET_HERO_SETTINGS_MODAL_VISIBILITY'

interface ChangeVisibleAction {
  type: typeof SET_HERO_SETTINGS_MODAL_VISIBILITY
  visible: boolean
}

export interface HeroSettingsModalState {
  visible: boolean,
}

export type HeroSettingsModalTypes = ChangeVisibleAction