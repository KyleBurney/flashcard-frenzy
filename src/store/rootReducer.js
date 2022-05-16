import { combineReducers } from 'redux';
import ui from './uiReducer';
import storage from './storageReducer';

const rootReducer = combineReducers({
    ui,
    storage
});

export default rootReducer;