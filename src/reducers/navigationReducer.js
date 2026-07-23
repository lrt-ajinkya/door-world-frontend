import constants from '../common/constants';

const initialState = {
  drawerOpen: false,
  language: 'en'
}

export default function navigationReducer(state = initialState, action) {
    switch (action.type) {
      case constants.ACTIONS.NAVIGATION.SET_DRAWER_OPEN: {
        return { ...state, drawerOpen: action.open }
      }

      case constants.ACTIONS.NAVIGATION.SET_LANGUAGE: {
        return { ...state, language: action.language }
      }

      default:
        return state
    }
}