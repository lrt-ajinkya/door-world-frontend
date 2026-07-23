import constants from '../common/constants';

const initialState = {
  selectedUser: '',
  snackbarOpen: false,
  snackbarSeverity: 'info', //warning, success, info, error
  snackbarText: ''
}

export default function appReducer(state = initialState, action) {
    switch (action.type) {
      case constants.ACTIONS.APP.SET_SNACKBAR_TEXT: {
        return { ...state, snackbarText: action.snackbarText }
      }

      case constants.ACTIONS.APP.SET_SNACKBAR_SEVERITY: {
        return { ...state, snackbarSeverity: action.snackbarSeverity }
      }

      case constants.ACTIONS.APP.SET_SELECTED_USER: {
        return { ...state, selectedUser: action.userId }
      }

      case constants.ACTIONS.APP.CLOSE_SNACKBAR:
      case constants.ACTIONS.APP.OPEN_SNACKBAR: {
        return { ...state, snackbarOpen: action.snackbarOpen }
      }

      default:
        return state
    }
}