    import constants from '../common/constants';

export function setSelectedUser(userId) {
    return { type: constants.ACTIONS.APP.SET_SELECTED_USER, userId }
}

export function openSnackbar() {
    return { type: constants.ACTIONS.APP.OPEN_SNACKBAR, snackbarOpen: true }
}

export function closeSnackbar() {
    return { type: constants.ACTIONS.APP.CLOSE_SNACKBAR, snackbarOpen: false }
}

export function setSnackbarSeverity(snackbarSeverity) {
    return { type: constants.ACTIONS.APP.SET_SNACKBAR_SEVERITY, snackbarSeverity }
}

export function setSnackbarText(snackbarText) {
    return { type: constants.ACTIONS.APP.SET_SNACKBAR_TEXT, snackbarText }
}