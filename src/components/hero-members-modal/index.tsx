import { Modal, Button, Input } from 'antd'
import React from 'react'
import { AppState } from '../../store'
import { connect } from 'react-redux'
import { Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import './HeroMembersModal.css'
import { setHeroMembersModalVisibility } from '../../store/hero-members-modal/actions'
import { removeHeroMemberAction } from '../../thunks'
import { Member } from '../../store/team-schedule/types'

const HeroMembersModal: React.FC<DispatchProps & StateProps & ExternalProps> = ({ hideModal, visible, heroName, members, removeMember }) =>
<Modal
  className="modal"
  title={`Manage ${heroName} members`}
  visible={visible}
  onOk={() => {
    hideModal()
  }}
  onCancel={hideModal}
>
  <div className="members">
    {members.map(member =>
      <div className="member"><Input value={member.name} readOnly={true}/>
      <Button type="danger" onClick={() => removeMember(member.name)} icon="delete" size="default" /></div>)
    }
  </div>
</Modal>

  interface DispatchProps {
    hideModal: () => void,
    removeMember: (member: string) => void
  }

  interface ExternalProps {
    heroName?: string
  }

  interface StateProps {
    visible: boolean,
    members: Member[]
  }
  
  const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, null, Action>, ownProps: ExternalProps): DispatchProps => ({
    hideModal: () => dispatch(setHeroMembersModalVisibility(false)),
    removeMember: (member) => dispatch(removeHeroMemberAction(ownProps.heroName, member))
  })
  
  const mapStateToProps = (state: AppState): StateProps => ({
    visible: state.heroMembersModal.visible,
    members: state.teamSchedule.members
  })
  
  export default connect(mapStateToProps, mapDispatchToProps)(HeroMembersModal)