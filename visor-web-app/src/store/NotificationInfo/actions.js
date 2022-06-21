export default {
  setErrorInfo(context, payload) {
    context.commit("setErrorInfo", payload);
  },
  setSuccessInfo(context, payload) {
    context.commit("setSuccessInfo", payload);
  }
};
