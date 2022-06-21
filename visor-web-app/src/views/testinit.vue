<template>
  <div class="lorem-table-page main-content" >
  </div>
</template>

<script>
// @ is an alias to /src

import { mapState } from "vuex";
export default {
  name: "LoremTable",
  components: {
    Notification,
  },
  data() {
    return {
      core: this.$parent.$root.core,
    };
  },
  computed: {
  },
  watch: {
  },
  async mounted() {
    await this.core.connect(); 
  },
};
</script>

<style lang="scss">
@import "../assets/css/main-theme.scss";

.cv-overflow-menu-item .bx--overflow-menu-options__btn {
  background: $hover-secondary;
  color: #fff;
  &:hover {
    background: $active-secondary;
    color: #fff;
  }
  &:focus {
    outline: 2px solid transparent;
  }
}

.bn-onboard-custom.bn-onboard-dark-mode {
    background: #2B2B2B!important;
        color: #ffffff;
}

.bn-onboard-custom.bn-onboard-modal-content{
    background: #2B2B2B!important;
}
.bn-onboard-custom.bn-onboard-modal-header{
    background: #2B2B2B!important;
}
.bn-onboard-custom.bn-onboard-modal-content-header-heading{
    background: #2B2B2B!important;
}
.bn-onboard-custom.bn-onboard-select-description {
    background: #2B2B2B!important;
}
.bn-onboard-custom.bn-onboard-modal-select-wallets{
    background: #2B2B2B!important;
}
.bn-onboard-custom.bn-onboard-icon-button{
    background: #2B2B2B!important;
}
.bn-onboard-custom.bn-onboard-modal-selected-wallet{
    background: #2B2B2B!important;
}
.bn-onboard-custom.bn-onboard-prepare-button{
    background: #2B2B2B!important;
}
.bn-onboard-custom.bn-onboard-dark-mode-background {
    background: #161616!important;
}
.onboard-dark-mode-background {
    background: #161616!important;
}


</style>
