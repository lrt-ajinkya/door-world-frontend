import constants from '../common/constants';

export function setSpecifications(specifications) {
    return { type: constants.ACTIONS.MY_SPECIFICATIONS.SET_SPECIFICATIONS, specifications }
}

export function setSpecification(specification) {
    return { type: constants.ACTIONS.MY_SPECIFICATIONS.SET_SPECIFICATION, specification }
}
