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
        v-show="gafinCryptoData.web3 && !computedCheckAllowance"
        @click="handleApprove()"
      >
        <div
          class="spinner-border spinner-border-sm mx-2"
          v-show="waitingAllowance"
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
      waitingAllowance: false,
    };
  },
  computed: {
    ...mapState("UserInterfaceState", {
      viewType: "viewType",
    }),
    ...mapState("Web3Store", {
      checkAllowanceSingleTokenVuex: "checkAllowanceSingleToken",
    }),
    computedCheckAllowance(): boolean {
      return (
        this.checkAllowanceSingleTokenVuex.status &&
        this.checkAllowanceSingleTokenVuex.token ==
          this.dataFarmingCard.DEPOSIT_TOKEN_CONTRACT_ADDRESS
      );
    },
  },
  methods: {
    ...mapMutations({
      setAllowanceSingleTokenVuex: "Web3Store/setAllowanceSingleToken",
    }),
    showExpand() {
      this.isShowExpand = !this.isShowExpand;
    },
    async handleConnectWallet() {
      await this.gafinCryptoData.connect();
      const isAllowance = await this.gafinCryptoData.getAllowance({
        SMC_ADDRESS: this.dataFarmingCard.DEPOSIT_TOKEN_CONTRACT_ADDRESS,
        SMC_ABI: this.dataFarmingCard.DEPOSIT_TOKEN_ABI,
      });
      this.setAllowanceSingleTokenVuex({
        TOKEN_ADDRESS: this.dataFarmingCard.DEPOSIT_TOKEN_CONTRACT_ADDRESS,
        status: isAllowance,
      });
    },
    async handleApprove() {
      this.waitingAllowance = true;
      await this.gafinCryptoData.approveContract({
        SMC_ADDRESS: this.dataFarmingCard.DEPOSIT_TOKEN_CONTRACT_ADDRESS,
        SMC_ABI: this.dataFarmingCard.DEPOSIT_TOKEN_ABI,
        callback: async (data: any) => {
          if (data.status === "EXECUTE_APPROVE_SUBMIT") {
          } else if (data.status === "EXECUTE_APPROVE_SUCCESS") {
            console.log("approved");
            this.setAllowanceSingleTokenVuex({
              TOKEN_ADDRESS:
                this.dataFarmingCard.DEPOSIT_TOKEN_CONTRACT_ADDRESS,
              status: true,
            });
            this.waitingAllowance = false;
          } else if (data.status === "EXECUTE_APPROVE_FAIL") {
            console.log("execute fail");
            this.waitingAllowance = false;
          }
        },
      });
    },
  },
});
</script>
