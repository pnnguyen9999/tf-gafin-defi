<template>
  <div class="footer">
    <div class="w-100">
      <div class="text-center">
        <a href="#">
          <img class="logo-footer" src="/img/gafin-logo.png" alt="" />
        </a>
      </div>
      <div class="d-flex align-items-center justify-content-center mt-4">
        <a
          v-for="(social, index) in iconList"
          :key="index"
          class="mx-md-2 mx-1"
          :href="social.href"
          target="_blank"
        >
          <img
            class="mw-100 icon"
            :src="require(`@/assets/img/svg/${social.img}`)"
            alt=""
          />
        </a>
      </div>
    </div>
    <hr class="hr-footer" />
    <h6 class="footer-copyright">
      <span>Copyright © 2022 Gafin. All rights reserved</span>
      <span class="break cl-w">
        | Legal Disclaimers | Terms & User | Privacy Policy
      </span>
    </h6>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { EXTERNAL_URLS } from "@/constant/URL";
export default Vue.extend({
  name: "Footer",
  data() {
    return {
      iconList: [
        { href: EXTERNAL_URLS.TWITTER, img: "twitter-footer.svg" },
        { href: EXTERNAL_URLS.DISCORD, img: "discord-footer.svg" },
        { href: EXTERNAL_URLS.TELEGRAM, img: "telegram-footer.svg" },
        { href: EXTERNAL_URLS.FACEBOOK, img: "facebook-footer.svg" },
      ],
    };
  },
});
</script>

<style></style>
