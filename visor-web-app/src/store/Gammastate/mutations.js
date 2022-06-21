export default {
  setGammaStats(state, payload) {
    Object.assign(state.gammaStats, payload);
  },
  setGammaStakingApy(state, payload) {
    state.gammaStakingApy = payload;
  },
  setIsGammaStatsLoading(state, payload) {
    state.isGammaStatsLoading = payload;
  }
};
