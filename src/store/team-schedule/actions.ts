import moment from 'moment'
import { FETCH_TEAM_SCHEDULE, FETCH_HERO_MEMBERS, DUTY_REMOVED, START_FETCHING_TEAM_SCHEDULE, TeamScheduleTypes, Duty, SELECT_DATE, VISIBILITY_ASSIGNMENT_MODAL, DUTY_ADDED, MEMBER_REMOVED, Member } from './types'

export function pendingScheduleFetched(pending: boolean): TeamScheduleTypes {
  return {
    type: START_FETCHING_TEAM_SCHEDULE,
    pending
  }
}

export function scheduleFetched(duties: Duty[]): TeamScheduleTypes {
  return {
    type: FETCH_TEAM_SCHEDULE,
    duties
  }
}

export function heroFetched({ members, channel }: { members: Member[], channel?: string }): TeamScheduleTypes {
  return {
    type: FETCH_HERO_MEMBERS,
    members,
    channel
  }
}

export const selectDate = (date?: moment.Moment): TeamScheduleTypes => ({
  type: SELECT_DATE,
  date
})

export const dutyAdded = ({ date, email }: { date: moment.Moment, email: string }): TeamScheduleTypes => ({
  type: DUTY_ADDED,
  date,
  email
})

export const dutyRemvoed = ({ date, email }: { date: moment.Moment, email: string }) => ({
  type: DUTY_REMOVED,
  date,
  email
})

export const setVisibilityAssignmentModal = (visible: boolean): TeamScheduleTypes => ({
  type: VISIBILITY_ASSIGNMENT_MODAL,
  visible
})

export function heroMemberRemoved({ members }: { members: Member[] }): TeamScheduleTypes {
  return {
    type: MEMBER_REMOVED,
    members
  }
}