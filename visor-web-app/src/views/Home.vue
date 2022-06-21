<template>
  <div class="home">
    <div
      class="
      home-inner"
    >
      <h2 class="page-header">
        Interact with DeFi protocols through an NFT; Enhancing the discovery,
        reputation, safety and
        <br>
        programmability of on-chain liquidity
      </h2>
      <div class="tile-wrapper">
        <div class="large_tile_group">
          <div
            class="c_tile large_tile"
            :class="{ active: page === 1 }"
            @click="goTo('Lorem1')"
          >
            <CheckmarkFilled16 class="checkmark" />
            <div class="tileHeader">
              Mint your Visor Smart Vault NFT
            </div>
            <div class="tileBody">
              Minting your vault is very easy, give it a try
            </div>
            <div class="tileFooter">
              <img :src="addSvg">
            </div>
          </div>
        </div>
        <div class="middle_tile_group">
          <a
            href="https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=0xf938424f7210f31df2aee3011291b658f872e91e"
            target="_blank"
            style="text-decoration: none;"
          >
            <div
              class="c_tile middle_tile"
              :class="{ active: page === 2 }"
            >
              <CheckmarkFilled16 class="checkmark" />
              <div class="tileHeader">
                Find VISR token on Uniswap
              </div>
              <div class="tileBody">
                VISR is now on Uniswap
              </div>
              <div class="tileFooter">
                <img :src="checkMark">
              </div>
            </div>
          </a>
          <div
            class="c_tile middle_tile"
            :class="{ active: page === 3 }"
            @click="goTo('3')"
          >
            <CheckmarkFilled16 class="checkmark" />
            <div class="tileHeader">
              Access your Visor Smart Vault
            </div>
            <div class="tileBody">
              If you have already minted a Visor NFT, click here to access it
            </div>
            <div class="tileFooter">
              <img :src="arrowRight">
            </div>
          </div>
        </div>
        <div class="small_tile_group">
          <div
            class="c_tile small_tile"
            :class="{ active: page === 4 }"
            @click="goTo('Lorem1')"
          >
            <CheckmarkFilled16 class="checkmark" />
            <div class="tileHeader">
              Rewards Whitelist
            </div>
            <div class="tileBody">
              If you've minted a Visor NFT, you're eligible to start earning
              rewards
            </div>
            <div class="tileFooter">
              <img :src="launch">
            </div>
          </div>
          <a
            :href="'https://medium.com/visorfinance'"
            style="text-decoration:none;"
            target="_blank"
          >
            <div
              class="c_tile small_tile"
              :class="{ active: page === 5 }"
              @click="goTo('5')"
            >
              <CheckmarkFilled16 class="checkmark" />
              <div class="tileHeader">
                About Visor
              </div>
              <div class="tileBody">
                Read our Medium posts
              </div>
              <div class="tileFooter">
                <img :src="information">
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src

import AddSvg from "../assets/svg/add.svg";
import ArrowRight from "../assets/svg/arrow-right.svg";
import CheckMark from "../assets/svg/checkmark.svg";
import Information from "../assets/svg/information.svg";
import Launch from "../assets/svg/launch.svg";
import CheckmarkFilled16 from "@carbon/icons-vue/es/checkmark--filled/16";

export default {
  name: "Home",
  components: {
    CheckmarkFilled16
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
      visible: false
    };
  },
  methods: {
    goTo(page) {
      if (page === "Lorem1") {
        this.page = 1;
        setTimeout(() => {
          this.$router.push({ name: "Dashboard" });
        }, 300);
      } else if (page === "Address") {
        this.page = 4;
        setTimeout(() => {
          this.$router.push({ name: "Address" });
        }, 300);
      } else if (page === "3") {
        this.page = 3;
        setTimeout(() => {
          this.$router.push({ name: "Dashboard" });
        }, 300);
      } else if (page === "4") {
        this.page = 4;
      } else if (page === "5") {
        this.page = 5;
      }
    }
  }
};
</script>

<style lang="scss">
.home {
  width: 100%;
  overflow: auto;
  background: #262626;
  display: flex;
  align-items: center;
  .home-inner {
    width: 70%;
    height: auto;
    margin: 0 auto;
    margin-bottom: 100px;
    max-width: 1000px;
    .page-header {
      color: white;
      text-align: initial;
      max-width: 485px;
      font-size: 25px;
      word-break: break-word;
      margin-top: 100px;
      margin-bottom: 30px;
    }
    .tile-wrapper {
      display: flex;
      height: 401px;
      .large_tile_group {
        width: 50%;
        margin-right: 4px;
      }
      .middle_tile_group {
        width: 30%;
        margin-right: 4px;
      }
      .small_tile_group {
        width: 20%;
      }
      .c_tile {
        position: relative;
        padding: 20px;
        background: #161616;
        width: 100%;
        height: 50%;
        margin-bottom: 4px;
        text-decoration: none;
        display: flex;
        flex-flow: column;
        cursor: pointer;
        border: 1px transparent solid;
        &:hover {
          color: #f4f4f4;
          background-color: #1b1b1b;
        }
        &.active {
          border: 1px white solid;
          color: white;
          box-sizing: border-box;
          .checkmark {
            display: block;
          }
        }
        &.large_tile {
          height: calc(100% + 4px);
          width: 100%;
          margin-bottom: 0;
        }
        .checkmark {
          position: absolute;
          right: 15px;
          display: none;
        }
        .tileHeader {
          color: white;
          margin-bottom: 10px;
          font-size: 15px;
        }
        .tileBody {
          color: #e2e2e2;
          font-size: 13px;
          margin-top: 25px;
          flex: 1;
        }
        .tileFooter {
          img {
            display: block;
            margin-left: auto;
          }
        }
      }
    }
    @media only screen and (max-width: 1170px) {
      .tile-wrapper {
        .large_tile_group,
        .middle_tile_group,
        .small_tile_group {
          width: 100%;
        }
      }
    }
    @media only screen and (max-width: 1000px) {
      .tile-wrapper {
        display: flex;
        height: auto;
        flex-wrap: wrap;
        .large_tile_group,
        .middle_tile_group,
        .small_tile_group {
          width: 100%;
        }
        .large_tile_group {
          margin-bottom: 8px;
        }
        .middle_tile_group {
          margin-bottom: 8px;
        }
        .small_tile_group {
          margin-right: 4px;
        }
      }
    }
  }
}
</style>
