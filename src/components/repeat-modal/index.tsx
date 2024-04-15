import { Modal, InputNumber } from 'antd'
import React from 'react'
import { AppState } from '../../store'
import { connect } from 'react-redux'
import { Action } from 'redux'
import { ThunkDispatch } from 'redux-thunk'
import { repeatEveryNdaysChanged, setVisibility } from '../../store/repeat-modal/actions'

const CreateHeroModal: React.FC<DispatchProps & StateProps & ExternalProps> = ({ hideModal, visible, repeatValue, changeRepeatEveryNdays }) =>
<Modal
  title={'Repeat'}
  visible={visible}
  onOk={() => {
    
  }}
  //confirmLoading={confirmLoading}
  onCancel={hideModal}
>
  <div className='input-container'>
    <div>Repeat every: <InputNumber min={0} size="small" defaultValue={0} value={repeatValue} onChange={value => {
      if (value != null) {
        changeRepeatEveryNdays(value)
      }
    }} /> days.</div>
  </div>
</Modal>

  interface DispatchProps {
    hideModal: () => void,
    changeRepeatEveryNdays: (n: number) => void
  }

  interface ExternalProps {

  }

  interface StateProps {
    visible: boolean,
    repeatValue: number,
  }
  
  const mapDispatchToProps = (dispatch: ThunkDispatch<AppState, null, Action>, ownProps: ExternalProps): DispatchProps => ({
    hideModal: () => dispatch(setVisibility(false)),
    changeRepeatEveryNdays: (n) => dispatch(repeatEveryNdaysChanged(n))
  })
  
  const mapStateToProps = (state: AppState): StateProps => ({
    visible: state.repeatModal.visible,
    repeatValue: state.repeatModal.repeatEveryNdays
  })
  
  export default connect(mapStateToProps, mapDispatchToProps)(CreateHeroModal)