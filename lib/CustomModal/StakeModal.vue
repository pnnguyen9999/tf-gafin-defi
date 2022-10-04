<template>
  <Transition>
    <div class="stake-modal-wrapper" v-if="visible">
      <div class="stake-modal-content">
        <div class="mb-auto">
          <div class="stake-modal-header p-3">
            <div class="title">
              Stake {{ poolPrototype.tokenInfo.tokenDeposit.name }} Tokens
            </div>
            <img
              class="icon cspt"
              @click="hide"
              src="@/assets/img/close-ico.png"
            />
          </div>
          <div class="border-btm" />
          <div class="p-3">
            <div class="amount-content">
              <div
                class="w-100 d-flex align-items-center justify-content-between"
              >
                <div class="title min">Stake</div>
                <div class="title min">
                  Balance: {{ tokenBalance }}
                  {{ poolPrototype.tokenInfo.tokenDeposit.name }}
                </div>
              </div>
              <div
                class="w-100 mt-2 d-flex align-items-center justify-content-between"
              >
                <div>
                  <input
                    v-model="tokenAmount"
                    class="token-amount"
                    placeholder="amount..."
                  />
                  <div class="error" v-if="invalidIndicator.status">
                    {{ invalidIndicator.message }}
                  </div>
                </div>
                <div class="d-flex align-items-center">
                  <div
                    class="max-btn me-2"
                    @click="
                      () => {
                        tokenAmount = tokenBalance;
                      }
                    "
                  >
                    MAX
                  </div>
                  <div class="title">
                    {{ poolPrototype.tokenInfo.tokenDeposit.name }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div class="stake-btn-wrapper p-3">
            <div class="btn-cancel" v-if="loading">Cancel</div>
            <div class="btn-cancel" v-else @click="hide">Cancel</div>
            <div class="btn-confirm grey" v-if="loading">
              <div class="spinner-border spinner-border-sm mx-2" />
              Processing
            </div>
            <div v-else class="btn-confirm" @click="confirm">Confirm</div>
          </div>
          <div class="pb-3 w-100 text-center title min">
            Get {{ poolPrototype.tokenInfo.tokenDeposit.name }}
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
@import "@/style/mixins.scss";
.error {
  color: #ef466f;
  font-size: 10pt;
  margin-top: 5px;
}
.stake-modal-wrapper {
  .max-btn {
    @include normalBtn();
    font-size: 11pt;
    background-color: #059872;
    font-family: fontbold;
    width: 80px;
  }
  .token-amount {
    width: 150px;
    background-color: #110f0e;
    color: #fff;
    border: 0px;
    font-family: fontbold;
    font-size: 14pt;
  }
  .amount-content {
    border: 1px solid #413f3e;
    border-radius: 10px;
    padding: 15px;
    @include flex-column-center();
  }
  .title {
    font-family: fontbold;
    font-size: 14pt;
    &.min {
      font-size: 11pt;
    }
  }
  .border-btm {
    border-bottom: 1px solid #413f3e;
  }
  .stake-modal {
    &-header {
      @include flex-row-between();
      .icon {
        width: 28px;
      }
    }
  }
}
.cspt {
  cursor: pointer;
}
.v {
  &-enter-active {
    transition: all 0.15s ease;
  }
  &-leave-active {
    transition: all 0.15s ease-in-out;
  }

  &-leave-to {
    opacity: 0;
  }
  &-enter {
    opacity: 0;
  }
}

.stake-modal-content {
  display: flex;
  flex-direction: column;
  position: relative;
  width: 420px;
  // height: fit-content;
  background-color: #110f0e;
  margin-bottom: 10%;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  // transition: all 0.5s ease-in-out;
}
.stake-modal-wrapper {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100vw;
  height: 100vh;
  z-index: 1000;
  border-radius: 2px;
  background-color: rgba($color: #00000070, $alpha: 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
}
.stake-btn-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  .btn-cancel {
    @include normalBtn();
    width: 48%;
    background-color: #110f0e;
    border: 1px solid #ffffff;
    color: #ffffff;
  }
  .btn-confirm {
    width: 48%;
    @include normalBtn();
    background-color: #fe8e26;
    border: 1px solid #fe8e26;
    color: #fff;
    &.grey {
      background-color: #3f3f3f;
      border: 1px solid #656565;
    }
  }
}
</style>

<script lang="ts">
import Vue from "vue";
import { mapState } from "vuex";
import SinglePool from "~/utils/SinglePool.js";
import Modal from "./plugin.js";
import { ViewMode } from "~/store/UserInterfaceState";

export interface StakeModalParams {
  modalTitle: string;
  tokenName: string;
  poolPrototype: SinglePool;
}

export default Vue.extend({
  data() {
    return {
      visible: false,
      poolPrototype: null as unknown as SinglePool,
      modalTitle: "",
      tokenAmount: 0,
      tokenName: "",
      tokenBalance: 0,
      invalidIndicator: {
        status: false,
        message: "",
      },
      loading: false,
    };
  },
  computed: {
    ...mapState("UserInterfaceState", {
      currentViewMode: "currentViewMode",
    }),
  },
  methods: {
    hide() {
      this.visible = false;
    },
    setLoading(status: boolean) {
      this.loading = status;
    },
    async confirm() {
      if (!this.invalidIndicator.status) {
        this.setLoading(true);
        await this.poolPrototype.stake(
          Number(Number(this.tokenAmount).toFixed(10))
        );
        this.setLoading(false);
        this.hide();
        this.tokenBalance = this.poolPrototype.tokenBalance;
      } else {
        this.$toast.error(this.invalidIndicator.message);
      }
    },
    show(params: StakeModalParams) {
      this.visible = true;
      this.modalTitle = params.modalTitle;
      this.tokenName = params.tokenName;
      this.tokenBalance = params.poolPrototype.tokenBalance;
      this.poolPrototype = params.poolPrototype;
      this.tokenAmount = null as unknown as number;
    },
    isNumeric(value: any) {
      return /^[+-]?([0-9]+([.][0-9]*)?|[.][0-9]+)$/.test(value);
    },
  },
  watch: {
    tokenAmount(newVal) {
      if (this.isNumeric(newVal)) {
        if (Number(newVal) > this.tokenBalance || this.tokenBalance === 0) {
          this.invalidIndicator = {
            status: true,
            message: "Insufficient funds",
          };
        } else {
          if (Number(newVal) <= 0) {
            this.invalidIndicator = {
              status: true,
              message: "Amount must be greater than 0",
            };
          } else {
            if (
              Number(newVal) + Number(this.poolPrototype.totalDeposit) >
              Number(this.poolPrototype.maxCap)
            ) {
              this.invalidIndicator = {
                status: true,
                message: "Out of pool capacity",
              };
            } else {
              this.invalidIndicator = {
                status: false,
                message: "",
              };
            }
          }
        }
      } else {
        this.invalidIndicator = {
          status: true,
          message: "Please input a number",
        };
      }
    },
  },
  beforeMount() {
    const CastedModal: any = Modal;
    CastedModal.EventBus.$on("show", (params: any) => {
      this.show(params);
    });
    CastedModal.EventBus.$on("hide", () => {
      this.hide();
    });
  },
});
</script>
