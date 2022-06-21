<template>
  <div class="chart-wrapper meter">
    <cv-skeleton-text v-if="loading" />
    <ccv-meter-chart v-else :data="chartData" :options="chartOptions" />
  </div>
</template>

<script>
import Vue from "vue";
import "@carbon/charts/styles-g100.css";
import chartsVue from "@carbon/charts-vue";
Vue.use(chartsVue);

export default {
  name: "Meter",
  components: {},
  props: {
    loading: {
      type: Boolean,
    },
    value: {
      type: Number,
    },
  },
  data() {
    return {
      chartOptions: {
        meter: {
          peak: 100,
        },
        color: {
          scale: {
            "VISR Staking APY": "#ff0038",
          },
        },
      },
    };
  },
  computed: {
    chartData() {
      return [
        {
          group: "VISR Staking APY",
          value: this.value,
        },
      ];
    },
  },
};
</script>

<style lang="scss">
@import "@/assets/css/variables.scss";

#app .chart-wrapper.meter {
  padding: 0;
  margin: 0;
  .bx--chart-holder {
    padding: 0;
  }
  .bx--skeleton__text {
    height: 6rem;
  }
  .bx--cc--meter-title text.percent-value {
  }
}
</style>
