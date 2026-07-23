import constants from '../common/constants';

const initialState = {
  drafts: [],
}

export default function myDraftsReducer(state = initialState, action) {
    switch (action.type) {
      case constants.ACTIONS.MY_DRAFTS.SET_DRAFTS: {
        return { ...state, drafts: action.drafts }
      }

      default:
        return state
    }
}