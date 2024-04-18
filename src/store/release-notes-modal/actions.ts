import { SET_RELEASE_NOTES_MODAL_VISIBILITY, ReleaseNotesModalTypes } from './types'

export function setReleaseNotesModalVisibility(visible: boolean): ReleaseNotesModalTypes {
  return {
    type: SET_RELEASE_NOTES_MODAL_VISIBILITY,
    visible
  }
}
