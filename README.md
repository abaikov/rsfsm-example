# Demo poroject for redux-saga-finite-state-machine

This project is a demo project for redux-saga-finite-state-machine(https://github.com/abaikov/redux-saga-finite-state-machine)

Live version: https://abaikov.github.io/rsfsm-example/

## State managment with state machines

Redux reducer

```javascript
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
```

State machine

```javascript
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
```

Component

```javascript
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
```

# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
