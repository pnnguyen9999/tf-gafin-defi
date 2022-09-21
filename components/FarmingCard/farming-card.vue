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
      <div class="farming-card-content mb-3">
        <div class="d-flex justify-content-between align-items-center mb-2">
          <img class="token-img" src="@/assets/img/buni-icon.png" />
          <div class="">
            {{
              `${dataFarmingCard.tokenInfo.tokenDeposit.name} - ${dataFarmingCard.tokenInfo.tokenReward.name}`
            }}
          </div>
        </div>
        <div class="d-flex justify-content-between my-1">
          <div class="">APR</div>
          <div class="">{{ dataFarmingCard.APR.toFixed(2) }} %</div>
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
      <div
        v-show="gafinCryptoData.web3 && dataFarmingCard?.allowance"
        class="stake-btn-wrapper"
      >
        <div class="btn-deposit" @click="showModal">Deposit</div>
        <div class="btn-withdraw">Withdraw</div>
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
import GafinCrypto from "@/utils/GafinCrypto";
import EventBus from "~/event/EventBus";
import PoolSingle from "~/utils/SinglePool";
import { StakeModalParams } from "~/lib/CustomModal/AppModal.vue";

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
    showModal() {
      const params: StakeModalParams = {
        modalTitle: "Stake LP Tokens",
        tokenName: `${this.dataFarmingCard.tokenInfo.tokenDeposit.name} - ${this.dataFarmingCard.tokenInfo.tokenReward.name}`,
        tokenBalance: 0,
        onConfirm: () => {
          return alert("hello");
        },
      };
      this.$stakeModal.show(params);
    },
  },
});
</script>
