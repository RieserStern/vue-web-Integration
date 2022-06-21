<template>
  <div class="strategy-page">
    <div class="chart">
      <div class="chart-inner">
        <div class="row page-title-wrapper">
          <div class="column">
            <img
              src="../assets/svg/GAMMA.svg"
              alt="GAMMA LOGO"
              width="150"
            >
            <p>
              Gamma's first published active <br class="mobile-break">
              liquidity management strategy
            </p>
          </div>
          <!-- <div class="column apy-percent"> -->
          <!--   {{ apy_percent }}% APR -->
          <!-- </div> -->
        </div>
        <div class="chart-wrapper">
          <div class="chart-title">
            Strategy One
          </div>
          <div class="chart-description">
            Real Time Active Liquidity Ranges
          </div>
          <ccv-area-chart
            :data="bollingerBandsChartData"
            :options="bollingerBandsChartOptions"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import "@carbon/charts/styles-g100.css";
import chartsVue from "@carbon/charts-vue";

Vue.use(chartsVue);

export default {
  name: "Strategy",
  components: {},
  data() {
    return {
      apy_percent: 365,
      bollingerBandsChartData: [],
      bollingerBandsChartOptions: {
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
            "WETH-USDT": "#c4c4c4"
          }
        },
        tooltip: {
          customHTML: this.getToolTip
        },
        data: {
          loading: true
        },
        curve: "curveNatural",
        height: "400px"
      }
    };
  },
  mounted() {
    this.fetchAPIData();
  },
  methods: {
    async fetchAPIData() {
      await fetch(
        "https://visordata-o9v9w.ondigitalocean.app/bollingerBandsChartData/0x4e68ccd3e89f51c3074ca5072bbac773960dfa36?periodHours=24"
      )
        .then(response => response.json())
        .then(({ data: chartData }) => {
          this.bollingerBandsChartData = chartData;
          this.bollingerBandsChartOptions.data.loading = false;
        })
        .catch(err => {
          console.log(err);
        });
    },
    getToolTip({ 0: { group, date, value, min, max } }) {
      const month = date.toLocaleString("default", { month: "long" });
      let hour = "";
      if (date.getHours() > 12 && date.getHours() < 24) {
        hour = (date.getHours() % 12) + " PM123123";
      } else {
        hour = (date.getHours() % 12) + " AM12313";
      }

      return `
        <div class='chart-tooltip'>
          <p>Pair <span>${group}</span></p>
          <p>Date <span>${month} ${date.getDate()}, ${hour}</span></p>
          <p>Price <span>${this.formatVal(value)}</span></p>
          <p>Lower Band <span>${this.formatVal(min)}</span></p>
          <p>Upper Band <span>${this.formatVal(max)}</span></p>
        </div>
      `;
    },
    formatVal(value) {
      return (Math.round(value * 100) / 100).toFixed(2);
    }
  }
};
</script>

<style lang="scss">
@import "../assets/css/main-theme.scss";
</style>
