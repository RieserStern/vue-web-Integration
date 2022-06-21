<template>
  <div class="footer">
    <div class="footer-description">Gamma</div>
    <div class="footer-social-links">
      <a href="https://medium.com/gamma-strategies">
        <LogoMedium20 />
      </a>
      <a href="https://twitter.com/GammaStrategies" target="_blank">
        <LogoTwitter20 />
      </a>
      <a href="https://github.com/GammaStrategies" target="_blank">
        <LogoGithub20 />
      </a>
    </div>
  </div>
</template>

<script>
import LogoGithub20 from "@carbon/icons-vue/es/logo--github/20";
import LogoTwitter20 from "@carbon/icons-vue/es/logo--twitter/20";
import LogoMedium20 from "@carbon/icons-vue/es/logo--medium/20";
export default {
  name: "Footer",
  components: {
    LogoGithub20,
    LogoTwitter20,
    LogoMedium20,
  },
};
</script>

<style scoped lang="scss">
@import "../../assets/css/main-theme.scss";
</style>
