export const SET_RELEASE_NOTES_MODAL_VISIBILITY = 'SET_RELEASE_NOTES_MODAL_VISIBILITY'

interface ReleaseNotesVisibleAction {
  type: typeof SET_RELEASE_NOTES_MODAL_VISIBILITY
  visible: boolean
}

export interface ReleaseNotesModalState {
  visible: boolean,
}

export type ReleaseNotesModalTypes = ReleaseNotesVisibleAction