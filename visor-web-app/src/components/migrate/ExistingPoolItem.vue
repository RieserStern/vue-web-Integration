<template>
  <div class="existing-pool-item">
    <div class="pool-name-container">
      <div class="token-icons">
        <div class="first-icon"></div>
        <div class="second-icon"></div>
      </div>
      <div class="name">
        {{ name }}
      </div>
      <div class="version">
        V2
      </div>
    </div>
    <div class="migrate-action">
      <template v-if="available">
        <span class="available-migrate" @click="handleMigrate">Migrate</span>
      </template>
      <template v-else>
        <span class="non-available-migrate">Not available yet</span>
      </template>
    </div>
  </div>
</template>
<script>
export default {
  name: "ExistingPoolItem",
  components: {},
  props: {
    name: {
      type: String,
      default: null
    },
    available: {
      type: Boolean
    },
    onSelectPool: {
      type: Function,
      default: () => {}
    }
  },
  data() {
    return {};
  },
  computed: {},
  watch: {},
  async mounted() {},
  methods: {
    handleMigrate() {
      this.onSelectPool(this.name);
    }
  }
};
</script>

<style lang="scss">
@import "../../assets/css/main-theme.scss";
</style>
