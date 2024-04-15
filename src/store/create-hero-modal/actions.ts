import { HERO_HANDLE, MEMBERS, CreateHeroModalTypes } from './types'

export function changeHeroHandle(handle?: string): CreateHeroModalTypes {
  return {
    type: HERO_HANDLE,
    handle
  }
}

export function changeMembers(members?: string): CreateHeroModalTypes {
  return {
    type: MEMBERS,
    members
  }
}