<template>
  <div class="migrate-page main-content">
    <template v-if="selectedPool">
      <MigratePool :name="selectedPool" :onBack="handleBack" />
    </template>
    <template v-else>
      <div class="migrate-body">
        <div class="migrate-header">
          <span class="header-title">
            Migrate Uniwap V2 Pool
          </span>
          <span class="header-learn-more">
            Learn more
            <Link16 />
          </span>
        </div>
        <span class="header-sub-title">
          Select existing uniswap V2 liquidity pool to migrate directly over to
          Visor Finance Hypervisor
        </span>
        <template v-if="existingPools.length > 0">
          <div class="migrate-main-wrapper">
            <span class="main-title"
              >Existing Pools ({{ existingPools.length }})</span
            >
            <div
              v-for="pool in existingPools"
              :key="pool.pairedToken"
              class="pool-item-container"
            >
              <ExistingPoolItem
                :name="pool.pairedToken"
                :available="pool.isAvailable"
                :onSelectPool="handleSelectPool"
              />
            </div>
          </div>
        </template>
      </div>
    </template>
  </div>
</template>
<script>
import { Link16 } from "@carbon/icons-vue";
import ExistingPoolItem from "@/components/migrate/ExistingPoolItem";
import MigratePool from "@/components/migrate/MigratePool";

export default {
  name: "Migrate",
  components: { Link16, ExistingPoolItem, MigratePool },
  data() {
    return {
      existingPools: [
        { pairedToken: "TCR-ETH", isAvailable: true },
        { pairedToken: "ARCX-ETH", isAvailable: true },
        { pairedToken: "WBTC-USDC", isAvailable: false }
      ],
      selectedPool: null
    };
  },
  computed: {},
  watch: {},
  async mounted() {},
  methods: {
    handleSelectPool(pool) {
      this.selectedPool = pool;
    },
    handleBack() {
      this.selectedPool = null;
    }
  }
};
</script>

<style lang="scss">
@import "../assets/css/main-theme.scss";
</style>
