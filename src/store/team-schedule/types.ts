import moment from 'moment'

export const FETCH_TEAM_SCHEDULE = 'FETCH_TEAM_SCHEDULE'
export const FETCH_HERO_MEMBERS = 'FETCH_HERO_MEMBERS'
export const START_FETCHING_TEAM_SCHEDULE = 'START_FETCHING_TEAM_SCHEDULE'
export const SELECT_DATE = 'SELECT_DATE'
export const VISIBILITY_ASSIGNMENT_MODAL = 'VISIBILITY_ASSIGNMENT_MODAL'
export const DUTY_ADDED = 'DUTY_ADDED'
export const DUTY_REMOVED = 'DUTY_REMOVED'
export const MEMBER_REMOVED = 'MEMBER_REMOVED'

interface StartFetchingTeamScheduleAction {
  type: typeof START_FETCHING_TEAM_SCHEDULE
  pending: boolean
}

interface ToggleAssignmentModalAction {
  type: typeof VISIBILITY_ASSIGNMENT_MODAL
  visible: boolean
}

interface FetchTeamScheduleAction {
  type: typeof FETCH_TEAM_SCHEDULE
  duties: Duty[]
}

interface SelectDateAction {
  type: typeof SELECT_DATE
  date?: moment.Moment
}

interface DutyAddedAction {
  type: typeof DUTY_ADDED
  date: moment.Moment,
  email: string
}

interface DutyRemovedAction {
  type: typeof DUTY_REMOVED,
  date: moment.Moment,
  email: string
}

interface HeroFetchedAction {
  type: typeof FETCH_HERO_MEMBERS,
  members: Member[],
  channel?: string
}

export interface Duty {
  day: moment.Moment,
  emails: string[],
  repeats?: number
}

export interface RepeatedDuty {
  day: moment.Moment,
  emails: string[],
  repeats: number
}

export interface MemberRemovedAction {
  type: typeof MEMBER_REMOVED
  members: Member[]
}

export interface TeamScheduleState {
  pending: boolean,
  duties: Duty[],
  selectedDate?: moment.Moment,
  assignmentVisible: boolean,
  members: Member[],
  channel?: string
}

export interface Member {
  name: string
  daysSinceFirstDuty: number
  totalDaysOnDuty: number
}

export type TeamScheduleTypes = MemberRemovedAction | FetchTeamScheduleAction | StartFetchingTeamScheduleAction | SelectDateAction | ToggleAssignmentModalAction | DutyAddedAction | DutyRemovedAction | HeroFetchedAction