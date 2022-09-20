<template>
  <div
    :class="[
      { 'col-md-4': viewType === ViewType.SQUARE },
      { 'col-md-12': viewType === ViewType.RECTANGLE },
      'p-1',
    ]"
  >
    <div
      class="farming-card animate__animated animate__fadeIn"
      v-show="viewType === ViewType.SQUARE"
    >
      <div class="farming-card-content">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <img class="token-img" src="@/assets/img/buni-icon.png" />
          <div class="">TOKEN - BUNI</div>
        </div>
        <div class="d-flex justify-content-between my-1">
          <div class="">APR</div>
          <div class="">{{ dataFarmingCard?.APR }}</div>
        </div>
        <div class="d-flex justify-content-between my-1">
          <div class="">Earn</div>
          <div class="">12 %</div>
        </div>
        <div class="my-1">TOP EARNED</div>
      </div>
      <div
        class="farming-btn--light"
        v-show="!gafinCryptoData.web3"
        @click="handleConnectWallet()"
      >
        Connect Wallet
      </div>
      <div
        class="farming-btn--light"
        v-show="gafinCryptoData.web3 && !dataFarmingCard?.allowance"
        @click="handleApprove()"
      >
        <div
          class="spinner-border spinner-border-sm mx-2"
          v-show="dataFarmingCard?.allowanceLoading"
        />
        Enable Contract
      </div>
      <div class="farming-btn--detail" @click="showExpand">
        Detail
        <img class="detail-icon" src="@/assets/img/detail-icon.png" />
      </div>
      <div v-show="isShowExpand" class="farming-card--expand">expanded</div>
    </div>
    <div
      class="farming-card animate__animated animate__fadeIn"
      v-show="viewType === ViewType.RECTANGLE"
    >
      <div class="farming-card-content-rectangle">123</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
import { mapState, mapMutations } from "vuex";
import ViewType from "@/constant/UI";
import { PoolSingle } from "~/utils/FetchFarmingInfo";
import GafinCrypto from "@/utils/GafinCrypto";
import EventBus from "~/event/EventBus";

export interface IFarmingCard {
  name: string;
  apr: string;
}
export default Vue.extend({
  name: "farming-card",
  props: {
    dataFarmingCard: {
      type: Object as PropType<PoolSingle>,
    },
  },
  data() {
    return {
      isShowExpand: false,
      maxHeight: "100px",
      ViewType: ViewType,
      gafinCryptoData: GafinCrypto,
      isApproved: false,
      depositToken: {
        address: this.dataFarmingCard?.DEPOSIT_TOKEN_CONTRACT_ADDRESS,
        ABI: this.dataFarmingCard?.DEPOSIT_TOKEN_ABI,
      },
    };
  },
  computed: {
    ...mapState("UserInterfaceState", {
      viewType: "viewType",
    }),
  },
  updated() {},
  methods: {
    showExpand() {
      this.isShowExpand = !this.isShowExpand;
    },
    async handleConnectWallet() {
      await this.gafinCryptoData.connect();
      EventBus.$emit("checkAllAllowance");
    },
    async handleApprove() {
      await this.dataFarmingCard.setAllowance();
      EventBus.$emit("checkAllAllowance");
    },
  },
});
</script>
