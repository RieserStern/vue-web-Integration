<template>
  <div class="page-backtest">
    <cv-grid class="page-cv-grid" kind="condensed">
      <cv-row>
        <cv-column :lg="3">
          <div class="backtest-side-bar">
            <!-- Pool -->
            <div class="left-form-item">
              <cv-dropdown label="Pool" value="usdc-0.3">
                <cv-dropdown-item value="usdc-0.3">
                  <span>Uniswap V3 USDC-WETH 0.3%</span>
                </cv-dropdown-item>
                <cv-dropdown-item value="usdt-0.3">
                  <span>Uniswap V3 WETH-USDT 0.3%</span>
                </cv-dropdown-item>
                <cv-dropdown-item value="usdc-0.05">
                  <span>Uniswap V3 USDC-WETH 0.05%</span>
                </cv-dropdown-item>
              </cv-dropdown>
            </div>
            <!-- Date range -->
            <div class="left-form-item">
              <cv-date-picker
                kind="range"
                :date-end-label="dateEndLabel"
                :cal-options="calOptions"
                :value="{
                  startDate: new Date(),
                  endDate: new Date(2040, 11, 8),
                }"
                @change="actionChange"
              >
              </cv-date-picker>
            </div>
            <!-- Price Range Size -->
            <div class="left-form-item">
              <cv-dropdown label="Price Range Size" value="5">
                <cv-dropdown-item value="5">
                  <span>-5% ~ +5%</span>
                  <span class="dropdown-subtitle">Aggressive range</span>
                </cv-dropdown-item>
                <cv-dropdown-item value="10">
                  <span>-10% ~ +10%</span>
                  <span class="dropdown-subtitle">Aggressive range</span>
                </cv-dropdown-item>
                <cv-dropdown-item value="20">
                  <span>-20% ~ +20%</span>
                  <span class="dropdown-subtitle">Robust range</span>
                </cv-dropdown-item>
                <cv-dropdown-item value="30">
                  <span>-30% ~ +30%</span>
                  <span class="dropdown-subtitle">Robust range</span>
                </cv-dropdown-item>
                <cv-dropdown-item value="40">
                  <span>-40% ~ +40%</span>
                  <span class="dropdown-subtitle">Conservative range</span>
                </cv-dropdown-item>
                <cv-dropdown-item value="50">
                  <span>-50% ~ +50%</span>
                  <span class="dropdown-subtitle">Conservative range</span>
                </cv-dropdown-item>
              </cv-dropdown>
            </div>
            <!-- Positive Value -->
            <div class="left-form-item">
              <cv-dropdown label="Positive Value" value="10000">
                <cv-dropdown-item value="10000">
                  <span>$10,000</span>
                </cv-dropdown-item>
              </cv-dropdown>
            </div>
            <!-- Rebalance Strategy -->
            <div class="left-form-item">
              <cv-dropdown label="Rebalance Strategy" value="no">
                <cv-dropdown-item value="no">
                  <span>No Strategy</span>
                </cv-dropdown-item>
                <cv-dropdown-item value="trading">
                  <span>Trend Trading Strategy Based Multi-factor</span>
                </cv-dropdown-item>
                <cv-dropdown-item value="bullish">
                  <span>Bullish Strategy</span>
                </cv-dropdown-item>
                <cv-dropdown-item value="bearish">
                  <span>Bearish Strategy</span>
                </cv-dropdown-item>
              </cv-dropdown>
            </div>
            <!-- Start Backtest button -->
            <div class="left-form-item">
              <cv-button
                class="btn-backtest btn-start-backtest"
                @click="fetchChartData"
              >
                <cv-inline-loading
                  v-if="isChartLoading"
                  loading-text=""
                  :state="isChartLoading ? 'loading' : ''"
                  class="icon-loading"
                >
                </cv-inline-loading>
                <span>Start Backtest</span>
              </cv-button>
            </div>
          </div>
        </cv-column>
        <cv-column :lg="9" class="backtest-body">
          <div class="card">
            <div class="card-header">
              <span class="card-title">Performance</span>
            </div>
            <div class="card-body performance-body">
              <cv-grid>
                <cv-row>
                  <cv-column :lg="2" class="box">
                    <span class="box-title">USDC-WETH 0.30%</span>
                    <span class="box-subtitle">Pool</span>
                  </cv-column>
                  <cv-column :lg="2" class="box">
                    <span class="box-title">2021/06/01 ~ 2021/08/03</span>
                    <span class="box-subtitle">Time Range</span>
                  </cv-column>
                  <cv-column :lg="2" class="box">
                    <span class="box-title">63</span>
                    <span class="box-subtitle">Total Days</span>
                  </cv-column>
                  <cv-column :lg="2" class="box">
                    <span class="box-title">10.00%</span>
                    <span class="box-subtitle">Price Range Size</span>
                  </cv-column>
                  <cv-column :lg="2" class="box">
                    <span class="box-title">No Strategy</span>
                    <span class="box-subtitle">Rebalance Strategy</span>
                  </cv-column>
                  <cv-column :lg="2" class="box">
                    <span class="box-title">- -</span>
                    <span class="box-subtitle">Rebalance Threshold</span>
                  </cv-column>
                </cv-row>
                <cv-row>
                  <cv-column :lg="2" class="box">
                    <span class="box-title color-primary">76.32%</span>
                    <span class="box-subtitle">Gross Fee APR</span>
                  </cv-column>
                  <cv-column :lg="2" class="box">
                    <span class="box-title color-primary">13.17%</span>
                    <span class="box-subtitle">Gross Fee Return</span>
                  </cv-column>
                  <cv-column :lg="2" class="box">
                    <span class="box-title color-primary">72.82%</span>
                    <span class="box-subtitle">Net APR</span>
                  </cv-column>
                  <cv-column :lg="2" class="box">
                    <span class="box-title color-primary">12.57%</span>
                    <span class="box-subtitle">Net Return</span>
                  </cv-column>
                  <cv-column :lg="2" class="box">
                    <span class="box-title color-primary">0</span>
                    <span class="box-subtitle">Rebalance Times</span>
                  </cv-column>
                  <cv-column :lg="2" class="box">
                    <span class="box-title color-primary">0.00%</span>
                    <span class="box-subtitle">Rebalance Winning Ratio</span>
                  </cv-column>
                </cv-row>
                <cv-row>
                  <cv-column :lg="2" class="box">
                    <span class="box-title">16.68%</span>
                    <span class="box-subtitle">Max Drawdown</span>
                  </cv-column>
                  <cv-column :lg="2" class="box">
                    <span class="box-title">44.76%</span>
                    <span class="box-subtitle">Volatility</span>
                  </cv-column>
                  <cv-column :lg="2" class="box">
                    <span class="box-title">1.6271</span>
                    <span class="box-subtitle">Sharpe Ratio</span>
                  </cv-column>
                </cv-row>
              </cv-grid>
              <cv-grid>
                <!-- Graph -->
                <div class="graph-container">
                  <ccv-area-chart :data="chartData" :options="chartOptions" />
                </div>
              </cv-grid>
            </div>
          </div>
          <!-- Market card -->
          <div class="card">
            <div class="card-header">
              <span class="card-title">Market</span>
            </div>
            <div class="card-body">
              <cv-grid>
                <cv-row>
                  <cv-column :sm="2" :lg="2" class="box">
                    <span class="box-title">$2,539.2160</span>
                    <span class="box-subtitle">Open Price</span>
                  </cv-column>
                  <cv-column :sm="2" :lg="2" class="box">
                    <span class="box-title">$2,613.6663</span>
                    <span class="box-subtitle">Close Price</span>
                  </cv-column>
                  <cv-column :sm="2" :lg="2" class="box">
                    <span class="box-title">$2,885.9352</span>
                    <span class="box-subtitle">High Price</span>
                  </cv-column>
                  <cv-column :sm="2" :lg="2" class="box">
                    <span class="box-title">$1,697.8717</span>
                    <span class="box-subtitle">Low Price</span>
                  </cv-column>
                  <cv-column :sm="2" :lg="2" class="box">
                    <span class="box-title color-primary">2.93%</span>
                    <span class="box-subtitle">Change</span>
                  </cv-column>
                  <cv-column :sm="2" :lg="2" class="box">
                    <span class="box-title">46.79%</span>
                    <span class="box-subtitle">Amplitude</span>
                  </cv-column>
                </cv-row>
              </cv-grid>
            </div>
          </div>
          <!-- Activity card -->
          <div class="card">
            <div class="card-header">
              <span class="card-title">Activity</span>
            </div>
            <div class="card-body">
              <div class="activity-overview">
                <div class="activity-grid backtest-primary">
                  <cv-grid>
                    <cv-row>
                      <cv-column :lg="4" class="activity-grid-column">
                        <span>Initial Position</span>
                        <span>4,985.0000 USDC</span>
                        <span>1.9632 WETH</span>
                      </cv-column>
                      <cv-column :lg="4" class="activity-grid-column">
                        <span>Final Position</span>
                        <span>7,995.4885 USDC</span>
                        <span>0.7946 WETH</span>
                      </cv-column>
                      <cv-column :lg="4" class="activity-grid-column">
                        <span>Fees Collected</span>
                        <span>659.4889 USDC</span>
                        <span>0.2517 WETH</span>
                      </cv-column>
                    </cv-row>
                  </cv-grid>
                </div>
              </div>
              <div class="activity-table">
                <cv-data-table :columns="columns" :data="filteredData">
                </cv-data-table>
              </div>
            </div>
          </div>
        </cv-column>
      </cv-row>
    </cv-grid>
  </div>
</template>

<script>
import Vue from "vue";
import chartsVue from "@carbon/charts-vue";
import "@carbon/charts/styles-g100.css";
import { PairContractAddress } from "@/constants";

Vue.use(chartsVue);

export default {
  name: "Chart",
  components: {},
  data() {
    return {
      isChartLoading: false,
      pair: "PERP-WETH",
      chartData: [],
      columns: [
        "Time",
        "Type",
        "Liquidity",
        "Price",
        "Fees Collected",
        "Rebalance Loss",
        "Net Profit",
      ],
      filteredData: [
        [
          "2021-06-01 12:00",
          "Add Liquidity",
          "4,985.0000 USDC + 1.9632 WETH",
          "2,539.2160",
          "0%",
          "0%",
          "0%",
        ],
        [
          "2021-08-02 11:59",
          "Remove Liquidity",
          "7,995.4885 USDC + 0.7946 WETH",
          "2,613.6663",
          "13.0210%",
          "-0.4331%",
          "12.5878%",
        ],
      ],
    };
  },
  computed: {
    chartOptions() {
      return {
        legend: {
          enabled: true,
        },
        bounds: {
          upperBoundMapsTo: "max",
          lowerBoundMapsTo: "min",
        },
        axes: {
          bottom: {
            title: "Active Liquidity Range Time Series",
            mapsTo: "date",
            scaleType: "time",
          },
          left: {
            mapsTo: "value",
            scaleType: "linear",
            includeZero: false,
          },
        },
        color: {
          scale: {
            [this.pair]: "#ff0038",
          },
        },
        tooltip: {
          customHTML: this.getToolTip,
        },
        data: {
          loading: this.isChartLoading,
        },
        curve: "curveNatural",
        height: "400px",
      };
    },
  },
  mounted() {
    this.fetchChartData();
  },
  methods: {
    async fetchChartData() {
      this.isChartLoading = true;
      await fetch(
        "https://visordata-o9v9w.ondigitalocean.app/charts/baseRange/all"
      )
        .then((response) => response.json())
        .then((pairs) => {
          this.chartLoading = false;
          this.chartData = pairs[PairContractAddress[this.pair]];
        })
        .catch((err) => {
          console.log(err);
        });
      this.isChartLoading = false;
    },
  },
};
</script>

<style lang="scss">
@import "../assets/css/main-theme.scss";
</style>
