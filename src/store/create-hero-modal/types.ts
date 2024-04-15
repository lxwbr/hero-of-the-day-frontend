export const HERO_HANDLE = 'HERO_HANDLE'
export const MEMBERS = 'MEMBERS'

interface ChangeHandleAction {
  type: typeof HERO_HANDLE
  handle?: string
}

interface MembersAction {
  type: typeof MEMBERS
  members?: string
}

export interface CreateHeroModalState {
  handle?: string
  members?: string
}

export type CreateHeroModalTypes = ChangeHandleAction | MembersAction