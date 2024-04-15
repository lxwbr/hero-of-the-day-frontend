export const REPEAT_MODAL_VISIBLE = 'REPEAT_MODAL_VISIBLE'
export const REPEAT_EVERY_N_DAYS_CHANGING = 'REPEAT_EVERY_N_DAYS_CHANGING'

interface RepeatEveryNdaysAction {
    type: typeof REPEAT_EVERY_N_DAYS_CHANGING
    repeatEveryNdays: number
}

interface RepeatModalVisibleAction {
    type: typeof REPEAT_MODAL_VISIBLE
    visible: boolean
}

export interface RepeatModalState {
    visible: boolean,
    repeatEveryNdays: number
}

export type RepeatModalTypes = RepeatEveryNdaysAction | RepeatModalVisibleAction