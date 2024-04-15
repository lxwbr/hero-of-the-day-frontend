import moment from 'moment'
import React from 'react'
import SignOutButton from '../sign-out-button'
import { Button, Calendar, PageHeader, Tag, Modal, message } from 'antd'
import 'moment/locale/en-gb'
import { Action } from 'redux'
import EmailAssignmentModal from '../email-assignment-modal'
import { thunkFetchSchedule, removeHeroAssignment, thunkFetchHero, deleteHeroAction } from '../../thunks'
import { connect } from 'react-redux'
import { AppState } from '../../store'
import { ThunkDispatch } from 'redux-thunk'
import { Duty, Member, RepeatedDuty } from '../../store/team-schedule/types'
import './TeamSchedule.css'
import { selectDate, setVisibilityAssignmentModal } from '../../store/team-schedule/actions'
import { selectHero } from '../../store/heroes-list/actions'
import HeroMembersModal from '../hero-members-modal'
import { setHeroMembersModalVisibility } from '../../store/hero-members-modal/actions'
import { setVisibility } from '../../store/repeat-modal/actions'
import RepeatModal from '../repeat-modal'
import { setHeroSettingsModalVisibility } from '../../store/hero-settings-modal/actions'
import HeroSettingsModal from '../hero-settings-modal'

type Props = DispatchProps & StateProps & ExternalProps

interface ExternalProps {
  heroHandle: string
}

interface StateProps {
  userEmail?: string,
  duties: Duty[],
  pending: boolean,
  selectedDate?: moment.Moment
  members: Member[],
  channel?: string
}

const { confirm } = Modal;

const showConfirm = (heroName: string, unselectHero: () => void, deleteHero: (name: string) => void) => {
  confirm({
    title: `Do you really want to delete ${heroName}?`,
    content: 'This will delete the handle and all schedules. The deletion is not revertable.',
    okType: "danger",
    onOk() {
      deleteHero(heroName)
    },
    onCancel() {
      console.log('Cancel');
    },
  });
};

interface DispatchProps {
  fetchSchedule: () => Promise<Action>
  fetchMembers: () => Promise<Action>
  selectDate: (date?: moment.Moment) => void
  showAssignmentModal: () => void
  showMembersModal: () => void
  showHeroSettingsModal: () => void
  removeHeroAssignment: (email: string, date: moment.Moment) => void
  unselectHero: () => void
  deleteHero: () => void
  showRepeatableModal: () => void
}

class TeamSchedule extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    this.shouldComponentRender = this.shouldComponentRender.bind(this);
  }

  componentWillMount() {
    const { fetchSchedule, fetchMembers } = this.props
    fetchSchedule()
    fetchMembers()
  }

  shouldComponentRender() {
    const { pending } = this.props
    return !pending
  }

  render() {
    const { duties, heroHandle, selectedDate, showAssignmentModal, selectDate, removeHeroAssignment, members, unselectHero, deleteHero, userEmail, showRepeatableModal } = this.props

    if (!this.shouldComponentRender()) {
      return (
        <div className="main-container">
          <PageHeader
            onBack={unselectHero}
            className="site-page-header"
            title={`${heroHandle} schedule`}
            subTitle="Click on a day to switch the assignment"
            extra={
              <SignOutButton/>
            }
          />
          <div className="loading">Loading schedule...</div>
        </div>
      )
    } else {
      return (
        <div className="main-container">
          <PageHeader
            onBack={unselectHero}
            className="site-page-header"
            title={`${heroHandle} schedule`}
            subTitle="Click on a day to switch the assignment"
            extra={
              <div className="buttons-container">
                <Button type="primary" onClick={ async () => { this.props.showHeroSettingsModal() } }>Settings</Button>
                <Button type="danger" onClick={() => showConfirm(heroHandle, unselectHero, deleteHero)}>Delete hero</Button>
                <SignOutButton/>
              </div>
            }
          />
          <Calendar
            dateCellRender={dateCellRender(duties, removeHeroAssignment, showRepeatableModal, userEmail)}
            onSelect={date => {
              showAssignmentModal()
              if (date != null) {
                selectDate(date.hour(0).minute(0).second(0).millisecond(0))
              }
            }}
          />
          {selectedDate ? <EmailAssignmentModal heroHandle={heroHandle} date={selectedDate} members={members}/> : <div/>}
          {<HeroMembersModal heroName={heroHandle}/>}
          {<HeroSettingsModal heroName={heroHandle}/>}
          {<RepeatModal/>}
        </div>
      )
    }    
  }
}

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, null, Action>, ownProps: ExternalProps): DispatchProps => ({
  fetchSchedule: () => dispatch(thunkFetchSchedule(ownProps.heroHandle)),
  fetchMembers: () => dispatch(thunkFetchHero(ownProps.heroHandle)),
  selectDate: (date?: moment.Moment) => dispatch(selectDate(date)),
  showAssignmentModal: () => dispatch(setVisibilityAssignmentModal(true)),
  showMembersModal: () => {
    dispatch(thunkFetchHero(ownProps.heroHandle))
    dispatch(setHeroMembersModalVisibility(true))
  },
  removeHeroAssignment: (email: string, date: moment.Moment) => dispatch(removeHeroAssignment(ownProps.heroHandle, email, date)),
  unselectHero: () => dispatch(selectHero(undefined)),
  deleteHero: () => dispatch(deleteHeroAction(ownProps.heroHandle)).then(() => dispatch(selectHero(undefined))),
  showRepeatableModal: () => dispatch(setVisibility(true)),
  showHeroSettingsModal: () => dispatch(setHeroSettingsModalVisibility(true)),
})

const mapStateToProps = (state: AppState): StateProps => ({
  userEmail: state.auth.userEmail,
  duties: state.teamSchedule.duties,
  pending: state.teamSchedule.pending,
  selectedDate: state.teamSchedule.selectedDate,
  members: state.teamSchedule.members,
  channel: state.teamSchedule.channel
})

const capitalizeFirstLetter = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

const onlyUnique = (value: string, index: number, array: string[]) => {
  return array.indexOf(value) === index;
}

const dateCellRender = (duties: Duty[], removeHeroAssignment: (email: string, date: moment.Moment) => void, showRepeatableModal: () => void, userEmail?: string) => (value: moment.Moment) => {
  const colors = ['green', 'orange', 'blue', 'purple', 'black', 'pink', 'teal', 'brown', 'navy']

  const repeatedFlag = false

  const emails = duties.reduce((acc, duty) => {
    return duty.emails.reduce((acc2, email) => {
      if (acc2.indexOf(email) > 0) {
        return acc2
      } else {
        return [...acc2, email]
      }
    }, acc)
  }, new Array<string>())
  emails.sort()

  const generateNames = (input: [string, string][]) => {
    const map = new Map<string, string>(input)

    const names = Array.from(map.values())
    map.forEach((v, k, m) => {
      if (names.filter(n => n == v).length > 1) {
        const iLastName = k.indexOf('.')
        m.set(k, `${capitalizeFirstLetter(v)} ${capitalizeFirstLetter(k.substring(iLastName + 1, iLastName + 2))}`)
      } else {
        m.set(k, capitalizeFirstLetter(v))
      }
    })
    return map
  }

  const names = generateNames(emails.map(email => {
    const noDomain = email.substring(0, email.indexOf('@'))
    const iDot = noDomain.indexOf('.')
    if (iDot > 0) {
      return [email, noDomain.substring(0, iDot)]
    } else {
      return [email, noDomain]
    }
  }))

  const repeatable = repeatedFlag ? duties.reduce((acc, duty) => {
    if (duty.repeats) {
      return [...acc, { day: duty.day, emails: duty.emails, repeats: duty.repeats }]
    } else {
      return acc
    }
  }, new Array<RepeatedDuty>()) : []

  const foundRepeatable = repeatedFlag ? repeatable.find(duty => {
    const diff = value.diff(duty.day, 'days')
    if (duty.repeats > diff) {
      return false
    } else {
      return diff > 0 && diff % duty.repeats == 0
    }
  }) : undefined

  const foundDuty = duties.find(duty => {
    return duty.day.isSame(value, 'day')
  })

  const earliesDuty = duties.length > 0 ? duties.reduce((acc: Duty | undefined, cur) => {
    if (cur.day.isBefore(value, 'day') && (acc == null || cur.day.isAfter(acc.day, 'day'))) {
      return cur
    } else {
      return acc
    }
  }, undefined) : undefined

  const earliesRepeatable = repeatedFlag && repeatable.length > 0 && !foundRepeatable ? repeatable.reduce((acc: { d: Duty, m: moment.Moment } | undefined, cur) => {
    const diff = value.diff(cur.day, 'days')
    if (diff > 0) {
      if (cur.repeats > diff) {
        return acc
      } else {
        const sub = diff % cur.repeats
        const earliest = value.clone().subtract(sub, 'days')

        if (acc == null || cur.day.isBefore(value, 'day') && earliest.isAfter(acc.m, 'day')) {
          return { d: cur, m: earliest }
        } else {
          return acc
        }
      }
    } else {
      return acc
    }
  }, earliesDuty ? { d: earliesDuty, m: earliesDuty.day } : undefined) : undefined

  if (foundDuty) {
    return (
      <div className='day'>
        { foundDuty.emails.map(email => {
          const name = names.get(email)
          const emailColor = colors[emails.indexOf(email) % colors.length]
          return (
            <Tag 
              className={`tag-${emailColor}`}
              key={`${foundDuty.day}${email}`}
              closable={true}
              onClose={(e: Event) => {
                e.preventDefault()
                e.stopPropagation()
                removeHeroAssignment(email, value.hour(0).minute(0).second(0).millisecond(0))
              }
            }>
              {name ? name : email}
            </Tag>
          )
        })
      }
      {repeatedFlag ? <Button className='repeat' type={foundDuty.repeats ? 'danger' : 'primary'} onClick={e => {
        e.stopPropagation()
        if (userEmail == 'alex@test.io') {
          showRepeatableModal()
        } else {
          message.warn('Sorry, this feature is currently beta tested.')
        }
      }} icon="retweet" size="small" /> : <div/>}
      </div>
    )
  } else if (foundRepeatable) {
    return (
      <div>
        { foundRepeatable.emails.map(email => {
          const name = names.get(email)
          const emailColor = colors[emails.indexOf(email) % colors.length]
          return (
            <Tag className={`tag-${emailColor}-inverted`} key={`${foundRepeatable.day}${email}`}>
              {name ? name : email}
            </Tag>
          )
        })}
        <Button className='repeat' type='dashed' onClick={e => {
        e.stopPropagation()
        if (userEmail == 'alex@test.io') {
          showRepeatableModal()
        } else {
          message.warn('Sorry, this feature is currently beta tested.')
        }
      }
      } icon="retweet" size="small" />
      </div>
    )
  } else if (earliesRepeatable) {
    return (
      <div>
        { earliesRepeatable.d.emails.map(email => {
          const name = names.get(email)
          const emailColor = colors[emails.indexOf(email) % colors.length]
          return (
            <Tag className={`tag-${emailColor}-inverted`} key={`${earliesRepeatable.m}${email}`}>
              {name ? name : email}
            </Tag>
          )
        })}
      </div>
    )
  } else if (earliesDuty != null) {
    return (
      <div>
        { earliesDuty.emails.map(email => {
          const name = names.get(email)
          const emailColor = colors[emails.indexOf(email) % colors.length]
          return (
            <Tag className={`tag-${emailColor}-inverted`} key={`${earliesDuty.day}${email}`}>
              {name ? name : email}
            </Tag>
          )
        })}
      </div>
    )
  } else {
    return <div/>
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TeamSchedule)