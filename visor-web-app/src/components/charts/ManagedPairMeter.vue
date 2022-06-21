<template>
  <div class="chart-wrapper managed-pair-meter">
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
  name: "ManagedPairMeter",
  components: {},
  props: {
    loading: {
      type: Boolean,
    },
  },
  data() {
    return {
      chartData: [
        {
          group: "GAMMA Position : In Range ",
          value: 50,
        },
      ],
      chartOptions: {
        meter: {
          peak: 100,
        },
        color: {
          scale: {
            "GAMMA Position : In Range ": "#ff0038",
          },
        },
      },
    };
  },
};
</script>

<style lang="scss">
@import "@/assets/css/variables.scss";

#app .chart-wrapper.managed-pair-meter {
  padding: 0;
  margin: 0;
  .bx--chart-holder {
    padding: 0;
  }
  .bx--skeleton__text {
    height: 6rem;
  }
  div .meter-title {
    height : 30px;
  }
  svg.bx--cc--chart-svg text.meter-title {
    font-weight: 400;
  }
  .bx--cc--meter-title text.percent-value {
    display: none;
  }
}
</style>
