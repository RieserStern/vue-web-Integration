<template>
  <div class="protocol-stats-page main-content">
    <div class="lorem-table-page-inner">
      <div class="lorem-protocol-stats">
        <h4>Protocol Stats</h4>
        <cv-grid>
          <cv-row>
            <cv-column :md="2" :sm="2" :lg="3">
              <div class="stat-container">
                <span class="sub-title">Total Value Locked</span>
                <span class="title">
                  <template v-if="isGammaStatsLoading">
                    <cv-skeleton-text />
                  </template>
                  {{ gammaStats.uniswapPairTotalValueLocked }}
                </span>
              </div>
            </cv-column>
            <cv-column :md="2" :sm="2" :lg="3">
              <div class="stat-container">
                <span class="sub-title">Total Fees Accrued</span>
                <span class="title">
                  <template v-if="isGammaStatsLoading">
                    <cv-skeleton-text />
                  </template>
                  {{ gammaStats.uniswapFeesGenerated }}
                </span>
              </div>
            </cv-column>
            <cv-column :md="2" :sm="2" :lg="3">
              <div class="stat-container">
                <span class="sub-title">Fee-Based APR</span>
                <span class="title">
                  <template v-if="isGammaStatsLoading">
                    <cv-skeleton-text />
                  </template>
                  {{ gammaStats.uniswapFeesBasedApr }}
                </span>
              </div>
            </cv-column>
            <cv-column :md="2" :sm="2" :lg="3">
              <div class="stat-container">
                <span class="sub-title">VISR Staking APY</span>
                <span class="title">
                  <template v-if="isGammaStatsLoading">
                    <cv-skeleton-text />
                  </template>
                  <template v-else> {{ gammaStakingApy }}% </template>
                </span>
              </div>
            </cv-column>
          </cv-row>
        </cv-grid>
        <div class="column-inner-wrapper main">
          <cv-row>
            <cv-column :sm="12" :md="12" :lg="12">
              <cv-row>
                <div class="chart-wrapper">
                  <div class="chart-title">
                    <cv-row>
                      <cv-column :md="12" :lg="6"> Protocol TVL </cv-column>
                      <cv-column :md="12" :lg="6" class="gamma-link">
                        <a href="http://gammastrategies.org/" target="_blank">
                          View in Defillamma
                          <Link16 class="icon-launch" />
                        </a>
                      </cv-column>
                    </cv-row>
                  </div>
                  <ccv-stacked-area-chart
                    :data="chartData"
                    :options="chartOptions"
                  >
                  </ccv-stacked-area-chart>
                </div>
              </cv-row>
            </cv-column>
          </cv-row>
        </div>
        <div class="column-inner-wrapper protocol-staking">
          <cv-row>
            <cv-column :sm="4" :md="4" :lg="8">
              <div class="staking-text">
                <span class="staking-amount"> $3,670.00 </span>
                Pending fees to be distributed to VISR stakers today
              </div>
            </cv-column>
            <cv-column
              :sm="4"
              :md="4"
              :lg="4"
              class="stake-visr-button-wrapper"
            >
              <cv-button class="btn-stake-visr">
                Stake VISR to receive fees daily
              </cv-button>
            </cv-column>
          </cv-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import chartsVue from "@carbon/charts-vue";
import "@carbon/charts/styles-g100.css";
import { mapGetters } from "vuex";
import { Link16 } from "@carbon/icons-vue";

Vue.use(chartsVue);

export default {
  name: "ProtocolStats",
  components: { Link16 },
  data() {
    return {
      chartData: [
        {
          group: "Visor Fee",
          date: "2019-01-01T07:00:00.000Z",
          value: 10000,
        },
        {
          group: "Visor Fee",
          date: "2019-02-05T07:00:00.000Z",
          value: 65000,
        },
        {
          group: "Visor Fee",
          date: "2019-03-08T07:00:00.000Z",
          value: 10000,
        },
        {
          group: "Visor Fee",
          date: "2019-04-13T07:00:00.000Z",
          value: 49213,
        },
        {
          group: "Visor Fee",
          date: "2019-05-17T07:00:00.000Z",
          value: 51213,
        },
        {
          group: "Invested Fees",
          date: "2019-01-01T07:00:00.000Z",
          value: 20000,
        },
        {
          group: "Invested Fees",
          date: "2019-02-05T07:00:00.000Z",
          value: 25000,
        },
        {
          group: "Invested Fees",
          date: "2019-03-08T07:00:00.000Z",
          value: 60000,
        },
        {
          group: "Invested Fees",
          date: "2019-04-13T07:00:00.000Z",
          value: 30213,
        },
        {
          group: "Invested Fees",
          date: "2019-05-17T07:00:00.000Z",
          value: 55213,
        },
        {
          group: "LP TVL",
          date: "2019-01-01T07:00:00.000Z",
          value: 30000,
        },
        {
          group: "LP TVL",
          date: "2019-02-05T07:00:00.000Z",
          value: 20000,
        },
        {
          group: "LP TVL",
          date: "2019-03-08T07:00:00.000Z",
          value: 40000,
        },
        {
          group: "LP TVL",
          date: "2019-04-13T07:00:00.000Z",
          value: 60213,
        },
        {
          group: "LP TVL",
          date: "2019-05-17T07:00:00.000Z",
          value: 25213,
        },
      ],
      chartOptions: {
        axes: {
          left: {
            stacked: true,
            scaleType: "linear",
            mapsTo: "value",
            title: "Cumulative Protocol TVL",
            ticks: {
              formatter: this.leftTickFormatter,
            },
          },
          bottom: {
            scaleType: "time",
            mapsTo: "date",
          },
        },
        color: {
          scale: {
            "Visor Fee": "#ff0038",
            "Invested Fees": "#FF007A",
            "LP TVL": "#FFFFFF",
          },
          gradient: {
            enabled: true,
          },
        },
        curve: "curveMonotoneX",
        tooltip: {
          customHTML: this.getToolTip,
        },
        zoomBar: {
          top: {
            enabled: true,
            data: [
              {
                date: "2019-01-01T07:00:00.000Z",
                value: 10000,
              },
              {
                date: "2019-02-02T07:00:00.000Z",
                value: 10,
              },
              {
                date: "2019-03-03T07:00:00.000Z",
                value: 75000,
              },
              {
                date: "2019-04-05T07:00:00.000Z",
                value: 65000,
              },
              {
                date: "2019-05-06T07:00:00.000Z",
                value: 57312,
              },
            ],
          },
        },
        height: "400px",
      },
    };
  },
  computed: {
    ...mapGetters({
      gammaStats: "GammaState/getGammaStats",
      gammaStakingApy: "GammaState/getGammaStakingApy",
      isGammaStatsLoading: "GammaState/getIsGammaStatsLoading",
    }),
  },
  // Watch any change from state or vuex
  watch: {},
  mounted() {},
  methods: {
    getToolTip({ 0: { group, TVL, value } }) {
      let groupColor = "";
      let valueLabel = "";

      switch (group) {
        case "Visor Fee":
          groupColor = "#ff0038";
          valueLabel = "Fees";
          break;
        case "Re-invested Uniswap Fees":
          groupColor = "#FF007A";
          valueLabel = "Uniswap Returns";
          break;
        case "Active LP Deposit (TVL)":
          groupColor = "#FFFFFF";
          valueLabel = "Deposits";
          break;
        default:
          break;
      }

      return `
        <div class='chart-tooltip'>
          <p style="border-left: 5px solid ${groupColor};">${group}</p>
          <p>Initial TVL <span>${TVL}</span></p>
          <p>${valueLabel} <span>$${value.toLocaleString("en-US")}</span></p>
        </div>
      `;
    },
  },
};
</script>

<style lang="scss">
@import "../assets/css/main-theme.scss";
</style>
