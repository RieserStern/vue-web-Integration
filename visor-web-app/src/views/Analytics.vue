<template>
  <div class="page-analystics">
    <h4 v-show="core.publish" class="page-title">Gamma Analytics</h4>
    <cv-grid class="chart-stats main-content" kind="condensed">
      <cv-row v-show="core.publish" class="top-toolbar">
        <cv-column :sm="12" :md="12" :lg="3">
          <div class="column-inner-wrapper left">
            <cv-dropdown
              label="Choose Analytics View"
              :value="viewType"
              @change="onViewChange($event)"
            >
              <cv-dropdown-item
                v-for="(item, index) in PairAnalyticItems"
                :key="`${index}`"
                :value="item.route"
              >
                <span>{{ item.name }}</span>
              </cv-dropdown-item>
            </cv-dropdown>
          </div>
        </cv-column>
        <cv-column :sm="0" :md="12" :lg="9">
          <div class="column-inner-wrapper" />
        </cv-column>
      </cv-row>
      <NewVisorProtocolOverview
        v-if="viewType === 'VisorProtocolOverview' && !core.publish"
      />
      <VisorProtocolOverview
        v-if="viewType === 'VisorProtocolOverview' && core.publish"
      />
      <template v-for="(item, index) in PairAnalyticItems">
        <VisorManagedPairs
          v-if="pair == item.pairName && viewType !== 'VisorProtocolOverview'"
          :key="`${index}`"
          :pair="pair"
        />
      </template>
    </cv-grid>
  </div>
</template>

<script>
import Vue from "vue";
import chartsVue from "@carbon/charts-vue";
import "@carbon/charts/styles-g100.css";
import VisorProtocolOverview from "@/components/analytics/VisorProtocolOverview";
import NewVisorProtocolOverview from "@/components/analytics/NewVisorProtocolOverview";
import VisorManagedPairs from "@/components/analytics/VisorManagedPairs";
import { PairAnalyticItems } from "@/constants";
import { mapGetters, mapActions } from "vuex";

Vue.use(chartsVue);

export default {
  name: "Chart",
  components: {
    VisorProtocolOverview,
    VisorManagedPairs,
    NewVisorProtocolOverview,
  },
  data() {
    return {
      core: this.$parent.$root.core,
      PairAnalyticItems: PairAnalyticItems,
    };
  },
  computed: {
    ...mapGetters({
      getIsInitializedPresigined: "DataTable/getIsInitializedPresigined",
      getDataTable: "DataTable/getDataTable",
    }),
    viewType() {
      return this.$route.name;
    },
    pair() {
      if (this.$route.name === "VisorProtocolOverview") return;
      return this.PairAnalyticItems.filter((obj) =>
        Object.keys(obj).some((key) => obj[key].includes(this.$route.name))
      )[0].pairName;
    },
  },
  async mounted() {
    // When presignin initializeV3 is not done.
    if (!this.getIsInitializedPresigined) {
      let dataTable = {};
      Object.assign(dataTable, this.getDataTable);
      this.$set(dataTable, "data", this.core.tableData);
      dataTable.pagination.numberOfItems = dataTable.data.length;

      this.setUpdating(true);
      this.setIsTableLoaded(false);
      await this.core.initializingDashboard(true);
      this.setIsInitializedPresigined(true);
      await this.updateLPRows();

      // Set filteredData & expandedData onto store with current state
      let expandedDataTemp = await this.core.getExpandedData(dataTable);
      this.setDataTable(dataTable);
      this.setExpandedData(expandedDataTemp);
      this.setUpdating(false);
      this.setIsTableLoaded(true);
    }
    if (
      this.$route.query.view &&
      this.$route.query.view.toUpperCase() !== this.$route.name
    ) {
      this.$router.push({ name: this.$route.query.view.toUpperCase() });
    }
  },
  methods: {
    ...mapActions({
      setUpdating: "DataTable/setUpdating",
      setIsTableLoaded: "DataTable/setIsTableLoaded",
      setIsInitializedPresigined: "DataTable/setIsInitializedPresigined",
      setDataTable: "DataTable/setDataTable",
      setExpandedData: "DataTable/setExpandedData",
    }),
    onViewChange(view) {
      this.$router.push({ name: view });
    },
  },
};
</script>

<style lang="scss">
@import "../assets/css/main-theme.scss";
</style>
