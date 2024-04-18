import { message } from 'antd'
import { Action, ActionCreator } from 'redux'
import request from 'request'
import { scheduleFetched, pendingScheduleFetched, dutyAdded, dutyRemvoed as dutyRemoved, heroFetched, heroMemberRemoved } from './store/team-schedule/actions'
import { heroCreated, heroDeleted, heroesFetched, pendingHeroesFetched } from './store/heroes-list/actions'
import { AppState } from './store'
import { ThunkAction } from 'redux-thunk'
import getOptions from './http/request-options'
import moment from 'moment-timezone'
import bmoment from 'moment-business-days'

const originV2 = process.env.REACT_APP_API_URL

export const thunkFetchSchedule: ActionCreator<ThunkAction<Promise<Action>, AppState, null, Action<string>>> = (
  heroHandle: string
) => async dispatch => {
  if (process.env.NODE_ENV === 'development') {
    return dispatch(
      scheduleFetched([{
        day: moment().hour(0).minute(0).second(0),
        emails: [
          'alex.werner@test.io',
          'bruce.wayne@test.io'
        ],
        repeats: 14
      },
      {
        day: moment().hour(0).minute(0).second(0).add(7, 'days'),
        emails: [
          'batman.bat@test.io',
          'riddler.rid@test.io'
        ]
      },
      {
        day: moment().hour(0).minute(0).second(0).add(2, 'days'),
        emails: [
          'joker@test.io'
        ],
        repeats: 4
      },
      {
        day: moment().hour(0).minute(0).second(0).add(16, 'days'),
        emails: [
          'alex.werner@test.io'
        ],
      },])
    )
  } else {
    dispatch(pendingScheduleFetched(true))
    return new Promise((resolve, reject) => {
      request.get(`${originV2}/schedule/${heroHandle}`, getOptions(), (error, response, body) => {
        dispatch(pendingScheduleFetched(false))
        if (error) {
          message.error(error)
          reject(error)
        } else if (response.statusCode !== 200) {
          message.error(response.body.message)
          reject(response.body.message)
        } else {
          const schedules: { hero: string, assignees: string[], shift_start_time: string, repeated?: number }[] = JSON.parse(body)
          resolve(dispatch(
            scheduleFetched(schedules.map(schedule => ({ day: moment(schedule.shift_start_time), emails: schedule.assignees })))
          ))
        }
      })
    })
  }
}

export const thunkFetchHero: ActionCreator<ThunkAction<Promise<Action>, AppState, null, Action<string>>> = (
  heroHandle: string
) => async dispatch => {
  return new Promise((resolve, reject) => {
    if (process.env.NODE_ENV === 'development') {
      return dispatch(
        heroFetched({
          members: [
            { name: 'alex@test.io', daysSinceFirstDuty: 5, totalDaysOnDuty: 2 },
            { name: 'bruce@test.io', daysSinceFirstDuty: 0, totalDaysOnDuty: 0 }
          ],
          channel: "FOOBAR"
        })
      )
    } else {
      request.get(`${originV2}/hero/${heroHandle}`, getOptions(), (error, response, body) => {
        if (error) {
          message.error(error)
          reject(error)
        } else if (response.statusCode !== 200) {
          message.error(response.body.message)
          reject(response.body.message)
        } else {
          const { members, channel }: { members: string[], channel?: string } = JSON.parse(body)
          request.get(`${originV2}/hero/${heroHandle}/punch-clock/stats`, getOptions(), (punchError, punchResponse, punchBody) => {
            if (punchError == null && punchResponse.statusCode === 200) {
              const { punch_cards, current_schedule }: {
                punch_cards: Array<{ days: number, first_punch: number, last_punch: number, member: string }>,
                current_schedule: { assignees: string[], shift_start_time: string }
              } = JSON.parse(punchBody)
              resolve(dispatch(
                heroFetched({ members:
                  members.map(name => {
                    const existingPunchCard = punch_cards.find(punchCard => punchCard.member === name)
                    if (existingPunchCard != null) {
                      let daysSinceFirstDuty = bmoment().businessDiff(bmoment(existingPunchCard.first_punch * 1000))
  
                      let totalDaysOnDuty = existingPunchCard.days
  
                      if (current_schedule.assignees.indexOf(name) >= 0) {
                        totalDaysOnDuty = totalDaysOnDuty + bmoment().businessDiff(moment(current_schedule.shift_start_time))
                      }
  
                      return { name, daysSinceFirstDuty, totalDaysOnDuty }
                    } else {
                      return { name, daysSinceFirstDuty: 0, totalDaysOnDuty: 0 }
                    }
                  }),
                  channel
                })
              ))
            } else {
              resolve(dispatch(
                heroFetched({
                  members: members.map(name => ({ name, daysSinceFirstDuty: 0, totalDaysOnDuty: 0 })),
                  channel
                })
              ))
            }
          })
        }
      })
    }
  })
}

export const thunkFetchHeroes: ActionCreator<ThunkAction<Promise<Action>, AppState, null, Action<string>>> = () =>
  async dispatch => {
    if (process.env.NODE_ENV === 'development') {
      return dispatch(
        heroesFetched([
          { name: 'dispatcher-of-the-week', members: ['alex@test.io'] },
          { name: 'pa-android-of-the-week', members: [] },
          { name: 'pa-android-of-the-week', members: [] },
          { name: 'pa-android-of-the-week', members: [] },
          { name: 'pa-android-of-the-week', members: [] },
          { name: 'pa-android-of-the-week', members: [] },
          { name: 'pa-android-of-the-week', members: [] },
          { name: 'pa-android-of-the-week', members: [] }
        ])
      )
    } else {
      return new Promise((resolve, reject) => {
        dispatch(pendingHeroesFetched(true))

        /*
        axios.get(`${originV1}/hero/list`, getAxiosOptions()).then((response) => {
          dispatch(pendingHeroesFetched(false))
          if (response.status !== 200) {
            message.error(response.data)
            reject(response.data)
          } else {
            const parsed: Array<{ name: string, members: string[] }> = JSON.parse(response.data)
            resolve(dispatch(
              heroesFetched(parsed)
            ))
          }
        })
        .catch((error) => {
          dispatch(pendingHeroesFetched(false))
          message.error(error)
          reject(error)
        })
        */

        request.get(`${originV2}/hero/list`, getOptions(), (error, response, body) => {
          dispatch(pendingHeroesFetched(false))
          if (error) {
            message.error(error)
            reject(error)
          } else if (response.statusCode !== 200) {
            message.error(response.body.message)
            reject(response.body.message)
          } else {
            const parsed: Array<{ name: string, members: string[] }> = JSON.parse(body)
            resolve(dispatch(
              heroesFetched(parsed)
            ))
          }
        })
      })
    }
  }

export const assignEmailAsHero: ActionCreator<ThunkAction<Promise<{}>, AppState, null, Action<string>>> = (heroHandle: string, email: string, date: moment.Moment, repeatEveryNdays: number) =>
  async dispatch => {
    return new Promise((resolve, reject) => {
      request.post(`${originV2}/schedule/${heroHandle}`, {
        ...getOptions(),
        json: {
          assignees: [email],
          shift_start_time: date,
          timezone: moment.tz.guess(),
          operation: "ADD",
          repeat_every_n_days: repeatEveryNdays
        }
      }, (error, response) => {
        if (error) {
          message.error(error)
          reject(error)
        } else if (response.statusCode !== 200) {
          message.error(response.body.message)
          reject(response.body.message)
        } else {
          resolve(dispatch(dutyAdded({
            date,
            email
          })))
        }
      })
    })
  }

export const removeHeroAssignment: ActionCreator<ThunkAction<Promise<{}>, AppState, null, Action<string>>> = (heroHandle: string, email: string, date: moment.Moment) =>
  async dispatch => {
    return new Promise((resolve, reject) => {
      request.post(`${originV2}/schedule/${heroHandle}`, {
        ...getOptions(),
        json: {
          assignees: [email],
          shift_start_time: date,
          timezone: moment.tz.guess(),
          operation: "DELETE"
        }
      }, (error, response, body) => {
        if (error) {
          message.error(error)
          reject(error)
        } else if (response.statusCode !== 200) {
          message.error(response.body.message)
          reject(response.body.message)
        } else {
          resolve(dispatch(dutyRemoved({
            date,
            email
          })))
        }
      })
    })
  }

export const putHero: ActionCreator<ThunkAction<Promise<{}>, AppState, null, Action<string>>> = (heroHandle: string, members: string[], channel: string | undefined) =>
  async dispatch => {
    if (process.env.NODE_ENV === 'development') {
      console.info(`Debugging ${heroHandle}`)
      return dispatch(
        heroCreated({
          heroHandle,
          members
        })
      )
    } else {
      return new Promise((resolve, reject) => {
        return request.put(`${originV2}/hero/${heroHandle}`, {
          ...getOptions(),
          json: {
            members,
            channel
          }
        }, (error, response, body) => {
          if (error) {
            console.error(error)
            reject(error)
          } else if (response.statusCode !== 200) {
            console.error(response.body.message)
            reject(response.body.message)
          } else {
            resolve(dispatch(heroCreated({
              heroHandle,
              members
            })))
          }
        })
      })
    }
  }

  export const removeHeroMemberAction: ActionCreator<ThunkAction<Promise<{}>, AppState, null, Action<string>>> = (heroHandle: string, member: string) =>
    async dispatch => {
      return new Promise((resolve, reject) => {
        if (process.env.NODE_ENV === 'development') {
          console.info(`Debugging ${heroHandle}`)
          return dispatch(
            heroMemberRemoved({
              members: [{ name: 'alex@test.io', daysSinceFirstDuty: 0, totalDaysOnDuty: 0 }]
            })
          )
        } else {
          request.delete(`${originV2}/hero/${heroHandle}/members/${member}`, {
            ...getOptions()
          }, (error, response, body) => {
            if (error) {
              message.error(error)
              reject(error)
            } else if (response.statusCode !== 200) {
              message.error(response.body.message)
              reject(response.body.message)
            } else {
              const members = JSON.parse(body)
              resolve(dispatch(heroMemberRemoved({
                members
              })))
            }
          })
        }
      })
    }

export const deleteHeroAction: ActionCreator<ThunkAction<Promise<{}>, AppState, null, Action<string>>> = (heroHandle: string) =>
  async dispatch => {
    return new Promise((resolve, reject) => {
      if (process.env.NODE_ENV === 'development') {
        console.info(`Debugging ${heroHandle}`)
        return dispatch(
          heroDeleted(heroHandle)
        )
      } else {
        request.delete(`${originV2}/hero/${heroHandle}`, {
          ...getOptions()
        }, (error, response, body) => {
          if (error) {
            message.error(error)
            reject(error)
          } else if (response.statusCode !== 200) {
            message.error(response.body.message)
            reject(response.body.message)
          } else {
            resolve(dispatch(heroDeleted(heroHandle)))
          }
        })
      }
    })
  }
