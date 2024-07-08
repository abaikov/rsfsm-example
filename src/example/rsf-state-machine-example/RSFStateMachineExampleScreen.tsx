import * as React from 'react';
import './RSFStateMachineExampleScreen.css';
import { useDispatch, useSelector } from 'react-redux';
import { TReduxStoreState } from '../redux/type/TReduxStoreState';
import { ERSFSMExampleState } from './redux/type/ERSFSExampleState';
import { exampleStateMachineEngine } from '../redux/ExampleStateMachineEngine';
import { RSFSMExampleStateMachine } from './redux/RSFSMExampleStateMachine';
import { MoveToTheOppositeSideButtonClickAction } from './redux/action/MoveToTheOppositeSideButtonClickAction';

export const RSFStateMachineExampleScreen = React.memo(() => {
    const state = useSelector((state: TReduxStoreState) => state.rsfsmExample.state);
    const dispatch = useDispatch();

    React.useEffect(() => {
        // WE CALL IT WITHOUT PROPS THIS TIME
        const stop = exampleStateMachineEngine.runMachineWithProps(RSFSMExampleStateMachine);
        // INITIAL STATE IS 'TOP', SO LETS CHANGE IT
        // REDUX SAGA WILL RUN ASYNCHRONOUSLY, SO WE WILL CATCH
        // OUR ACTUAL STATE AFTER THE DISPATCH
        // DON'T FORGET TO DISABLE STRICT MODE OR IT'LL HAPPEN TWICE
        dispatch(MoveToTheOppositeSideButtonClickAction());

        // DON'T FORGET TO STOP YOUR MACHINE
        return () => {
            stop();
        }
    }, []);

    return <div className='rsfs-example'>
        <div className='rsfs-example__title'>
            <b>
                REACT-REDUX-FINITE-STATE-MACHINE DEMO
            </b>
            <br />
            The square moves in a circle, changing its position every 3 seconds. 
            <br/>
            You can use the "Move to the opposite side" button to disrupt its movement.
        </div>
        <div className='rsfs-example__box-wrapper'>
            <div 
                className='rsfs-example__box'
                style={{
                    top: state === ERSFSMExampleState.BOTTOM ? 'auto' : 0,
                    right: state === ERSFSMExampleState.LEFT ? 'auto' : 0,
                    bottom: state === ERSFSMExampleState.TOP ? 'auto' : 0,
                    left: state === ERSFSMExampleState.RIGHT ? 'auto' : 0,
                }}
            >
                {state}
            </div>
        </div>
        <div className='rsfs-example__button-wrapper'>
            <button onClick={() => {
                dispatch(MoveToTheOppositeSideButtonClickAction());
            }}>
                Move to the opposite side
            </button>
        </div>
    </div>
})
