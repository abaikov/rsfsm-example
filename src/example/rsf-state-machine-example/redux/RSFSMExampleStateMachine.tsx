// import { RSFiniteStateMachine } from 'redux-saga-finite-state-machine';
import { TReduxStoreState } from '../../redux/type/TReduxStoreState';
import { ERSFSMExampleState } from './type/ERSFSExampleState';
import { cancel, delay, fork, join, put, race, select, take } from 'redux-saga/effects';
import { MoveToTheOppositeSideButtonClickAction } from './action/MoveToTheOppositeSideButtonClickAction';
import { SquareMovementDelayTimeoutAction } from './action/SquareMovementDelayTimeoutAction';
import { Task } from 'redux-saga';
import { RSFiniteStateMachine } from 'redux-saga-finite-state-machine';

const TIMEOUT = 3000;
const createRSFSMExampleStateStateSaga = (props: {
    message: string
}) => {
    return function* () {
        const state: ERSFSMExampleState = yield select((state: TReduxStoreState) => state.rsfsmExample.state);
        // Here we can check if we call a correct saga for our current state
        console.log('LOG FROM MACHINE STATE: ' + props.message);
        console.log('AND ACTUAL STORE STATE IS: ' + state);

        // And here are our actual actions
        const task: Task = yield fork(function* () {
            yield delay(TIMEOUT);
            yield put(SquareMovementDelayTimeoutAction());
        });
        yield race([
            join(task),
            take(MoveToTheOppositeSideButtonClickAction.type)
        ])
        yield cancel(task);
    }
}

export const RSFSMExampleStateMachine = new RSFiniteStateMachine({
    stateSelector: (state: TReduxStoreState) => {
        return state.rsfsmExample.state;
    },
    states: {
        // Let's ensure that we handle all possible states
        [ERSFSMExampleState.TOP]: createRSFSMExampleStateStateSaga({
            message: ERSFSMExampleState.TOP 
        }),
        [ERSFSMExampleState.RIGHT]: createRSFSMExampleStateStateSaga({
            message: ERSFSMExampleState.RIGHT
        }),
        [ERSFSMExampleState.BOTTOM]: createRSFSMExampleStateStateSaga({
            message: ERSFSMExampleState.BOTTOM
        }),
        [ERSFSMExampleState.LEFT]: createRSFSMExampleStateStateSaga({
            message: ERSFSMExampleState.LEFT
        }),
    }
})
