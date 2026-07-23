import constants from '../common/constants';

export function setDrafts(drafts) {
    return { type: constants.ACTIONS.MY_DRAFTS.SET_DRAFTS, drafts }
}

