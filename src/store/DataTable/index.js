import getters from "./getters";
import actions from "./actions";
import mutations from "./mutations";
import { defaultDataTable } from "./sampleDataTable";

let defaultData = {};
Object.assign(defaultData, defaultDataTable);

const state = {
  dataTable: defaultData, // DataTable original data
  filteredData: [], // Final Filtered Data which is shown by dashboard
  expandedData: {}, // The detail data which is shown on expanded row case
  loading: {
    endingText: "Ending...",
    errorText: "Error.",
    loadingText: "Loading...",
    loadedText: "Complete.",
    state: "loading"
  }, // Show case which our app is loading
  updating: true, // When the vault data is updating
  isLoading: true, // When dashboard is case on loading
  toggleButton: "Loading", // Table Button string
  multiple_visors: false, // multiple Visor
  isInitialLoaded: false, // Presigned & connected?
  isTableLoaded: false, // Table data is ready to show?
  isConnected: false, // User is fully connected to the web app
  etherscanVisorLink: "",
  isInitializedPresigined: true, // for dashboading presining is done or not
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};
