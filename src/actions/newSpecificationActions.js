import constants from "../common/constants";

export function reset() {
  return { type: constants.ACTIONS.NEW_SPECIFICATION.RESET };
}

export function setDoorModel(model) {
  return { type: constants.ACTIONS.NEW_SPECIFICATION.SET_DOOR_MODEL, model };
}

export function setHingeType(hinge) {
  return { type: constants.ACTIONS.NEW_SPECIFICATION.SET_HINGE_TYPE, hinge };
}

export function setHeight(height) {
  return { type: constants.ACTIONS.NEW_SPECIFICATION.SET_HEIGHT, height };
}

export function setWidth(width) {
  return { type: constants.ACTIONS.NEW_SPECIFICATION.SET_WIDTH, width };
}

export function setHandleHeight(handleHeight) {
  return {
    type: constants.ACTIONS.NEW_SPECIFICATION.SET_HANDLE_HEIGHT,
    handleHeight,
  };
}

export function setMainLockAccessories(accessories) {
  return {
    type: constants.ACTIONS.NEW_SPECIFICATION.SET_MAIN_LOCK_ACCESSORIES,
    accessories,
  };
}

export function setMainLock(mainLock) {
  return { type: constants.ACTIONS.NEW_SPECIFICATION.SET_MAIN_LOCK, mainLock };
}

export function setExtraLock(extraLock) {
  return {
    type: constants.ACTIONS.NEW_SPECIFICATION.SET_EXTRA_LOCK,
    extraLock,
  };
}

export function setAccessories(accessories) {
  return {
    type: constants.ACTIONS.NEW_SPECIFICATION.SET_ACCESSORIES,
    accessories,
  };
}

export function setDoorType(doorType) {
  return { type: constants.ACTIONS.NEW_SPECIFICATION.SET_DOOR_TYPE, doorType };
}

export function setHandle(handle) {
  return { type: constants.ACTIONS.NEW_SPECIFICATION.SET_HANDLE, handle };
}

export function setDoorTypePrices(doorTypePrices) {
  return {
    type: constants.ACTIONS.NEW_SPECIFICATION.SET_DOOR_TYPE_PRICES,
    doorTypePrices,
  };
}

export function setFinishings(finishings) {
  return {
    type: constants.ACTIONS.NEW_SPECIFICATION.SET_FINISHINGS,
    finishings,
  };
}

export function setActiveStep(step) {
  return { type: constants.ACTIONS.NEW_SPECIFICATION.SET_ACTIVE_STEP, step };
}

export function setDoorColor(color) {
  return { type: constants.ACTIONS.NEW_SPECIFICATION.SET_DOOR_COLOR, color };
}

export function setHinges(hinges) {
  return { type: constants.ACTIONS.NEW_SPECIFICATION.SET_HINGES, hinges };
}

export function setHingeCaps(hingeCaps) {
  return {
    type: constants.ACTIONS.NEW_SPECIFICATION.SET_HINGE_CAPS,
    hingeCaps,
  };
}

export function setTotalHeight(height) {
  return { type: constants.ACTIONS.NEW_SPECIFICATION.SET_TOTAL_HEIGHT, height };
}

export function setTotalWidth(width) {
  return { type: constants.ACTIONS.NEW_SPECIFICATION.SET_TOTAL_WIDTH, width };
}

export function setHingeCapFinishing(hingeCapFinishing) {
  return {
    type: constants.ACTIONS.NEW_SPECIFICATION.SET_HINGE_CAP_FINISHING,
    hingeCapFinishing,
  };
}

export function setHingeAccessories(hingeAccessories) {
  return {
    type: constants.ACTIONS.NEW_SPECIFICATION.SET_HINGE_ACCESSORIES,
    hingeAccessories,
  };
}

export function setArchitraves(architraves) {
  return {
    type: constants.ACTIONS.NEW_SPECIFICATION.SET_ARCHITRAVES,
    architraves,
  };
}

export function resetSteps(steps = []) {
  return { type: constants.ACTIONS.NEW_SPECIFICATION.RESET_STEPS, steps };
}

export function setCompletedStep(step, isCompleted = true) {
  return {
    type: constants.ACTIONS.NEW_SPECIFICATION.SET_COMPLETED_STEP,
    step,
    isCompleted,
  };
}

export function setHingeMultiplier(hingeMultiplier) {
  return {
    type: constants.ACTIONS.NEW_SPECIFICATION.SET_HINGE_MULTIPLIER,
    hingeMultiplier,
  };
}

export function setOppositeMultiplier(oppositeMultiplier) {
  return {
    type: constants.ACTIONS.NEW_SPECIFICATION.SET_OPPOSITE_MULTIPLIER,
    oppositeMultiplier,
  };
}

export function setThreshold(threshold = {}) {
  return { type: constants.ACTIONS.NEW_SPECIFICATION.SET_THRESHOLD, threshold };
}

export function setExploitationConditions(exploitation) {
  return {
    type: constants.ACTIONS.NEW_SPECIFICATION.SET_EXPLOITATION_CONDITIONS,
    exploitation,
  };
}

export function setThresholdMultiplier(thresholdMultiplier) {
  return {
    type: constants.ACTIONS.NEW_SPECIFICATION.SET_THRESHOLD_MULTIPLIER,
    thresholdMultiplier,
  };
}

export function setTotalPrice(totalPrice) {
  return {
    type: constants.ACTIONS.NEW_SPECIFICATION.SET_TOTAL_PRICE,
    totalPrice,
  };
}

export function setMargins(margins) {
  return { type: constants.ACTIONS.NEW_SPECIFICATION.SET_MARGINS, margins };
}

export function setCylinder(cylinder) {
  return { type: constants.ACTIONS.NEW_SPECIFICATION.SET_CYLINDER, cylinder };
}

export function setExtraCylinder(cylinder) {
  return {
    type: constants.ACTIONS.NEW_SPECIFICATION.SET_EXTRA_CYLINDER,
    cylinder,
  };
}

export function setElectricStrike(strike) {
  return {
    type: constants.ACTIONS.NEW_SPECIFICATION.SET_ELECTRIC_STRIKE,
    strike,
  };
}

export function setGlass(glass) {
  return { type: constants.ACTIONS.NEW_SPECIFICATION.SET_GLASS, glass };
}

export function setSpecification(spec, editMode = false, allCompleted = false) {
  return {
    type: constants.ACTIONS.NEW_SPECIFICATION.SET_SPECIFICATION,
    spec,
    editMode,
    allCompleted,
  };
}

export function setAllCompleted() {
  return { type: constants.ACTIONS.NEW_SPECIFICATION.SET_ALL_COMPLETED };
}

export function setSpecificationId(id) {
  return { type: constants.ACTIONS.NEW_SPECIFICATION.SET_SPECIFICATIONid, id };
}

export function setNote(note) {
  return { type: constants.ACTIONS.NEW_SPECIFICATION.SET_NOTE, note };
}

export function setModelNote(note, price) {
  return {
    type: constants.ACTIONS.NEW_SPECIFICATION.NOTES.MODEL,
    note,
    price,
  };
}

export function setTypeNote(note, price) {
  return {
    type: constants.ACTIONS.NEW_SPECIFICATION.NOTES.TYPE,
    note,
    price,
  };
}

export function setDimensionNote(note, price) {
  return {
    type: constants.ACTIONS.NEW_SPECIFICATION.NOTES.DIMENSION,
    note,
    price,
  };
}

export function setColorNote(note, price) {
  return {
    type: constants.ACTIONS.NEW_SPECIFICATION.NOTES.COLOR,
    note,
    price,
  };
}

export function setHingeNote(note, price) {
  return {
    type: constants.ACTIONS.NEW_SPECIFICATION.NOTES.HINGE,
    note,
    price,
  };
}

export function setFinishingNote(note, price) {
  return {
    type: constants.ACTIONS.NEW_SPECIFICATION.NOTES.FINISHING,
    note,
    price,
  };
}

export function setArchitraveNote(note, price) {
  return {
    type: constants.ACTIONS.NEW_SPECIFICATION.NOTES.ARCHITRAVE,
    note,
    price,
  };
}

export function setThresholdNote(note, price) {
  return {
    type: constants.ACTIONS.NEW_SPECIFICATION.NOTES.THRESHOLD,
    note,
    price,
  };
}

export function setLockNote(note, price) {
  return {
    type: constants.ACTIONS.NEW_SPECIFICATION.NOTES.LOCK,
    note,
    price,
  };
}

export function setExtraLockNote(note, price) {
  return {
    type: constants.ACTIONS.NEW_SPECIFICATION.NOTES.EXTRA_LOCK,
    note,
    price,
  };
}

export function setHandleNote(note, price) {
  return {
    type: constants.ACTIONS.NEW_SPECIFICATION.NOTES.HANDLE,
    note,
    price,
  };
}

export function setAccessoryNote(note, price) {
  return {
    type: constants.ACTIONS.NEW_SPECIFICATION.NOTES.ACCESSORIES,
    note,
    price,
  };
}

export function setGlassNote(note, price) {
  return {
    type: constants.ACTIONS.NEW_SPECIFICATION.NOTES.GLASS,
    note,
    price,
  };
}

export function setName(name) {
  return { type: constants.ACTIONS.NEW_SPECIFICATION.SET_NAME, name };
}

export function setBulletProofModel(bulletproofModel) {
  return {
    type: constants.ACTIONS.NEW_SPECIFICATION.SET_BULLETPROOF_MODEL,
    bulletproofModel,
  };
}
