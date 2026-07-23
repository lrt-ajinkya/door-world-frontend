import constants from "../common/constants";

const initialState = {
  steps: [
    "model",
    "type",
    "dimensions",
    "color",
    "hinges",
    "finishing",
    "architraves",
    "thresholds",
    "locks",
    "extra_locks",
    "handles",
    "accessories",
    "glass",
    "price",
  ],
  editMode: false,
  doorModel: null,
  bulletproofModel: null,
  doorType: null,
  hingeType: null,
  hinges: [],
  hingeCaps: null,
  hingeCapFinishing: [],
  hingeAccessories: [],
  height: 2100,
  width: 1000,
  totalHeight: 2100,
  totalWidth: 1000,
  handleHeight: 1000,
  finishings: [],
  mainLockAccessories: [],
  mainLock: null,
  extraLock: null,
  exploitation: null,
  accessories: [],
  note: "",
  name: "",
  handle: {
    interior: {},
    exterior: {},
  },
  modelNote: {
    note: "",
    price: 0,
  },
  typeNote: {
    note: "",
    price: 0,
  },
  dimensionNote: {
    note: "",
    price: 0,
  },
  colorNote: {
    note: "",
    price: 0,
  },
  hingeNote: {
    note: "",
    price: 0,
  },
  finishingNote: {
    note: "",
    price: 0,
  },
  architraveNote: {
    note: "",
    price: 0,
  },
  thresholdNote: {
    note: "",
    price: 0,
  },
  lockNote: {
    note: "",
    price: 0,
  },
  extraLockNote: {
    note: "",
    price: 0,
  },
  handleNote: {
    note: "",
    price: 0,
  },
  accessoryNote: {
    note: "",
    price: 0,
  },
  glassNote: {
    note: "",
    price: 0,
  },
  doorTypePrices: [],
  activeStep: 0,
  doorColor: null,
  architraves: {
    hingeSide: null,
    oppositeSide: null,
  },
  glass: [],
  hingeMultiplier: false,
  oppositeMultiplier: false,
  threshold: {},
  thresholdMultiplier: 1,
  completed: [
    { name: "Model", completed: false },
    { name: "Type", completed: false },
    { name: "Dimensions", completed: false },
    { name: "Color", completed: false },
    { name: "Hinges", completed: false },
    { name: "Finishing", completed: false },
    { name: "Architraves", completed: false },
    { name: "Thresholds", completed: false },
    { name: "Locks", completed: false },
    { name: "Extra locks", completed: false },
    { name: "Handles", completed: false },
    { name: "Accessories", completed: false },
    { name: "Glass", completed: false },
    { name: "Price", completed: false },
  ],
  totalPrice: 0,
  margins: {},
  id: null,
  electricStrike: null,
};

export default function newSpecificationReducer(state = initialState, action) {
  switch (action.type) {
    case constants.ACTIONS.NEW_SPECIFICATION.RESET: {
      return { ...initialState };
    }

    case constants.ACTIONS.NEW_SPECIFICATION.SET_DOOR_MODEL: {
      return { ...state, doorModel: action.model };
    }

    case constants.ACTIONS.NEW_SPECIFICATION.SET_HINGE_TYPE: {
      return { ...state, hingeType: action.hinge };
    }

    case constants.ACTIONS.NEW_SPECIFICATION.SET_HEIGHT: {
      return { ...state, height: action.height };
    }

    case constants.ACTIONS.NEW_SPECIFICATION.SET_WIDTH: {
      return { ...state, width: action.width };
    }

    case constants.ACTIONS.NEW_SPECIFICATION.SET_TOTAL_HEIGHT: {
      return { ...state, totalHeight: action.height || initialState.height };
    }

    case constants.ACTIONS.NEW_SPECIFICATION.SET_TOTAL_WIDTH: {
      return { ...state, totalWidth: action.width || initialState.width };
    }

    case constants.ACTIONS.NEW_SPECIFICATION.SET_HANDLE_HEIGHT: {
      return {
        ...state,
        handleHeight: action.handleHeight || initialState.handleHeight,
      };
    }

    case constants.ACTIONS.NEW_SPECIFICATION.SET_MAIN_LOCK_ACCESSORIES: {
      return { ...state, mainLockAccessories: action.accessories };
    }

    case constants.ACTIONS.NEW_SPECIFICATION.SET_MAIN_LOCK: {
      return { ...state, mainLock: action.mainLock };
    }

    case constants.ACTIONS.NEW_SPECIFICATION.SET_EXTRA_LOCK: {
      return { ...state, extraLock: action.extraLock };
    }

    case constants.ACTIONS.NEW_SPECIFICATION.SET_ACCESSORIES: {
      return { ...state, accessories: action.accessories };
    }

    case constants.ACTIONS.NEW_SPECIFICATION.SET_DOOR_TYPE: {
      return { ...state, doorType: action.doorType };
    }

    case constants.ACTIONS.NEW_SPECIFICATION.SET_HANDLE: {
      return { ...state, handle: action.handle };
    }

    case constants.ACTIONS.NEW_SPECIFICATION.SET_DOOR_TYPE_PRICES: {
      return { ...state, doorTypePrices: action.doorTypePrices };
    }

    case constants.ACTIONS.NEW_SPECIFICATION.SET_FINISHINGS: {
      return {
        ...state,
        finishings: action.finishings || initialState.finishings,
      };
    }

    case constants.ACTIONS.NEW_SPECIFICATION.SET_ACTIVE_STEP: {
      return { ...state, activeStep: action.step };
    }

    case constants.ACTIONS.NEW_SPECIFICATION.SET_DOOR_COLOR: {
      return { ...state, doorColor: action.color };
    }

    case constants.ACTIONS.NEW_SPECIFICATION.SET_HINGES: {
      return { ...state, hinges: action.hinges || initialState.hinges };
    }

    case constants.ACTIONS.NEW_SPECIFICATION.SET_HINGE_CAPS: {
      return {
        ...state,
        hingeCaps: action.hingeCaps || initialState.hingeCaps,
      };
    }

    case constants.ACTIONS.NEW_SPECIFICATION.SET_HINGE_ACCESSORIES: {
      return {
        ...state,
        hingeAccessories:
          action.hingeAccessories || initialState.hingeAccessories,
      };
    }

    case constants.ACTIONS.NEW_SPECIFICATION.SET_HINGE_CAP_FINISHING: {
      return {
        ...state,
        hingeCapFinishing:
          action.hingeCapFinishing || initialState.hingeCapFinishing,
      };
    }

    case constants.ACTIONS.NEW_SPECIFICATION.SET_ARCHITRAVES: {
      return { ...state, architraves: action.architraves };
    }

    case constants.ACTIONS.NEW_SPECIFICATION.SET_HINGE_MULTIPLIER: {
      return { ...state, hingeMultiplier: action.hingeMultiplier };
    }

    case constants.ACTIONS.NEW_SPECIFICATION.SET_OPPOSITE_MULTIPLIER: {
      return { ...state, oppositeMultiplier: action.oppositeMultiplier };
    }

    case constants.ACTIONS.NEW_SPECIFICATION.SET_THRESHOLD_MULTIPLIER: {
      return { ...state, thresholdMultiplier: action.thresholdMultiplier };
    }

    case constants.ACTIONS.NEW_SPECIFICATION.SET_THRESHOLD: {
      return { ...state, threshold: action.threshold };
    }

    case constants.ACTIONS.NEW_SPECIFICATION.SET_TOTAL_PRICE: {
      return { ...state, totalPrice: action.totalPrice };
    }

    case constants.ACTIONS.NEW_SPECIFICATION.SET_EXPLOITATION_CONDITIONS: {
      return { ...state, exploitation: action.exploitation };
    }

    case constants.ACTIONS.NEW_SPECIFICATION.RESET_STEPS: {
      let completedTemp = [...state.completed];
      action.steps.forEach((step) => {
        completedTemp[step] = { ...completedTemp[step], completed: false };
      });
      return { ...state, completed: completedTemp };
    }

    case constants.ACTIONS.NEW_SPECIFICATION.SET_COMPLETED_STEP: {
      let completedTemp = [...state.completed];
      completedTemp[action.step] = {
        ...completedTemp[action.step],
        completed: action.isCompleted,
      };
      return { ...state, completed: completedTemp };
    }

    case constants.ACTIONS.NEW_SPECIFICATION.SET_MARGINS: {
      return { ...state, margins: action.margins };
    }

    case constants.ACTIONS.NEW_SPECIFICATION.SET_CYLINDER: {
      return { ...state, cylinder: action.cylinder };
    }

    case constants.ACTIONS.NEW_SPECIFICATION.SET_EXTRA_CYLINDER: {
      return { ...state, extraCylinder: action.cylinder };
    }

    case constants.ACTIONS.NEW_SPECIFICATION.SET_ELECTRIC_STRIKE: {
      return { ...state, electricStrike: action.strike };
    }

    case constants.ACTIONS.NEW_SPECIFICATION.SET_GLASS: {
      return { ...state, glass: action.glass };
    }

    case constants.ACTIONS.NEW_SPECIFICATION.SET_SPECIFICATIONid: {
      return { ...state, id: action.id };
    }

    case constants.ACTIONS.NEW_SPECIFICATION.SET_NOTE: {
      return { ...state, note: action.note };
    }

    case constants.ACTIONS.NEW_SPECIFICATION.NOTES.MODEL: {
      return {
        ...state,
        modelNote: { note: action.note, price: action.price },
      };
    }

    case constants.ACTIONS.NEW_SPECIFICATION.NOTES.TYPE: {
      return {
        ...state,
        typeNote: { note: action.note, price: action.price },
      };
    }

    case constants.ACTIONS.NEW_SPECIFICATION.NOTES.DIMENSION: {
      return {
        ...state,
        dimensionNote: { note: action.note, price: action.price },
      };
    }

    case constants.ACTIONS.NEW_SPECIFICATION.NOTES.COLOR: {
      return {
        ...state,
        colorNote: { note: action.note, price: action.price },
      };
    }

    case constants.ACTIONS.NEW_SPECIFICATION.NOTES.HINGE: {
      return {
        ...state,
        hingeNote: { note: action.note, price: action.price },
      };
    }

    case constants.ACTIONS.NEW_SPECIFICATION.NOTES.FINISHING: {
      return {
        ...state,
        finishingNote: { note: action.note, price: action.price },
      };
    }

    case constants.ACTIONS.NEW_SPECIFICATION.NOTES.ARCHITRAVE: {
      return {
        ...state,
        architraveNote: { note: action.note, price: action.price },
      };
    }

    case constants.ACTIONS.NEW_SPECIFICATION.NOTES.THRESHOLD: {
      return {
        ...state,
        thresholdNote: { note: action.note, price: action.price },
      };
    }

    case constants.ACTIONS.NEW_SPECIFICATION.NOTES.LOCK: {
      return {
        ...state,
        lockNote: { note: action.note, price: action.price },
      };
    }

    case constants.ACTIONS.NEW_SPECIFICATION.NOTES.EXTRA_LOCK: {
      return {
        ...state,
        extraLockNote: { note: action.note, price: action.price },
      };
    }

    case constants.ACTIONS.NEW_SPECIFICATION.NOTES.ACCESSORIES: {
      return {
        ...state,
        accessoryNote: { note: action.note, price: action.price },
      };
    }

    case constants.ACTIONS.NEW_SPECIFICATION.NOTES.GLASS: {
      return {
        ...state,
        glassNote: { note: action.note, price: action.price },
      };
    }

    case constants.ACTIONS.NEW_SPECIFICATION.NOTES.HANDLE: {
      return {
        ...state,
        handleNote: { note: action.note, price: action.price },
      };
    }

    case constants.ACTIONS.NEW_SPECIFICATION.SET_NAME: {
      return { ...state, name: action.name };
    }

    case constants.ACTIONS.NEW_SPECIFICATION.SET_SPECIFICATION: {
      if (action.allCompleted) {
        return {
          ...initialState,
          ...action.spec,
          completed: [
            { name: "Model", completed: true },
            { name: "Type", completed: true },
            { name: "Dimensions", completed: true },
            { name: "Color", completed: true },
            { name: "Hinges", completed: true },
            { name: "Finishing", completed: true },
            { name: "Architraves", completed: true },
            { name: "Thresholds", completed: true },
            { name: "Locks", completed: true },
            { name: "Extra locks", completed: true },
            { name: "Handles", completed: true },
            { name: "Accessories", completed: true },
            { name: "Glass", completed: true },
            { name: "Price", completed: true },
          ],
          editMode: action.editMode,
        };
      }
      return { ...initialState, ...action.spec, editMode: action.editMode };
    }

    case constants.ACTIONS.NEW_SPECIFICATION.SET_ALL_COMPLETED: {
      return {
        ...state,
        completed: [
          { name: "Model", completed: true },
          { name: "Type", completed: true },
          { name: "Dimensions", completed: true },
          { name: "Color", completed: true },
          { name: "Hinges", completed: true },
          { name: "Finishing", completed: true },
          { name: "Architraves", completed: true },
          { name: "Thresholds", completed: true },
          { name: "Locks", completed: true },
          { name: "Extra locks", completed: true },
          { name: "Handles", completed: true },
          { name: "Accessories", completed: true },
          { name: "Glass", completed: true },
          { name: "Price", completed: true },
        ],
      };
    }

    case constants.ACTIONS.NEW_SPECIFICATION.SET_BULLETPROOF_MODEL: {
      return { ...state, bulletproofModel: action.bulletproofModel };
    }

    default:
      return state;
  }
}
