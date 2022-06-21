<template>
  <li
    v-if="loading"
    class="playbook-list-item"
  >
    <h6 class="playbook-list-item--title loading">
      <cv-skeleton-text />
    </h6>
    <p class="playbook-list-item--desc loading">
      <cv-skeleton-text />
    </p>
  </li>
  <li
    v-else
    class="playbook-list-item"
  >
    <h6 class="playbook-list-item--title">
      {{ title }}
    </h6>
    <p class="playbook-list-item--desc">
      {{ desc }}
    </p>
  </li>
</template>

<script>
import Vue from "vue";
import "@carbon/charts/styles-g100.css";
import chartsVue from "@carbon/charts-vue";
Vue.use(chartsVue);

export default {
  name: "FeeDistributionListItem",
  components: {},
  props: {
    title: {
      type: String
    },
    desc: {
      type: String
    },
    loading: {
      type: Boolean
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../assets/css/main-theme.scss";
</style>
