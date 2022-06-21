export default {
  setGammaStats(context, payload) {
    context.commit("setGammaStats", payload);
  },
  setGammaStakingApy(context, payload) {
    context.commit("setGammaStakingApy", payload);
  },
  setIsVisorStatsLoading(context, payload) {
    context.commit("setIsGammaStatsLoading", payload);
  }
};
