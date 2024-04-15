import { Modal, AutoComplete, message, InputNumber, Icon, Badge, Tooltip } from 'antd'
import React from 'react'
import { ThunkDispatch } from 'redux-thunk'
import { Action } from 'redux'
import { AppState } from '../../store'
import { connect } from 'react-redux'
import { assignEmailAsHero } from '../../thunks'
import moment from 'moment'
import { setVisibilityAssignmentModal } from '../../store/team-schedule/actions'
import { changeAssigningEmail } from '../../store/email-assignment-modal/actions'
import './EmailAssignmentModal.css'
import { Member } from '../../store/team-schedule/types'

const EmailAssignmentModal: React.FC<Props> = ({ visible, confirmLoading, hideAssignmentModal, heroHandle, date, assignEmailAsHero, changeAssigningEmail, email, repeatEveryNdays, members }) => {
  const dataSource = members.map(member => {
    let desc = ""
    let ratio = 0
    if (member.daysSinceFirstDuty > 0) {
      ratio = member.totalDaysOnDuty / member.daysSinceFirstDuty
      desc = `${ratio.toFixed(2)} = ${member.totalDaysOnDuty} / ${member.daysSinceFirstDuty}`
    } else {
      desc = "never been on duty"
    }
    return { value: member.name, text: desc, ratio }
  })
  dataSource.sort((a, b) => (a.ratio > b.ratio) ? 1 : -1)

  const options = dataSource.map(email => (
    <AutoComplete.Option key={email.value} value={email.value}>
      {email.value}
      <span className="certain-search-item-count">{email.text}</span>
    </AutoComplete.Option>
  ))

  return <Modal
    title={
      <div>Which email should be used for @{heroHandle} starting from {date.format('DD MMMM')}? <Tooltip title="Please enter the full email address of the person if the member is new and is not listed in the auto-complete.
          If the person exists a ratio will be displayed. This ratio is result of the working days this person was already a hero and the total days
          since the first time the person was a hero at all."
        ><Icon type="info-circle" theme='twoTone' twoToneColor='#52c41a'></Icon>
        </Tooltip>
      </div>
    }
    visible={visible}
    onOk={() => {
      if (email) {
        if (repeatEveryNdays != null && repeatEveryNdays > 0) {
          message.warn(`Repeating every ${repeatEveryNdays} days not possible yet. This feature is being developed.`)
        }
        assignEmailAsHero(email, repeatEveryNdays)
      }
      hideAssignmentModal()
    }}
    confirmLoading={confirmLoading}
    onCancel={hideAssignmentModal}
  >
    <div className="container">
      <AutoComplete
        className="certain-category-search"
        dropdownClassName="certain-category-search-dropdown"
        dropdownMatchSelectWidth={false}
        dropdownStyle={{ width: 300 }}
        size="large"
        style={{ width: '100%' }}
        dataSource={options}
        onChange={value => changeAssigningEmail(value.toString())}
        value={email}
        placeholder="Email"
        optionLabelProp="value"
      />
    </div>
  </Modal>
}

type Props = StateProps & DispatchProps & ExternalProps

interface StateProps {
  visible: boolean
  email?: string 
  confirmLoading: boolean
  repeatEveryNdays?: number
}

interface DispatchProps {
  assignEmailAsHero: (email: string, repeatEveryNdays?: number) => void
  hideAssignmentModal: () => void
  changeAssigningEmail: (email: string) => void
}

interface ExternalProps {
  heroHandle: string,
  date: moment.Moment
  members: Member[]
}

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, null, Action>, ownProps: ExternalProps): DispatchProps => ({
  assignEmailAsHero: (email: string, repeatEveryNdays?: number) => dispatch(assignEmailAsHero(ownProps.heroHandle, email, ownProps.date, repeatEveryNdays)),
  hideAssignmentModal: () => dispatch(setVisibilityAssignmentModal(false)),
  changeAssigningEmail: (email: string) => dispatch(changeAssigningEmail(email)),
})

const mapStateToProps = (state: AppState): StateProps => ({
  visible: state.teamSchedule.assignmentVisible,
  email: state.assigningEmail.email,
  confirmLoading: false,
  repeatEveryNdays: state.assigningEmail.repeatEveryNdays
})

export default connect(mapStateToProps, mapDispatchToProps)(EmailAssignmentModal)