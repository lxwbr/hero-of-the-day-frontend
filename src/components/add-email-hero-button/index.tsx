import { Button } from 'antd'
import React from 'react'
import { connect } from 'react-redux'
import { Action } from 'redux'
import moment from 'moment'
import { ThunkDispatch } from 'redux-thunk'
import { AppState } from '../../store';
import { setVisibilityAssignmentModal } from '../../store/team-schedule/actions'

const AddEmailHeroButton: React.FC<Props> = ({ heroHandle, date, showAssignmentModal }) => {
  if (date != null) {
    return <Button type="primary" onClick={ async () => {
      showAssignmentModal()
    } }>Add colleague as @{heroHandle} starting from {date.format('DD-MM-YYYY')}</Button>
  } else {
    return <div/>
  }
}

type Props = ExternalProps & DispatchProps

interface ExternalProps {
  heroHandle: string,
  date: moment.Moment
}

interface DispatchProps {
  showAssignmentModal: () => void
}

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, null, Action>): DispatchProps => ({
  showAssignmentModal: () => dispatch(setVisibilityAssignmentModal(true))
})

export default connect(undefined, mapDispatchToProps)(AddEmailHeroButton)