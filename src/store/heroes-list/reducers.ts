import {
  HeroesListTypes,
  HeroesListState,
  FETCH_HEROES,
  START_FETCHING_HEROES,
  SELECT_HERO,
  HERO_CREATED,
  OPEN_CREATE_HERO_MODAL,
  HERO_DELETED
} from './types'

const initialState: HeroesListState = {
  pending: false,
  heroes: [],
  selectedHero: undefined,
  createHeroModalVisible: false
}

export function heroesReducer(
  state = initialState,
  action: HeroesListTypes
): HeroesListState {
  switch (action.type) {
    case FETCH_HEROES: {
      return {
        ...state,
        heroes: action.heroes
      }
    }
    case START_FETCHING_HEROES: {
      return {
        ...state,
        pending: action.pending
      }
    }
    case SELECT_HERO:
      return {
        ...state,
        selectedHero: action.hero
      }
    case OPEN_CREATE_HERO_MODAL:
      return {
        ...state,
        createHeroModalVisible: action.open
      }
    case HERO_CREATED:
      return {
        ...state,
        heroes: [action.hero, ...state.heroes]
      }
    case HERO_DELETED:
      console.log(`before: ${JSON.stringify(state.heroes.map(a => a.name))}`)
      console.log(`after: ${JSON.stringify(state.heroes.filter(({name}) => name !== action.hero.name).map(a => a.name))}`)
      return {
        ...state,
        heroes: state.heroes.filter(({name}) => name !== action.hero.name)
      }
    default:
      return state
  }
}