import getters from "./getters";
import actions from "./actions";
import mutations from "./mutations";

const state = {
  isGammaStatsLoading: true,
  gammaStakingApy: 0,
  gammaStats: {}
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
