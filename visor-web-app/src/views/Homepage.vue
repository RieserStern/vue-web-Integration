<template>
  <div class="home main-content">
    <div class="home-inner">
      <div class="tile-wrapper">
        <div class="large_tile_group">
          <div class="c_tile large_tile" @click="navigateDash()">
            <CheckmarkFilled16 class="checkmark" />
            <div class="tileHeader">Provide Active Liquidity</div>
            <div class="tileBody">
              Provide liquidity to a variety of high returning, actively managed
              Uniswap v3 pairs
            </div>
            <div class="tileFooter">
              <svg
                width="18"
                height="16"
                viewBox="0 0 18 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M10.8 0.800003L9.8 1.8L15.2 7.3H0V8.7H15.2L9.8 14.2L10.8 15.2L18 8L10.8 0.800003Z"
                />
              </svg>
            </div>
          </div>
        </div>
        <div class="middle_tile_group">
          <div class="c_tile middle_tile" @click="navigateAnalytics()">
            <CheckmarkFilled16 class="checkmark" />
            <div class="tileHeader">Performance Analytics</div>
            <div class="tileBody">
              View analytics of Uniswap v3 active management strategies
            </div>
            <div class="tileFooter">
              <svg
                width="18"
                height="16"
                viewBox="0 0 18 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M10.8 0.800003L9.8 1.8L15.2 7.3H0V8.7H15.2L9.8 14.2L10.8 15.2L18 8L10.8 0.800003Z"
                />
              </svg>
            </div>
          </div>

          <div class="c_tile middle_tile" @click="navigateInfo()">
            <CheckmarkFilled16 class="checkmark" />
            <div class="tileHeader">Stake GAMMA</div>
            <div class="tileBody">
              Stake GAMMA and receive fee distributions daily from protocol
              revenue
            </div>
            <div class="tileFooter">
              <svg
                width="18"
                height="16"
                viewBox="0 0 18 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fill-rule="evenodd"
                  clip-rule="evenodd"
                  d="M10.8 0.800003L9.8 1.8L15.2 7.3H0V8.7H15.2L9.8 14.2L10.8 15.2L18 8L10.8 0.800003Z"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

import AddSvg from "../assets/svg/add.svg";
import ArrowRight from "../assets/svg/arrow-right-white.svg";
import CheckMark from "../assets/svg/checkmark.svg";
import Information from "../assets/svg/information.svg";
import Launch from "../assets/svg/launch.svg";
import CheckmarkFilled16 from "@carbon/icons-vue/es/checkmark--filled/16";

export default {
  name: "Home",
  components: {
    CheckmarkFilled16,
  },
  data() {
    return {
      addSvg: AddSvg,
      arrowRight: ArrowRight,
      checkMark: CheckMark,
      information: Information,
      launch: Launch,
      page: 0,
      type: "loading",
      header: "Loading notification",
      subHeader: "Roius abnta mod tempor",
      visible: false,
    };
  },
  methods: {
    navigateAnalytics() {
      this.$router.push({
        // name: "VisorProtocolOverview"
        name: "PERP-ETH",
      });
    },
    navigateInfo() {
      // window.open("https://medium.com/gamma-strategies", "_blank");
      this.$router.push({ name: "Visr" });
    },
    navigateDash() {
      this.$router.push({ name: "Dashboard" });
    },
  },
};
</script>

<style lang="scss">
@import "../assets/css/main-theme.scss";
</style>
