import { ReleaseNotesModalTypes, ReleaseNotesModalState, SET_RELEASE_NOTES_MODAL_VISIBILITY } from './types'

const initialState: ReleaseNotesModalState = {
  visible: true,
}

export function releaseNotesModalReducer(
  state = initialState,
  action: ReleaseNotesModalTypes
): ReleaseNotesModalState {
  switch (action.type) {
    case SET_RELEASE_NOTES_MODAL_VISIBILITY: {
      return {
        ...state,
        visible: action.visible
      }
    }
    default:
      return state
  }
}