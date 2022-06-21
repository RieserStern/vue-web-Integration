<template>
  <div>
    <div class="tab-header-staked">
      <div class="header-item">
        <span class="item-label"
          >Staked GAMMA</span
        >
        <template v-if="!isTableLoaded">
          <cv-skeleton-text />
        </template>
        <template v-else>
          <span class="item-text">
            <!-- {{ expandedData.xGAMMA.stakedUsdAmount }} -->
            {{
              isConnected
                ? formatStat(
                    parseFloat(stakedAmount),
                    false,
                    ""
                  )
                : globalGamma.globalStakedGamma
            }}
          </span>
        </template>
      </div>
      <div class="header-item">
        <span class="item-label"
          >{{ isConnected ? "Your xGAMMA" : "xGAMMA Supply" }}</span
        >
        <template v-if="!isTableLoaded">
          <cv-skeleton-text />
        </template>
        <template v-else>
          <!-- <span class="item-text">{{
							parseFloat(stakedAmount) === 0 ? "0.00" : stakedAmount
					}}</span> -->
          <span class="item-text">
            {{
              isConnected
                ? formatStat(
                    parseFloat(stakedAmount),
                    false,
                    ""
                  )
                : globalGamma.globalXGamma
            }}
          </span>
        </template>
      </div>

      <div class="header-item">
        <span class="item-label">{{
          isConnected ? "Fees Earned " : "Fees Distributed"
        }}</span>
        <template v-if="!isTableLoaded">
          <cv-skeleton-text />
        </template>
        <template v-else>
          <span class="item-text"> {{ feeEarned }} </span>
        </template>
      </div>
    </div>

    <div class="tab-header-staked">
      <div class="header-item">
        <span class="item-label word-break"
          >{{ isConnected ? "Your " : "" }}Staked Value</span
        >
        <template v-if="!isTableLoaded">
          <cv-skeleton-text />
        </template>
        <template v-else>
          <span class="item-text">
            {{
              isConnected
                ? formatStat(
                    parseFloat(stakedAmountValue)
                  )
                : globalGamma.globalStakedValue
            }}
          </span>
        </template>
      </div>

      <div class="header-item">
        <span class="item-label">{{
          isConnected ? "Pool Percentage" : "Percentage Staked"
        }}</span>
        <template v-if="!isTableLoaded">
          <cv-skeleton-text />
        </template>
        <template v-else>
          <span class="item-text">
            {{ isConnected ? percentage + "%" : parseFloat(globalGamma.globalPercentage).toFixed(3) + "%" }}
          </span>
        </template>
      </div>

      <div class="header-item">
        <span class="item-label">xGAMMA Price</span>
        <template v-if="!isTableLoaded">
          <cv-skeleton-text />
        </template>
        <template v-else>
          <span class="item-text"> {{ globalGamma.xGammaPerGamma }} </span>
        </template>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import { mapGetters } from "vuex";

const MILLION = 1;
const THOUSAND = 2;
const PERCENT = 3;

export default {
  name: "GammaStatsComponent",
  components: {},
  props: ["globalGamma", "stakedAmount", "stakedAmountValue", "percentage"],
  data() {
    return {
      core: this.$parent.$root.core,
      feeEarned: "--"
    }
  },
  computed: {
    ...mapGetters({
      isConnected: "DataTable/getIsConnected",
      isTableLoaded: "DataTable/getIsTableLoaded"
    })
  },
  watch: {
    "$store.state.DataTable.isConnected": {
      immediate: true,
      async handler() {
        let status;
        if (this.$store.state.DataTable.isConnected) {
          status = await fetch(
            this.core.api1 + `/vault/${this.core.accounts[0]}`
          )
            .then(response => response.json())
            .catch(async () => {
              return fetch(this.core.api2 + `/vault/${this.core.accounts[0]}`)
                .then(response => response.json())
                .catch(() => {
                  return false;
                });
            });
          this.feeEarned = status.totalVisrEarned.toFixed(2);
        }
        else 
          this.feeEarned = "--";
        // console.log(this.$store.state.GammaState.gammaStats);
      }
    }
  },
  methods: {
    formatStat(value, isPercent = false, currency = "$") {
      let type = isPercent ? PERCENT : -1;
      if (!isPercent) {
        if (value > 999999) {
          type = MILLION;
        } else if (value > 999) {
          type = THOUSAND;
        }
      }

      switch (type) {
        case MILLION:
          return `${currency}${(parseFloat(value) / 1000000).toFixed(2)}M`;
        case THOUSAND:
          return `${currency}${(parseFloat(value) / 1000).toFixed(2)}K`;
        case PERCENT:
          return `${Math.round(parseFloat(value) * 100 * 100) / 100}%`;
        default:
          return `${currency}${parseFloat(value).toFixed(2)}`;
      }
    }
  }
};
</script>

<style lang="scss">
@import "@/assets/css/variables.scss";
</style>
