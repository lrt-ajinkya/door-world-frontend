import { combineReducers } from '@reduxjs/toolkit';
import newSpecificationReducer from './newSpecificationReducer';
import mySpecificationsReducer from './mySpecificationsReducer';
import myDraftsReducer from './myDraftsReducer';
import navigationReducer from './navigationReducer';
import appReducer from './appReducer';

const rootReducer = combineReducers({
    mySpecs: mySpecificationsReducer,
    newSpec: newSpecificationReducer,
    myDrafts: myDraftsReducer,
    navigation: navigationReducer,
    app: appReducer,
})

export default rootReducer;