import getters from "./getters";
import actions from "./actions";
import mutations from "./mutations";

const state = {
  errorInfo: {
    visible: false,
    copy: "",
    description: "",
    closeAriaLabel: "Custom close aria label"
  },
  successInfo: {
    visible: false,
    copy: "",
    description: "",
    closeAriaLabel: "Custom close aria label"
  },
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};