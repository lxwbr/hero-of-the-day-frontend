import { Modal, Input, message } from 'antd'
import React from 'react'
import { AppState } from '../../store'
import { connect } from 'react-redux'
import { Action } from 'redux'
import { openCreateHeroModal } from '../../store/heroes-list/actions'
import { ThunkDispatch } from 'redux-thunk'
import './CreateHeroModal.css'
import { putHero } from '../../thunks'
import { changeHeroHandle, changeMembers } from '../../store/create-hero-modal/actions'

const CreateHeroModal: React.FC<DispatchProps & StateProps & ExternalProps> = ({ hideModal, addHero, visible, userEmail, heroHandle, members, changeHeroHandle, changeMembers }) =>
<Modal
  title={'Create new Hero'}
  visible={visible}
  onOk={() => {
    if (heroHandle) {
      if (members) {
        addHero(heroHandle, [members])
      } else {
        message.warning('Please enter an email address')
      }
    } else {
      message.warning('Please enter handle name')
    }
  }}
  //confirmLoading={confirmLoading}
  onCancel={hideModal}
>
  <div className='input-container'>
    <Input  
      onChange={value => changeHeroHandle(value.target.value)}
      value={heroHandle}
      placeholder='Name of the Handle created in Slack, e.g. hero-of-the-day'/>
    <Input
      onChange={value => changeMembers(value.target.value)}
      value={members}
      defaultValue={userEmail}
      placeholder='Email of first user to be member of the Handle, e.g. bob@test.io'/>
  </div>
</Modal>

  interface DispatchProps {
    hideModal: () => void,
    addHero: (handle: string, members: string[]) => void,
    changeHeroHandle: (handle: string) => void,
    changeMembers: (members: string) => void
  }

  interface ExternalProps {
    userEmail?: string
  }

  interface StateProps {
    visible: boolean,
    heroHandle?: string,
    members?: string
  }
  
  const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, null, Action>, ownProps: ExternalProps): DispatchProps => ({
    hideModal: () => dispatch(openCreateHeroModal(false)),
    addHero: (handle, members) => dispatch(putHero(handle, members)).then(() => dispatch(openCreateHeroModal(false))),
    changeHeroHandle: (handle) => dispatch(changeHeroHandle(handle)),
    changeMembers: (handle) => dispatch(changeMembers(handle))
  })
  
  const mapStateToProps = (state: AppState): StateProps => ({
    visible: state.heroes.createHeroModalVisible,
    heroHandle: state.createHero.handle,
    members: state.createHero.members
  })
  
  export default connect(mapStateToProps, mapDispatchToProps)(CreateHeroModal)