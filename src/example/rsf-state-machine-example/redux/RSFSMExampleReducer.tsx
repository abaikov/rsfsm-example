import { createReducer } from '@reduxjs/toolkit';
import { IRSFSMExample } from './type/IRSFSExample';
import { ERSFSMExampleState } from './type/ERSFSExampleState';
import { MoveToTheOppositeSideButtonClickAction } from './action/MoveToTheOppositeSideButtonClickAction';
import { SquareMovementDelayTimeoutAction } from './action/SquareMovementDelayTimeoutAction';

const StatesArray = Object.values(ERSFSMExampleState);
const shiftStateByValue = (state: IRSFSMExample, value: number)  => {
    const currentStateIndex = StatesArray.indexOf(state.state);
    state.state = StatesArray[(currentStateIndex + value) % (StatesArray.length)]
}

export const RSFSMExampleReducer = createReducer<IRSFSMExample>(
    {
        state: ERSFSMExampleState.TOP
    }, 
    (builder) => {
        builder
            .addCase(
                MoveToTheOppositeSideButtonClickAction,
                (state) => {
                    shiftStateByValue(state, 2);
                }
            )
            .addCase(
                SquareMovementDelayTimeoutAction,
                (state) => {
                    shiftStateByValue(state, 1);
                }
            )
    }
)
