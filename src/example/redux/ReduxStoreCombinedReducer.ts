import { combineReducers } from 'redux';
import { RSFSMExampleReducer } from '../rsf-state-machine-example/redux/RSFSMExampleReducer';

export const ReduxStoreCombinedReducer = combineReducers({
    rsfsmExample: RSFSMExampleReducer
})
