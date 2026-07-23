import constants from '../common/constants';

const initialState = {
  specifications: [],
  specification: {}
}

export default function mySpecificationsReducer(state = initialState, action) {
    switch (action.type) {
      case constants.ACTIONS.MY_SPECIFICATIONS.SET_SPECIFICATIONS: {
        return { ...state, specifications: action.specifications }
      }
  
      case constants.ACTIONS.MY_SPECIFICATIONS.SET_SPECIFICATION: {
        return { ...state, specification: action.specification }
      }

      default:
        return state
    }
}