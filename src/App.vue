<template>
  <div :class="themeMode">
    <div id="app">
      <Header :is-dark-mode="isDarkMode" :on-theme-switch="handleThemeSwitch" />
      <router-view />
      <Footer />
    </div>
  </div>
</template>

<script>
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
// import Web3 from "web3";

export default {
  name: "App",
  components: { Header, Footer },
  data() {
    return {
      isDarkMode: true,
    };
  },
  computed: {
    currentRouteName() {
      return this.$route.name;
    },
    themeMode() {
      return this.isDarkMode ? "main-dark--theme" : "main-light--theme";
    },
  },
  methods: {
    handleThemeSwitch(value) {
      this.isDarkMode = value;
    },
  },
};
</script>

<style lang="scss">
@import "./assets/css/main-theme.scss";
</style>
