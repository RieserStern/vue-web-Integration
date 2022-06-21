import Vue from "vue";
import Vuex from "vuex";

import NotificationInfo from "./NotificationInfo";
import DataTable from "./DataTable";
import Network from "./Network";
import GammaState from "./Gammastate";

Vue.use(Vuex);

// const debug = process.env.NODE_ENV !== 'production';

export default new Vuex.Store({
  modules: {
    NotificationInfo,
    DataTable,
    GammaState,
    Network
  },
  state: {},
  mutations: {},
  actions: {},
  getters: {}
});
