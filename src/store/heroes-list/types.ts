export const FETCH_HEROES = 'FETCH_HEROES'
export const START_FETCHING_HEROES = 'START_FETCHING_HEROES'
export const SELECT_HERO = 'SELECT_HERO'
export const OPEN_CREATE_HERO_MODAL = 'OPEN_CREATE_HERO_MODAL'
export const HERO_CREATED = 'HERO_CREATED'
export const HERO_DELETED = 'HERO_DELETED'

interface PendingFetchingHeroesAction {
  type: typeof START_FETCHING_HEROES
  pending: boolean
}

interface FetchHeroesAction {
  type: typeof FETCH_HEROES
  heroes: Array<{ name: string, members: string[] }>
}

interface SelectHeroAction {
  type: typeof SELECT_HERO
  hero?: string
}

interface OpenCreateHeroModalAction {
  type: typeof OPEN_CREATE_HERO_MODAL
  open: boolean
}

interface HeroCreatedAction {
  type: typeof HERO_CREATED
  hero: { name: string, members: string[] }
}

interface HeroDeletedAction {
  type: typeof HERO_DELETED
  hero: { name: string }
}

export interface HeroesListState {
  pending: boolean,
  heroes: Array<{ name: string, members: string[] }>,
  selectedHero?: string,
  createHeroModalVisible: boolean
}

export type HeroesListTypes = HeroDeletedAction | HeroCreatedAction | FetchHeroesAction | PendingFetchingHeroesAction | SelectHeroAction | OpenCreateHeroModalAction