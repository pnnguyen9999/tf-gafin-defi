<template>
  <div
    :class="[
      { 'col-md-4 col-sm-6': computedCardType === ViewType.SQUARE },
      { 'col-md-12': computedCardType === ViewType.RECTANGLE },
      'p-1',
    ]"
  >
    <div
      class="farming-card animate__animated animate__fadeInRight"
      v-show="computedCardType === ViewType.SQUARE"
    >
      <div class="farming-card-content mb-3">
        <div class="d-flex justify-content-between align-items-center mb-3">
          <img class="token-img" src="@/assets/img/hero-arena.png" />
          <div class="fnt-bold">
            {{
              `${dataFarmingCard.tokenInfo.tokenDeposit.name} - ${dataFarmingCard.tokenInfo.tokenReward.name}`
            }}
          </div>
        </div>
        <div class="d-flex justify-content-between my-2">
          <div class="">Max cap</div>
          <div class="">
            {{ currencyFormat(dataFarmingCard.maxCap) }}
            {{ `${dataFarmingCard.tokenInfo.tokenDeposit.name}` }}
          </div>
        </div>
        <div class="d-flex justify-content-between my-2">
          <div class="">Liquidity</div>
          <div class="">$ {{ dataFarmingCard.liquidity.toFixed(2) }}</div>
        </div>
        <div class="d-flex justify-content-between my-2">
          <div class="">APR</div>
          <div class="d-flex align-items-center">
            <div class="me-2">{{ dataFarmingCard.APR.toFixed(2) }} %</div>
            <img style="width: 22px" src="@/assets/img/apr-ico.png" />
          </div>
        </div>
        <div class="d-flex justify-content-between my-2">
          <div class="">Earn</div>
          <div class="">
            {{ dataFarmingCard.tokenInfo.tokenReward.name }} + Fee
          </div>
        </div>

        <div class="d-flex justify-content-between align-items-center my-2">
          <div>
            <div class="my-1">
              {{ dataFarmingCard.tokenInfo.tokenReward.name }} EARNED
            </div>
            <div class="harvest-label">{{ dataFarmingCard.harvestAmount }}</div>
          </div>
          <div
            :class="['harvest-btn', canHarvest ? 'can-harvest' : 'none']"
            @click="canHarvest ? dataFarmingCard.harvest() : () => {}"
          >
            Harvest
          </div>
        </div>
      </div>
      <div
        class="farming-btn--light"
        v-show="!userAddress"
        @click="handleConnectWallet()"
      >
        Connect Wallet
      </div>
      <div
        class="farming-btn--light"
        v-show="userAddress && !dataFarmingCard?.allowance"
        @click="handleApprove()"
      >
        <div
          class="spinner-border spinner-border-sm mx-2"
          v-show="dataFarmingCard?.allowanceLoading"
        />
        Enable Contract
      </div>
      <div
        v-show="userAddress && dataFarmingCard?.allowance"
        class="stake-btn-wrapper"
      >
        <div
          v-if="dataFarmingCard.isLive()"
          class="btn-deposit"
          @click="showModal"
        >
          Deposit
        </div>
        <div v-else class="btn-deposit grey">Deposit</div>
        <div class="btn-withdraw" @click="dataFarmingCard?.unStake()">
          Withdraw
        </div>
      </div>
      <div class="farming-btn--detail" @click="showExpand">
        {{ !isShowExpand ? "Detail" : "Hide" }}
        <img class="detail-icon" src="@/assets/img/detail-icon.png" />
      </div>
      <div v-show="isShowExpand" class="farming-card--expand">
        <hr />
        <div class="d-flex align-items-center mb-3">
          <a
            class="card-url"
            :href="dataFarmingCard?.externalUrlInfo?.getCoinUrl"
            target="_blank"
            >{{
              `Get ${dataFarmingCard.tokenInfo.tokenDeposit.name} - ${dataFarmingCard.tokenInfo.tokenReward.name}`
            }}
            <img src="@/assets/img/url.png"
          /></a>
        </div>
        <div class="d-flex align-items-center mb-3">
          <a
            class="card-url"
            :href="dataFarmingCard?.externalUrlInfo?.viewContract"
            target="_blank"
            >View Contract <img src="@/assets/img/url.png"
          /></a>
        </div>
        <div class="d-flex align-items-center mb-3">
          <a
            class="card-url"
            :href="dataFarmingCard?.externalUrlInfo?.pairInfo"
            target="_blank"
            >See Pair Info <img src="@/assets/img/url.png"
          /></a>
        </div>
      </div>
    </div>
    <div
      class="farming-card animate__animated animate__fadeIn"
      v-show="computedCardType === ViewType.RECTANGLE"
    >
      <div class="farming-card-content-rectangle">
        <div class="row">
          <div class="col-md-4 col-5">
            <div class="d-flex align-items-center">
              <img class="token-img p-1" src="@/assets/img/hero-arena.png" />
              <div class="fnt-bold ms-2">
                {{
                  `${dataFarmingCard.tokenInfo.tokenDeposit.name} - ${dataFarmingCard.tokenInfo.tokenReward.name}`
                }}
              </div>
            </div>
          </div>
          <div class="col-2 d-none d-md-block">
            <div class="rectangle-item">
              <div class="title">Earned</div>
              <div class="content">
                {{ dataFarmingCard.tokenInfo.tokenReward.name }}
              </div>
            </div>
          </div>
          <div class="col-md-2 col-3">
            <div class="rectangle-item">
              <div class="title">APR</div>
              <div class="content">
                <div class="d-flex align-items-center">
                  <div class="me-2">{{ dataFarmingCard.APR.toFixed(2) }} %</div>
                  <img style="width: 22px" src="@/assets/img/apr-ico.png" />
                </div>
              </div>
            </div>
          </div>
          <div class="col-2 d-none d-md-block">
            <div class="rectangle-item">
              <div class="title">Liquidity</div>
              <div class="content">
                $ {{ dataFarmingCard.liquidity.toFixed(2) }}
              </div>
            </div>
          </div>
          <div class="col-4 col-md-2">
            <div class="d-flex flex-column align-items-end">
              <div class="farming-btn--detail" @click="showExpandRectangle">
                Detail
                <img class="detail-icon" src="@/assets/img/detail-icon.png" />
              </div>
            </div>
          </div>
        </div>
        <div v-show="isShowExpandRectangle" class="farming-card--expand">
          <hr />
          <div
            class="d-flex justify-content-between align-items-center my-2 d-block d-md-none"
          >
            <div class="title">Liquidity</div>
            <div class="content">
              $ {{ dataFarmingCard.liquidity.toFixed(2) }}
            </div>
          </div>
          <div class="d-flex justify-content-between my-2 d-block d-md-none">
            <div class="">Earn</div>
            <div class="">
              {{ dataFarmingCard.tokenInfo.tokenReward.name }} + Fee
            </div>
          </div>
          <hr />
          <div class="col-12">
            <div class="row">
              <div class="col-md-4 d-flex align-items-center">
                <div>
                  <div class="d-flex align-items-center mb-3">
                    <a
                      class="card-url"
                      :href="dataFarmingCard?.externalUrlInfo?.getCoinUrl"
                      :target="
                        dataFarmingCard?.externalUrlInfo?.getCoinUrl
                          ? '_blank'
                          : '_self'
                      "
                      >{{
                        `Get ${dataFarmingCard.tokenInfo.tokenDeposit.name} - ${dataFarmingCard.tokenInfo.tokenReward.name}`
                      }}
                      <img src="@/assets/img/url.png"
                    /></a>
                  </div>
                  <div class="d-flex align-items-center mb-3">
                    <a
                      class="card-url"
                      :href="dataFarmingCard?.externalUrlInfo?.viewContract"
                      target="_blank"
                      >View Contract <img src="@/assets/img/url.png"
                    /></a>
                  </div>
                  <div class="d-flex align-items-center mb-3">
                    <a
                      class="card-url"
                      :href="dataFarmingCard?.externalUrlInfo?.pairInfo"
                      target="_blank"
                      >See Pair Info <img src="@/assets/img/url.png"
                    /></a>
                  </div>
                </div>
              </div>
              <div class="col-md-4 my-2">
                <div
                  class="harvest-container d-flex justify-content-between align-items-center"
                >
                  <div>
                    <div class="my-1">
                      {{ dataFarmingCard.tokenInfo.tokenReward.name }} EARNED
                    </div>
                    <div class="harvest-label">
                      {{ dataFarmingCard.harvestAmount }}
                    </div>
                  </div>
                  <div
                    :class="[
                      'harvest-btn',
                      canHarvest ? 'can-harvest' : 'none',
                    ]"
                    @click="canHarvest ? dataFarmingCard.harvest() : () => {}"
                  >
                    Harvest
                  </div>
                </div>
              </div>
              <div class="col-md-4 p-2 d-flex justify-content-end">
                <div class="col-md-10 col-12">
                  <div class="start-farming-container">
                    <div class="mb-2">Start {{ computedViewMode }}</div>
                    <div
                      class="farming-btn--light"
                      v-show="!userAddress"
                      @click="handleConnectWallet()"
                    >
                      Connect Wallet
                    </div>
                    <div
                      class="farming-btn--light"
                      v-show="userAddress && !dataFarmingCard?.allowance"
                      @click="handleApprove()"
                    >
                      <div
                        class="spinner-border spinner-border-sm mx-2"
                        v-show="dataFarmingCard?.allowanceLoading"
                      />
                      Enable Contract
                    </div>
                    <div
                      v-show="userAddress && dataFarmingCard?.allowance"
                      class="stake-btn-wrapper"
                    >
                      <div
                        v-if="dataFarmingCard.isLive()"
                        class="btn-deposit"
                        @click="showModal"
                      >
                        Deposit
                      </div>
                      <div v-else class="btn-deposit grey">Deposit</div>
                      <div
                        class="btn-withdraw"
                        @click="dataFarmingCard?.unStake()"
                      >
                        Withdraw
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import Vue, { PropType } from "vue";
import { mapState } from "vuex";
import GafinCrypto from "@/utils/GafinCrypto";
import EventBus from "~/event/EventBus";
import PoolSingle from "~/utils/SinglePool";
import { StakeModalParams } from "~/lib/CustomModal/StakeModal.vue";
import ViewType from "@/constant/UI";
import { currencyFormat } from "@/utils/Formatter";

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
    cardType: {
      type: String,
    },
  },
  data() {
    return {
      isShowExpand: false,
      isShowExpandRectangle: false,
      maxHeight: "100px",
      ViewType: ViewType,
      viewState: ViewType.SQUARE,
      gafinCryptoData: GafinCrypto,
      isApproved: false,
    };
  },
  computed: {
    ...mapState("UserInterfaceState", {
      viewType: "viewType",
      viewTypeStaking: "viewTypeStaking",
      currentViewMode: "currentViewMode",
    }),
    computedViewMode(): string {
      switch (this.currentViewMode) {
        case "STAKING": {
          return "Staking";
        }
        default:
        case "FARMING": {
          return "Farming";
        }
      }
    },
    computedCardType(): ViewType {
      if (this.cardType === "farming") {
        return this.viewType;
      } else {
        return this.viewTypeStaking;
      }
    },
    userAddress(): string {
      return this.gafinCryptoData.address;
    },
    canHarvest(): boolean {
      if (Number(this.dataFarmingCard.harvestAmount) === 0) {
        return false;
      } else {
        return true;
      }
    },
  },
  watch: {
    userAddress(newVal) {
      console.log(newVal);
    },
  },
  methods: {
    currencyFormat,
    showExpand() {
      this.isShowExpand = !this.isShowExpand;
    },
    showExpandRectangle() {
      this.isShowExpandRectangle = !this.isShowExpandRectangle;
    },
    async handleConnectWallet() {
      await this.gafinCryptoData.connect();
      EventBus.$emit("userWalletConnected");
    },
    async handleApprove() {
      await this.dataFarmingCard.setAllowance();
      EventBus.$emit("userWalletConnected");
    },
    showModal() {
      const params: StakeModalParams = {
        modalTitle: "Stake LP Tokens",
        tokenName: `${this.dataFarmingCard.tokenInfo.tokenDeposit.name} - ${this.dataFarmingCard.tokenInfo.tokenReward.name}`,
        poolPrototype: this.dataFarmingCard,
      };
      this.$stakeModal.show(params);
    },
  },
});
</script>
