import { Button, Input, Modal } from 'antd'
import React from 'react'
import { AppState } from '../../store'
import { connect } from 'react-redux'
import { Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import './HeroSettingsModal.css'
import { setHeroSettingsModalVisibility } from '../../store/hero-settings-modal/actions'
import { putHero, removeHeroMemberAction } from '../../thunks'
import { Member } from '../../store/team-schedule/types'

const HeroSettingsModal: React.FC<DispatchProps & StateProps & ExternalProps> = ({ hideModal, visible, heroName, channel, members, removeMember, updateHero }) =>
<Modal
  className="modal"
  title={`${heroName} settings`}
  visible={visible}
  onOk={() => {
    updateHero(members, channel)
  }}
  onCancel={hideModal}
>
  <div className='container'>
    <div>Channel: </div>
    <Input defaultValue={channel} readOnly={true}></Input>
    <div className="members">
    <div>Members: </div>
    {members.map(member =>
      <div className="member"><Input value={member.name} readOnly={true}/>
      <Button type="danger" onClick={() => removeMember(member.name)} icon="delete" size="default" /></div>)
    }
  </div>
  </div>
</Modal>

  interface DispatchProps {
    hideModal: () => void,
    updateHero: (members: Member[], channel?: string) => void,
    removeMember: (member: string) => void
  }

  interface ExternalProps {
    heroName?: string
  }

  interface StateProps {
    visible: boolean,
    members: Member[],
    channel?: string
  }
  
  const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, null, Action>, ownProps: ExternalProps): DispatchProps => ({
    hideModal: () => dispatch(setHeroSettingsModalVisibility(false)),
    updateHero: (members, channel) => dispatch(putHero(ownProps.heroName, members, channel)).then(() => dispatch(setHeroSettingsModalVisibility(false))),
    removeMember: (member) => dispatch(removeHeroMemberAction(ownProps.heroName, member))
  })
  
  const mapStateToProps = (state: AppState): StateProps => ({
    visible: state.heroSettingsModal.visible,
    channel: state.teamSchedule.channel,
    members: state.teamSchedule.members
  })
  
  export default connect(mapStateToProps, mapDispatchToProps)(HeroSettingsModal)