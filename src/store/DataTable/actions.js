/**
 * Actions is the first step after dispatch action on Component
 */

export default {
  /**
   * Change the store datatable object with payload
   */
  setDataTable(context, payload) {
    context.commit("setDataTable", payload);
  },
  /**
   * Set the store dataTable object as default for re initializing
   */
  setDataTableByDefault(context, payload) {
    context.commit("setDataTableByDefault", payload);
  },
  /**
   * Change the store FilteredData object with payload
   */
  setFilteredData(context, payload) {
    context.commit("setFilteredData", {
      ...payload,
      network: context.rootState.Network.network
    });
  },
  /**
   * Change the store ExpandedData object with payload
   */
  setExpandedData(context, payload) {
    context.commit("setExpandedData", payload);
  },
  /**
   * Change the store Loading object with payload
   */
  setLoading(context, payload) {
    context.commit("setLoading", payload);
  },
  /**
   * Change the store IsLoading object with payload
   */
  setIsLoading(context, payload) {
    context.commit("setIsLoading", payload);
  },
  /**
   * Change the store Updating object with payload
   */
  setUpdating(context, payload) {
    context.commit("setUpdating", payload);
  },
  /**
   * Change the store ToggleButton object with payload
   */
  setToggleButton(context, payload) {
    context.commit("setToggleButton", payload);
  },
  /**
   * Change the store MultipleVisors object with payload
   */
  setMultipleVisors(context, payload) {
    context.commit("setMultipleVisors", payload);
  },
  /**
   * Change the store isInitialLoaded object with payload
   */
  setIsInitialLoaded(context, payload) {
    context.commit("setIsInitialLoaded", payload);
  },
  /**
   * Change the store isTableLoaded object with payload
   */
  setIsTableLoaded(context, payload) {
    context.commit("setIsTableLoaded", payload);
  },
  /**
   * Chnage the store isConnected variable with payload
   */
  setIsConnected(context, payload) {
    context.commit("setIsConnected", payload);
  },
  /***
   * Change the etherscanVisorLink
   */
  setEtherscanVisorLink(context, payload) {
    context.commit("setEtherscanVisorLink", payload);
  },
  /**
   * Change the isInitializedPresigined
   */
  setIsInitializedPresigined(context, payload) {
    context.commit("setIsInitializedPresigined", payload)
  }
};
