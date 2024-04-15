import {
  TeamScheduleState,
  TeamScheduleTypes,
  FETCH_TEAM_SCHEDULE,
  START_FETCHING_TEAM_SCHEDULE,
  SELECT_DATE,
  VISIBILITY_ASSIGNMENT_MODAL,
  DUTY_ADDED,
  DUTY_REMOVED,
  Duty,
  FETCH_HERO_MEMBERS,
  MEMBER_REMOVED
} from './types'

const initialState: TeamScheduleState = {
  pending: false,
  duties: [],
  selectedDate: undefined,
  assignmentVisible: false,
  members: [],
  channel: undefined
}

export function teamScheduleReducer(
  state = initialState,
  action: TeamScheduleTypes
): TeamScheduleState {
  switch (action.type) {
    case FETCH_TEAM_SCHEDULE: {
      return {
        ...state,
        duties: action.duties
      }
    }
    case FETCH_HERO_MEMBERS: {
      return {
        ...state,
        members: action.members,
        channel: action.channel
      }
    }
    case START_FETCHING_TEAM_SCHEDULE: {
      return {
        ...state,
        pending: action.pending
      }
    }
    case SELECT_DATE: {
      return {
        ...state,
        selectedDate: action.date
      }
    }
    case VISIBILITY_ASSIGNMENT_MODAL: {
      return {
        ...state,
        assignmentVisible: action.visible
      }
    }
    case DUTY_ADDED: {
      return {
        ...state,
        duties: state.duties.find(duty => duty.day.isSame(action.date, 'day')) ? state.duties.reduce(
          (prev, cur) => {
            if (cur.day.isSame(action.date, 'day')) {
              return [...prev, {
                day: cur.day,
                emails: [...cur.emails, action.email]
              }]
            } else {
              return [...prev, cur]
            }
          }, new Array<Duty>()) : [...state.duties, { day: action.date, emails: [action.email] }]
      }
    }
    case DUTY_REMOVED: {
      return {
        ...state,
        duties: state.duties.reduce(
          (prev, cur) => {
            if (cur.day.isSame(action.date, 'day')) {
              const leftEmails = cur.emails.filter(email => email !== action.email)
              if (leftEmails.length > 0) {
                return [...prev, {
                  day: cur.day,
                  emails: leftEmails
                }]
              } else {
                return prev
              }
            } else {
              return [...prev, cur]
            }
          }, new Array<Duty>())
      }
    }
    case MEMBER_REMOVED: {
      return {
        ...state,
        members: action.members
      }
    }
    default:
      return state
  }
}