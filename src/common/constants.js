export default {
  ACTIONS: {
    APP: {
      SET_SELECTED_USER: "app_actions/set_selected_user",
      OPEN_SNACKBAR: "app_actions/open_snackbar",
      CLOSE_SNACKBAR: "app_actions/close_snackbar",
      SET_SNACKBAR_SEVERITY: "app_actions/set_snackbar_severity",
      SET_SNACKBAR_TEXT: "app_actions/set_snackbar_text",
    },
    NEW_SPECIFICATION: {
      RESET: "new_specification/reset",

      SET_DOOR_MODEL: "new_specification/set_door_model",
      SET_BULLETPROOF_MODEL: "new_specifications/set_bulletproof_model",
      SET_HINGE_TYPE: "new_specification/set_hinge_type",

      SET_HEIGHT: "new_specification/set_height",
      SET_WIDTH: "new_specification/set_width",
      SET_TOTAL_HEIGHT: "new_specification/set_total_height",
      SET_TOTAL_WIDTH: "new_specification/set_total_width",
      SET_HANDLE_HEIGHT: "new_specification/set_handle_height",

      SET_FINISHINGS: "new_specification/set_finishings",

      SET_FRONT_FINISHING: "new_specification/set_front_finishing",
      SET_FRONT_MILLING: "new_specification/set_front_milling",

      SET_BACK_FINISHING: "new_specification/set_back_finishing",
      SET_BACK_MILLING: "new_specification/set_back_milling",

      SET_MAIN_LOCK_ACCESSORIES: "new_specification/set_main_lock_accessories",
      SET_MAIN_LOCK: "new_specification/set_main_lock",
      SET_EXTRA_LOCK: "new_specification/set_extra_lock",

      SET_DOOR_TYPE_PRICES: "new_specification/set_door_type_prices",
      SET_ACCESSORIES: "new_specification/set_accessories",
      SET_DOOR_TYPE: "new_specification/set_door_type",
      SET_HANDLE: "new_specification/set_handle",

      SET_ACTIVE_STEP: "new_specification/set_active_step",
      SET_DOOR_COLOR: "new_specification/set_door_color",

      SET_HINGES: "new_specification/set_hinges",
      SET_HINGE_CAPS: "new_specification/set_hinge_caps",
      SET_HINGE_CAP_FINISHING: "new_specification/set_hinge_cap_finishing",
      SET_HINGE_ACCESSORIES: "new_specification/set_hinge_accessories",
      SET_ARCHITRAVES: "new_specification/set_architraves",

      SET_COMPLETED_STEP: "new_specification/set_completed_step",
      RESET_STEPS: "new_specification/reset_steps",

      SET_HINGE_MULTIPLIER: "new_specification/set_hinge_multiplier",
      SET_OPPOSITE_MULTIPLIER: "new_specification/set_opposite_multiplier",

      SET_THRESHOLD: "new_specification/set_threshold",
      SET_THRESHOLD_MULTIPLIER: "new_specification/set_threshold_multiplier",

      SET_EXPLOITATION_CONDITIONS:
        "new_specification/set_exploitation_conditions",
      SET_TOTAL_PRICE: "new_specification/set_total_price",

      SET_MARGINS: "new_specifications/set_margins",
      SET_CYLINDER: "new_specifications/set_cylinder",
      SET_EXTRA_CYLINDER: "new_specifications/set_extra_cylinder",
      SET_ELECTRIC_STRIKE: "new_specifications/set_electric_strike",

      SET_GLASS: "new_specifications/set_glass",
      SET_SPECIFICATION: "new_specifications/set_specification",
      SET_SPECIFICATIONid: "new_specifications/set_specificationid",

      SET_ALL_COMPLETED: "new_specifications/set_all_completed",
      SET_NOTE: "new_specifications/set_note",
      SET_NAME: "new_specifications/set_name",

      NOTES: {
        MODEL: "new_specifications/set_model_note",
        TYPE: "new_specifications/set_type_note",
        DIMENSION: "new_specifications/set_dimension_note",
        COLOR: "new_specifications/set_color_note",
        HINGE: "new_specifications/set_hinge_note",
        FINISHING: "new_specifications/set_finishing_note",
        ARCHITRAVE: "new_specifications/set_architrave_note",
        THRESHOLD: "new_specifications/set_threshold_note",
        LOCK: "new_specifications/set_lock_note",
        EXTRA_LOCK: "new_specifications/set_extra_lock_note",
        HANDLE: "new_specifications/set_handle_note",
        ACCESSORIES: "new_specifications/set_accessories_note",
        GLASS: "new_specifications/set_glass_note",
      },
    },
    MY_SPECIFICATIONS: {
      SET_SPECIFICATIONS: "my_specifications/set_specifications",
      SET_SPECIFICATION: "my_specifications/set_specification",
    },
    MY_DRAFTS: {
      SET_DRAFTS: "my_drafts/set_drafts",
    },
    NAVIGATION: {
      SET_DRAWER_OPEN: "navigation/set_drawer_open",
      SET_LANGUAGE: "navigation/set_language",
    },
  },
  API: {
    HOST: "https://door-world-backend-production.up.railway.app",
  },
};
