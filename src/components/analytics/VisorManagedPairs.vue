<template>
  <cv-row>
    <cv-column :sm="12" :md="12" :lg="8" class="main-column">
      <div class="column-inner-wrapper main left">
        <cv-row>
          <cv-column :sm="12" :md="12" :lg="12">
            <cv-row>
              <div class="chart-wrapper">
                <div class="chart-title">
                  <cv-row>
                    <cv-column :md="12" :lg="6"> {{ pair }} Pair </cv-column>
                    <cv-column :md="12" :lg="6" class="gamma-link">
                      <a href="http://gammastrategies.org/" target="_blank">
                        Managed by Gamma Strategies
                        <Launch16 class="icon-launch" />
                      </a>
                    </cv-column>
                  </cv-row>
                </div>
                <div class="chart-description">
                  Real Time Active Liquidity Ranges
                </div>
                <ccv-area-chart
                  v-if="chartData.length > 0 || chartLoading"
                  :data="chartData"
                  :options="chartOptions"
                />
                <div class="no-chart-data-wrapper" v-else>
                  Chart Data not available
                </div>
              </div>
            </cv-row>
          </cv-column>
        </cv-row>
      </div>
    </cv-column>
    <cv-column :sm="12" :md="12" :lg="4" class="no-mb">
      <cv-row>
        <cv-column :sm="12" :md="12" :lg="12">
          <div class="column-inner-wrapper">
            <h6 class="title">
              Uniswap v3 Pairs Under Management
            </h6>
            <p class="description">
              Total
            </p>
            <cv-row>
              <cv-column :sm="12" :md="6" :lg="6">
                <Stat
                  :loading="isPairStatsLoading"
                  title="TVL in Uni v3 Pair"
                  :num="pairStats.poolTvlUSD"
                />
              </cv-column>
              <cv-column :sm="12" :md="6" :lg="6">
                <Stat
                  :loading="isPairStatsLoading"
                  title="TVL in GAMMA Position"
                  :num="pairStats.tvlUSD"
                />
              </cv-column>
            </cv-row>
          </div>
        </cv-column>
        <cv-column :sm="12" :md="12" :lg="12">
          <div class="column-inner-wrapper">
            <h6 class="title">
              Uniswap v3 Generated Fees
            </h6>
            <p class="description">
              Total
            </p>
            <cv-row>
              <cv-column :sm="12" :md="6" :lg="6">
                <Stat
                  :loading="isPairStatsLoading"
                  title="Fees Generated"
                  :num="pairStats.grossFeesClaimedUSD"
                />
              </cv-column>
              <cv-column :sm="12" :md="6" :lg="6">
                <Stat
                  :loading="isPairStatsLoading"
                  title="Fee Based APR"
                  :num="pairStats.feeBasedApr"
                />
              </cv-column>
            </cv-row>
          </div>
        </cv-column>
        <cv-column class="meter-column" :sm="12" :md="12" :lg="12">
          <div class="column-inner-wrapper">
            <h6 class="title">
              Uniswap v3 Position Range Status
            </h6>
            <p class="description">
              Current
            </p>
            <ManagedPairMeter :loading="isPairStatsLoading" />
          </div>
        </cv-column>
      </cv-row>
    </cv-column>
  </cv-row>
</template>
<script>
import Vue from "vue";
import chartsVue from "@carbon/charts-vue";
import "@carbon/charts/styles-g100.css";
import { Launch16 } from "@carbon/icons-vue";
import Stat from "@/components/Stat";
import ManagedPairMeter from "@/components/charts/ManagedPairMeter";
import { PairContractAddress } from "@/constants";

Vue.use(chartsVue);

const MILLION = 1;
const THOUSAND = 2;
const PERCENT = 3;

export default {
  name: "VisorManagedPairs",
  components: {
    Stat,
    ManagedPairMeter,
    Launch16
  },
  props: {
    pair: {
      type: String
    }
  },
  data() {
    return {
      pairStats: {},
      chartData: [],
      chartLoading: true,
      isPairStatsLoading: true
    };
  },
  computed: {
    chartOptions() {
      return {
        legend: {
          enabled: true
        },
        bounds: {
          upperBoundMapsTo: "max",
          lowerBoundMapsTo: "min"
        },
        axes: {
          bottom: {
            title: "Active Liquidity Range Time Series",
            mapsTo: "date",
            scaleType: "time"
          },
          left: {
            mapsTo: "value",
            scaleType: "linear",
            includeZero: false
          }
        },
        color: {
          scale: {
            [this.pair]: "#c4c4c4"
          }
        },
        tooltip: {
          customHTML: this.getToolTip
        },
        data: {
          loading: this.chartLoading
        },
        curve: "curveNatural",
        height: "400px"
      };
    }
  },
  mounted() {
    this.fetchChartData();
    this.fetchPairStatsData();
  },
  methods: {
    async fetchPairStatsData() {
      await fetch(
        "https://visordata-o9v9w.ondigitalocean.app/hypervisors/allData"
      )
        .then(response => response.json())
        .then(pairStatsData => {
          this.pairStats = this.formatPairStats(
            pairStatsData[PairContractAddress[this.pair]]
          );
          this.isPairStatsLoading = false;
        })
        .catch(err => {
          console.log(err);
        });
    },
    async fetchChartData() {
      await fetch(
        "https://visordata-o9v9w.ondigitalocean.app/charts/baseRange/all"
      )
        .then(response => response.json())
        .then(pairs => {
          this.chartLoading = false;
          this.chartData = pairs[PairContractAddress[this.pair]];
        })
        .catch(err => {
          console.log(err);
        });
    },
    formatPairStats(stats) {
      return {
        ...stats,
        poolTvlUSD: this.formatStat(stats.poolTvlUSD),
        tvlUSD: this.formatStat(stats.tvlUSD),
        grossFeesClaimedUSD: this.formatStat(stats.grossFeesClaimedUSD),
        feeBasedApr: this.formatStat(stats.returns.weekly.feeApr, true)
      };
    },
    roundStat(stat) {
      return stat > 99 ? Math.round(stat) : stat;
    },
    formatStat(value, isPercent = false, currency = "$") {
      let type = isPercent ? PERCENT : -1;
      if (!isPercent) {
        if (value > 999999) {
          type = MILLION;
        } else if (value > 99) {
          type = THOUSAND;
        }
      }

      switch (type) {
        case MILLION:
          return `${currency}${this.roundStat(
            Math.round((value / 1000000) * 100) / 100
          )}M`;
        case THOUSAND:
          return `${currency}${Math.round((value * 10) / 1000) / 10}K`;
        case PERCENT:
          return `${Math.round(value * 100 * 100) / 100}%`;
        default:
          return `${currency}${Math.round(value * 100) / 100}`;
      }
    },
    getToolTip({ 0: { group, date, value, min, max } }) {
      const month = date.toLocaleString("default", { month: "long" });
      let hour = "";
      if (date.getHours() > 12 && date.getHours() < 24) {
        hour = (date.getHours() % 12) + " PM";
      } else {
        hour = (date.getHours() % 12) + " AM";
      }

      return `
        <div class='chart-tooltip'>
          <p>Pair <span>${group}</span></p>
          <p>Date <span>${month} ${date.getDate()}, ${hour}</span></p>
          <p>Upper Band <span>${max}</span></p>
          <p>Price <span>${value}</span></p>
          <p>Lower Band <span>${min}</span></p>
        </div>
      `;
    }
  }
};
</script>
