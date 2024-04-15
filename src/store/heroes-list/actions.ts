import { FETCH_HEROES, START_FETCHING_HEROES, HeroesListTypes, SELECT_HERO, OPEN_CREATE_HERO_MODAL, HERO_CREATED, HERO_DELETED } from './types'

export function pendingHeroesFetched(pending: boolean): HeroesListTypes {
  return {
    type: START_FETCHING_HEROES,
    pending
  }
}

export function heroesFetched(heroes: Array<{ name: string, members: string[] }>): HeroesListTypes {
  return {
    type: FETCH_HEROES,
    heroes
  }
}

export function selectHero(hero?: string): HeroesListTypes {
  return {
    type: SELECT_HERO,
    hero
  }
}

export function openCreateHeroModal(open: boolean): HeroesListTypes {
  return {
    type: OPEN_CREATE_HERO_MODAL,
    open
  }
}

export function heroCreated({ heroHandle, members }: { heroHandle: string, members: string[] }): HeroesListTypes {
  return {
    type: HERO_CREATED,
    hero: { name: heroHandle, members }
  }
}

export function heroDeleted(name: string): HeroesListTypes {
  return {
    type: HERO_DELETED,
    hero: { name }
  }
}