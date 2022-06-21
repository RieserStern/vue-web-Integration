<template>
  <div class="wrapper">
    <div class="stat-title">
      {{ title }}
    </div>
    <div
      v-if="loading"
      class="num"
    >
      <cv-skeleton-text />
    </div>
    <div
      v-else
      :class="type"
      class="num"
    >
      {{ num }}
      <span
        v-if="type === 'fraction'"
        class="denominator"
      >
        / {{ denominator }}
      </span>
      <b-icon
        v-if="type === 'risk'"
        icon="arrow-up-right"
      />
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import "@carbon/charts/styles-g100.css";
import chartsVue from "@carbon/charts-vue";
Vue.use(chartsVue);

export default {
  name: "Stat",
  components: {},
  props: {
    title: {
      type: String
    },
    num: {
      type: [String, Number]
    },
    loading: {
      type: Boolean
    },
    type: {
      type: String,
      default: "normal"
    },
    denominator: {
      type: String
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/css/main-theme.scss";
</style>
