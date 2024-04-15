import { RepeatModalTypes, REPEAT_EVERY_N_DAYS_CHANGING, REPEAT_MODAL_VISIBLE } from "./types";

export function setVisibility(visible: boolean): RepeatModalTypes {
    return {
        type: REPEAT_MODAL_VISIBLE,
        visible
    }
}

export function repeatEveryNdaysChanged(repeatEveryNdays: number): RepeatModalTypes {
    return {
        type: REPEAT_EVERY_N_DAYS_CHANGING,
        repeatEveryNdays
    }
}