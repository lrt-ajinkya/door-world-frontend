import constants from '../common/constants';

export function setDrawerOpen(open) {
    return { type: constants.ACTIONS.NAVIGATION.SET_DRAWER_OPEN, open }
}

export function setLanguage(language) {
    return { type: constants.ACTIONS.NAVIGATION.SET_LANGUAGE, language }
}