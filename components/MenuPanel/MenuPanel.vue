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
        <div
          v-for="(MenuProps, index) in MenuData"
          :key="index"
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
              :src="require(`@/assets/img/menu-panel/${MenuProps.imgUrl}.png`)"
            />
            <div class="menu-panel--item-text">{{ MenuProps.name }}</div>
          </div>
        </div>
      </div>
      <div class="w-100 p-2 mb-2">
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

interface IMenuData {
  imgUrl: string;
  name: string;
  url?: string;
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
        },
        {
          imgUrl: "coins",
          name: "EARNING",
          url: "#",
        },
        {
          imgUrl: "blog",
          name: "BLOG",
          url: "/blog",
        },
        {
          imgUrl: "guild",
          name: "GUILD CORE",
          url: "#",
        },
        {
          imgUrl: "exchange",
          name: "EXCHANGE",
          url: "#",
        },
        {
          imgUrl: "launchpad",
          name: "LAUNCHPAD",
          url: "#",
        },
      ] as IMenuData[],
    };
  },
  methods: {
    async handleConnectWallet() {
      await this.gafinCryptoData.connect();
      EventBus.$emit("userWalletConnected");
    },
  },
  computed: {
    userAddress(): string {
      return this.gafinCryptoData.address;
    },
  },
});
</script>

<style></style>
