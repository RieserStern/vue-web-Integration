import { defaultDataTable } from "./sampleDataTable";

export default {
  /**
   * Set dataTable vuex store value with upcomping payload
   */
  setDataTable(state, payload) {
    Object.assign(state.dataTable, payload);
  },

  /**
   * Set dataTable vuex store value with default value
   */
  setDataTableByDefault(state, payload) {
    Object.assign(state.dataTable, defaultDataTable);
  },

  /**
   * Set filteredData array with current state
   */
  setFilteredData(state, payload) {
    let result;
    if (payload.filterValue) {
      result = state.dataTable.data.filter(item => {
        return item
          .join("|")
          .toLowerCase()
          .includes(payload.filterValue.toLowerCase());
      });
    } else result = state.dataTable.data;

    if (payload.sortBy) {
      result.sort((a, b) => {
        let itemA = a[payload.sortBy.index];
        let itemB = b[payload.sortBy.index];

        const numSortableIndexes = [2, 4];
        if (payload.sortBy.order === "descending") {
          if (numSortableIndexes.includes(payload.sortBy.index)) {
            // sort as number
            return parseFloat(itemA) - parseFloat(itemB);
          } else {
            const _a = itemA.toString();
            const _b = itemB.toString();
            return _b.localeCompare(_a);
          }
        }
        if (payload.sortBy.order === "ascending") {
          if (numSortableIndexes.includes(payload.sortBy.index)) {
            // sort as number
            return parseFloat(itemB) - parseFloat(itemA);
          } else {
            const _a = itemA.toString();
            const _b = itemB.toString();
            return _a.localeCompare(_b);
          }
        }
        return 0;
      });
    }

    // Sort by Active LP Amount
    // Exclude GAMMA in sorting and make sure to put it on top of the list
    const visrRow = result.find(row => row[0] === "GAMMA");
    const vvisrRow = result.find(row => row[0] === "xGAMMA");
    const gammaEthRow = result.find(row => row[0] === "GAMMA-ETH");
    const floatRow = result.find(row => row[0] === "FLOAT-ETH");

    result = result
      .filter(
        (row) =>
          row[0] !== "GAMMA" &&
          row[0] !== "xGAMMA" &&
          row[0] !== "FLOAT-ETH" &&
          row[0] !== "GAMMA-ETH"
      )
      .sort((a, b) => {
        const _a = a[1].toString();
        const _b = b[1].toString();
        return _b.localeCompare(_a);
      });

    if (payload.network.name == "mainnet") {
      // if (payload.amount == 0) result = [vvisrRow, gammaEthRow, floatRow, ...result, visrRow];
      if (payload.amount == 0) result = [vvisrRow, floatRow, ...result, visrRow];
      else result = [visrRow, vvisrRow, floatRow, ...result];
    }

    let filteredData = result.slice(
      state.dataTable.pagination.start - 1,
      state.dataTable.pagination.start + state.dataTable.pagination.pageSize - 1
    );
    state.filteredData = filteredData;
    state.dataTable.pagination.numberOfItems = result.length;
  },

  /**
   * Set expanded data array with current state
   */
  setExpandedData(state, payload) {
    Object.assign(state.expandedData, payload);
  },

  /**
   * Set vuex store loading state with upcoming value
   */
  setLoading(state, payload) {
    Object.assign(state.loading, payload);
  },

  /**
   * Set vuex store isLoading state with upcoming value
   */
  setIsLoading(state, payload) {
    state.isLoading = payload;
  },

  /**
   * Set vuex store updating state with upcoming value
   */
  setUpdating(state, payload) {
    state.updating = payload;
  },

  /**
   * Set vuex store toggleButton state with upcoming value
   */
  setToggleButton(state, payload) {
    state.toggleButton = payload;
  },

  /**
   * Set vuex multipleVisors state with upcoming value
   */
  setMultipleVisors(state, payload) {
    state.multiple_visors = payload;
  },

  /**
   * Set vuex isInitialLoaded state with upcoming value
   */
  setIsInitialLoaded(state, payload) {
    state.isInitialLoaded = payload;
  },

  /**
   * Set vuex isTableLoaded state with upcoming value
   */
  setIsTableLoaded(state, payload) {
    state.isTableLoaded = payload;
  },
  /**
   * Set vuex isConnected state with upcoming value
   */
  setIsConnected(state, payload) {
    state.isConnected = payload;
  },
  /***
   * Change the etherscanVisorLink
   */
  setEtherscanVisorLink(state, payload) {
    state.etherscanVisorLink = payload;
  },
  /**
   * change isInitializedPresigined
   */
  setIsInitializedPresigined(state, payload) {
    state.isInitializedPresigined = payload;
  }
};
