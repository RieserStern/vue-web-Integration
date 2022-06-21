<template>
  <div class="migrate-pool-wrapper">
    <div class="migrate-pool-container">
      <div class="pool-title">Migrate V2 Pool</div>
      <div class="pool-subtitle">
        We will safely migrate your V2 liquidity on Uniswap / Suhiswap to our V3
        hypervisors
      </div>
      <div class="pool-v2">
        <div class="pool-header">
          <div class="token-icons">
            <div class="first-icon"></div>
            <div class="second-icon"></div>
          </div>
          <div class="name">
            {{ name }}
          </div>
          <img :src="uniswapSVG" class="uniswap-img" />
        </div>
        <template v-if="isLoading">
          <div class="pool-slider">
            <cv-skeleton-text></cv-skeleton-text>
          </div>
          <div class="pool-footer">
            <cv-skeleton-text></cv-skeleton-text>
          </div>
        </template>
        <template v-else>
          <div class="pool-slider">
            <cv-slider
              v-model="migratePercentage"
              label="Migrate assets based on (%)"
              min="0"
              max="100"
              value="0"
              step="1"
              step-multiplier="10"
              min-label="0%"
              max-label="100"
            >
            </cv-slider>
            <cv-text-input
              :value="migratePercentage + '%'"
              class="slider-percentage-input"
            />
            <cv-link class="slider-max-button" @click="onMaxMigrate">
              Max
            </cv-link>
          </div>
          <div class="pool-amount">
            <div class="amount-row">
              <span>Amount of {{ firstToken }}</span>
              <span class="value">34556 {{ firstToken }}</span>
            </div>
            <div class="amount-row">
              <span>Amount of {{ secondToken }}</span>
              <span class="value">250 {{ secondToken }}</span>
            </div>
            <div class="amount-row">
              <span>Current APR</span>
              <span class="value">43.00%</span>
            </div>
          </div>
          <div class="pool-footer">
            <div class="amount-row">
              <span>Total Liquidity Migrated</span>
              <span class="value">$12,405.00</span>
            </div>
          </div>
        </template>
      </div>
      <div class="pool-divider">
        <img src="@/assets/svg/vector.svg" />
      </div>
      <div class="pool-v2 pool-v3">
        <div class="pool-header">
          <div class="token-icons">
            <div class="first-icon"></div>
            <div class="second-icon"></div>
          </div>
          <div class="name">
            {{ name }}
          </div>
          <div class="version">
            Hypervisor
          </div>
        </div>
        <template v-if="isLoading">
          <div class="pool-amount">
            <cv-skeleton-text></cv-skeleton-text>
          </div>
          <div class="pool-footer">
            <cv-skeleton-text></cv-skeleton-text>
          </div>
        </template>
        <template v-else>
          <div class="pool-amount">
            <div class="amount-row">
              <span class="label">Total Value Locked</span>
              <span class="value">$139,320.00</span>
            </div>
            <div class="amount-row">
              <span class="label">Current APR</span>
              <span class="value">
                <Flash16 />
                400.00%
              </span>
            </div>
            <div class="amount-row">
              <span class="label">
                WETH-USDT Pool Ratio:
                <Information16 />
              </span>
              <span class="value">58:42</span>
            </div>
            <div class="amount-row">
              <span>Manager</span>
              <span class="value">
                0xE2F8...60Ec
                <Link16 />
              </span>
            </div>
          </div>
          <div class="pool-footer">
            <!-- <div class="amount-row">
              <ccv-meter-chart :data="chartData" :options="chartOptions" />
            </div> -->
          </div>
        </template>
      </div>
    </div>
    <div class="migrate-pool-action">
      <cv-row>
        <cv-column :sm="2" :lg="6">
          <cv-button
            class="btn-cancel btn-migrate"
            kind="secondary"
            @click="onBack"
            >Back</cv-button
          >
        </cv-column>
        <cv-column :sm="2" :lg="6">
          <cv-button class="btn-migrate" :disabled="isLoading">Migrate</cv-button>
        </cv-column>
      </cv-row>
    </div>
  </div>
</template>
<script>
import Vue from "vue";
import { Information16 } from "@carbon/icons-vue";
import { Flash16 } from "@carbon/icons-vue";
import { Link16 } from "@carbon/icons-vue";
import chartsVue from "@carbon/charts-vue";
import "@carbon/charts/styles.css";
import UNISWAP_SVG from "../../assets/svg/uniswap.svg";

Vue.use(chartsVue);

export default {
  name: "MigratePool",
  components: { Flash16, Information16, Link16 },
  props: {
    name: {
      type: String,
      default: null
    },
    onMigrate: {
      type: Function,
      default: () => {}
    },
    onBack: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {
      isLoading: false,
      migratePercentage: "0",
      uniswapSVG: UNISWAP_SVG,
      chartData: [
        {
          group: "emails",
          value: 10
        },
        {
          group: "photos",
          value: 10
        },
        {
          group: "text messages",
          value: 723
        },
        {
          group: "other",
          value: 120
        }
      ],
      chartOptions: {
        title: "Proportional Meter Chart",
        meter: {
          proportional: {
            total: 2000,
            unit: "GB"
          }
        },
        color: {
          title: "Proportional Meter Chart",
          // height: "130px",
          meter: {
            proportional: {
              total: 2000,
              unit: "GB"
            }
          },
          color: {
            pairing: {
              option: 2
            }
          }
        }
      }
    };
  },
  computed: {
    firstToken() {
      return this.name.split("-")[0];
    },
    secondToken() {
      return this.name.split("-")[1];
    }
  },
  watch: {},
  async mounted() {},
  methods: {
    handleMigrate() {
      this.onSelectPool(this.name);
    },
    onMaxMigrate() {
      this.migratePercentage = "100";
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/css/main-theme.scss";
</style>
