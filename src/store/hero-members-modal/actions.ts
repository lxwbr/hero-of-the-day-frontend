import { SET_HERO_MEMBERS_MODAL_VISIBILITY, HeroMembersModalTypes } from './types'

export function setHeroMembersModalVisibility(visible: boolean): HeroMembersModalTypes {
  return {
    type: SET_HERO_MEMBERS_MODAL_VISIBILITY,
    visible
  }
}
