<template>
  <div class="onesignal-notification" @click="toggleSubscribe()">
    <template v-if="isSubscribed">
      <Notification16 />
    </template>
    <template v-else> <NotificationOff16 /> </template>
    <!-- <div class="tooltip">{{ statusText }}</div> -->
  </div>
</template>

<script>
import { onesignalCustomButtonHelper as OSHelper } from "onesignal-custom-button-helper";
import { Notification16, NotificationOff16 } from "@carbon/icons-vue";

export default {
  name: "OneSignalNotificationButton",
  components: { Notification16, NotificationOff16 },
  data() {
    return {
      statusText: "",
      isSubscribed: false
    };
  },
  mounted() {
    window.addEventListener("StatusTextChanged", this.updateStatusText);
  },
  methods: {
    toggleSubscribe: OSHelper(state => {
      if (state === "not-supported") {
        // Keep toggle button hidden
        return;
      }

      if (state === "loading") {
        // console.log("loading");
      } else {
        if (state === "subscribed") {
          window.dispatchEvent(
            new CustomEvent("StatusTextChanged", {
              detail: {
                statusText: "You are subscribed to notifications",
                isSubscribed: true
              }
            })
          );
        }
        if (state === "not-subscribed") {
          window.dispatchEvent(
            new CustomEvent("StatusTextChanged", {
              detail: {
                statusText: "Subscribe to notifications",
                isSubscribed: false
              }
            })
          );
        }
      }
    }),
    updateStatusText(event) {
      this.statusText = event.detail.statusText;
      this.isSubscribed = event.detail.isSubscribed;
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/css/main-theme.scss";
</style>
