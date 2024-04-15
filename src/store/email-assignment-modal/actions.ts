import { ASSIGNING_EMAIL, AssigningEmailTypes } from './types'

export function changeAssigningEmail(email?: string): AssigningEmailTypes {
  return {
    type: ASSIGNING_EMAIL,
    email
  }
}
