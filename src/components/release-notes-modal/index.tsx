import { Modal } from 'antd'
import React from 'react'
import { AppState } from '../../store'
import { setReleaseNotesModalVisibility } from '../../store/release-notes-modal/actions'
import { connect } from 'react-redux'
import { Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'

const CreateReleaseNotesModal: React.FC<DispatchProps & StateProps> = ({ hideModal, visible }) =>
  <Modal
    title={'Release notes'}
    visible={visible}
    onOk={hideModal}
    onCancel={hideModal}
  >
    Release notes
  </Modal>

interface DispatchProps {
  hideModal: () => void,
}

interface StateProps {
  visible: boolean
}

const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, null, Action>): DispatchProps => ({
  hideModal: () => dispatch(setReleaseNotesModalVisibility(false)),
})

const mapStateToProps = (state: AppState): StateProps => ({
  visible: state.releaseNotesModal.visible,
})

export default connect(mapStateToProps, mapDispatchToProps)(CreateReleaseNotesModal)