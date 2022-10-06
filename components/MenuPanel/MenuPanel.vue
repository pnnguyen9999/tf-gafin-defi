<template>
  <div class="menu-panel">
    <div
      class="d-flex h-100 align-items-center flex-column justify-content-between menu-panel-pc"
    >
      <div class="w-100 text-center">
        <a href="/">
          <img class="logo cs-pt" src="@/assets/img/gafin-logo.png" />
        </a>
        <div class="p-3" />
        <div class="menu-items">
          <div v-for="(MenuProps, index) in MenuData" :key="index">
            <a
              :href="MenuProps.url"
              :target="MenuProps.openInBlank ? '_blank' : '_self'"
            >
              <div
                :class="[
                  'menu-panel--glow-item mb-2',
                  MenuProps.name === 'EARNING' && 'active',
                ]"
              >
                <div class="line" />
                <div
                  class="menu-panel--item"
                  :class="[
                    'menu-panel--item',
                    MenuProps.name === 'EARNING' && 'active',
                  ]"
                >
                  <img
                    class="menu-panel--item-icon"
                    :data-index="MenuProps.imgUrl"
                    :src="
                      require(`@/assets/img/menu-panel/${MenuProps.imgUrl}.png`)
                    "
                  />
                  <div class="menu-panel--item-text">{{ MenuProps.name }}</div>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
      <div class="w-100 p-2 mb-2 pannel-bottom">
        <div
          class="login-btn mb-2"
          v-if="!userAddress"
          @click="handleConnectWallet()"
        >
          LOGIN
        </div>
        <div class="language-switcher">
          <div class="col-12">
            <div class="d-flex py-1">
              <div class="col-6 d-flex justify-content-center">
                <img class="cspt" src="@/assets/img/flag/vi.png" />
              </div>
              <div class="col-6 d-flex justify-content-center">
                <img class="cspt" src="@/assets/img/flag/us.png" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import GafinCrypto from "~/utils/GafinCrypto";
import EventBus from "~/event/EventBus";
import { mapState } from "vuex";

interface IMenuData {
  imgUrl: string;
  name: string;
  url?: string;
  openInBlank: boolean;
}
export default Vue.extend({
  data() {
    return {
      gafinCryptoData: GafinCrypto,
      MenuData: [
        {
          imgUrl: "nft",
          name: "NFT MARKETPLACE",
          url: "#",
          openInBlank: false,
        },
        {
          imgUrl: "coins",
          name: "EARNING",
          url: "#",
          openInBlank: false,
        },
        {
          imgUrl: "blog",
          name: "BLOG",
          url: "https://gafin.io/blog",
          openInBlank: true,
        },
        {
          imgUrl: "guild",
          name: "GUILD CORE",
          url: "#",
          openInBlank: false,
        },
        {
          imgUrl: "exchange",
          name: "EXCHANGE",
          url: "#",
          openInBlank: false,
        },
        {
          imgUrl: "launchpad",
          name: "LAUNCHPAD",
          url: "#",
          openInBlank: false,
        },
        {
          imgUrl: "gamification",
          name: "GAMIFICATION",
          url: "https://gafin.io/gamification/valorant",
          openInBlank: true,
        },
      ] as IMenuData[],
    };
  },
  methods: {
    async handleConnectWallet() {
      if (this.isFetchingCompleted) {
        await this.gafinCryptoData.connect();
        EventBus.$emit("userWalletConnected");
      } else {
        this.$toast.warning("Please waiting for application loading...");
      }
    },
  },
  computed: {
    userAddress(): string {
      return this.gafinCryptoData.address;
    },
    ...mapState("FetchingState", {
      isFetchingCompleted: "isCompleted",
    }),
  },
});
</script>

<style>
.pannel-bottom {
  position: absolute;
  bottom: 0;
}
.menu-items {
  max-height: calc(100vh - 115px - 150px);
  overflow-y: auto;
  overflow-x: hidden;
}
</style>
