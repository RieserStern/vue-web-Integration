<template>
  <div v-if="visible" class="cv-notifiation pending-transactions">
    <div class="notification__pending-title">
      <InProgress20 class="icon" />
      <h6>Pending Transactions</h6>
    </div>
    <div class="notification__pending-content">
      <div v-if="isApprovePending" class="notification__pending-content__item">
        <cv-inline-loading
          small
          :state="state"
          :loading-text="approve"
        ></cv-inline-loading>
        <a :href="`https://etherscan.io/tx/${approveTxn}`" target="_blank">
          <Launch16 aria-label="View on Etherscan" />
        </a>
      </div>
      <div v-if="isWrapPending" class="notification__pending-content__item">
        <cv-inline-loading
          small
          :state="state"
          :loading-text="wrap"
        ></cv-inline-loading>
        <a :href="`https://etherscan.io/tx/${wrapTxn}`" target="_blank">
          <Launch16 aria-label="View on Etherscan" />
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { InProgress20, Launch16 } from "@carbon/icons-vue/";

export default {
  name: "Notification",
  components: {
    InProgress20,
    Launch16
  },
  props: {
    isApprovePending: { type: Boolean },
    isWrapPending: { type: Boolean },
    approveTxn: { type: String, default: "" },
    wrapTxn: { type: String, default: "" }
  },
  data() {
    return {
      state: "loading",
      title: "Pending Transactions",
      closeLabel: "Close",
      approve: "Approving",
      wrap: "Wrapping ETH"
    };
  },
  computed: {
    visible() {
      return this.isApprovePending || this.isWrapPending;
    }
  },
  mounted() {},
  methods: {}
};
</script>
<style lang="scss">
@import "../assets/css/main-theme.scss";
</style>
