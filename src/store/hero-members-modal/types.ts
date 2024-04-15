export const SET_HERO_MEMBERS_MODAL_VISIBILITY = 'SET_HERO_MEMBERS_MODAL_VISIBILITY'

interface ChangeVisibleAction {
  type: typeof SET_HERO_MEMBERS_MODAL_VISIBILITY
  visible: boolean
}

export interface HeroMembersModalState {
  visible: boolean,
}

export type HeroMembersModalTypes = ChangeVisibleAction