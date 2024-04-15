export const ASSIGNING_EMAIL = 'ASSIGNING_EMAIL'

interface AssigningEmailAction {
  type: typeof ASSIGNING_EMAIL
  email?: string
}

export interface AssigningEmailState {
  email?: string
  repeatEveryNdays?: number
}

export type AssigningEmailTypes = AssigningEmailAction