export default {
  setErrorInfo(state, payload) {
    Object.assign(state.errorInfo, payload);
  },
  setSuccessInfo(state, payload) {
    Object.assign(state.successInfo, payload);
  }
};