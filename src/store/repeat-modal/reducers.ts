import { 
    RepeatModalState,
    RepeatModalTypes,
    REPEAT_EVERY_N_DAYS_CHANGING,
    REPEAT_MODAL_VISIBLE
  } from './types'
  
  const initialState: RepeatModalState = {
    visible: false,
    repeatEveryNdays: 0
  }
  
  export function repeatModalReducer(
    state = initialState,
    action: RepeatModalTypes
  ): RepeatModalState {
    switch (action.type) {
      case REPEAT_EVERY_N_DAYS_CHANGING: {
        return {
          ...state,
          repeatEveryNdays: action.repeatEveryNdays
        }
      }
      case REPEAT_MODAL_VISIBLE: {
        return {
            ...state,
            visible: action.visible
          }
      }
      default:
        return state
    }
  }