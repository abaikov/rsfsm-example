import React from 'react';
import './App.css';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { RSFStateMachineExampleScreen } from './example/rsf-state-machine-example/RSFStateMachineExampleScreen';
import { ReduxStoreCombinedReducer } from './example/redux/ReduxStoreCombinedReducer';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import { fork } from 'redux-saga/effects';
import { exampleStateMachineEngine } from './example/redux/ExampleStateMachineEngine';

const sagaMiddleware = createSagaMiddleware();
const store = configureStore({
    reducer: ReduxStoreCombinedReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
        .concat(sagaMiddleware),
})

sagaMiddleware.run(function*() {
    // We need this to be able to run sagas from components
    yield fork(exampleStateMachineEngine.start());

    // But if you want just to use the machine all of the time
    // You can call it like this and remove useEffect from RSFStateMachineExampleScreen
    // yield all([
    //     takeEvery(
    //         MoveToTheOppositeSideButtonClickAction.type, 
    //         RSFiniteStateMachineEngine.runStateMachine(RSFSMExampleStateMachine, {
    //             cancelSelector: SquareMovementDelayTimeoutAction.type
    //         })
    //     )
    // ])
});

function App() {
    return (
        <Provider store={store}>
            <HashRouter>
                <Routes>
                    <Route path='/' element={
                        <RSFStateMachineExampleScreen key='RSFStateMachineExampleScreen'/>
                    }/>
                </Routes>
            </HashRouter>
        </Provider>
    );
}

export default App;
