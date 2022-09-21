<template>
  <Transition>
    <div class="stake-modal-wrapper" v-if="visible">
      <div class="stake-modal-content">
        <div class="mb-auto">
          <div class="stake-modal-header p-3">
            <div class="title">Stake LP Tokens</div>
            <img class="icon" src="@/assets/img/close-ico.png" />
          </div>
          <div class="border-btm" />
          <div class="p-3">
            <div class="amount-content">
              <div
                class="w-100 d-flex align-items-center justify-content-between"
              >
                <div class="title min">Stake</div>
                <div class="title min">Balance: 0</div>
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
                </div>
                <div class="d-flex align-items-center">
                  <div class="max-btn me-2">MAX</div>
                  <div class="title">TOP-BNB LP</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div class="stake-btn-wrapper p-3">
            <div class="btn-cancel" @click="hide">Cancel</div>
            <div class="btn-confirm" @click="confirm">Confirm</div>
          </div>
          <div class="pb-3 w-100 text-center title min">Get TOP-BNB LP</div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
@import "@/style/mixins.scss";
.stake-modal-wrapper {
  .max-btn {
    @include normalBtn();
    font-size: 11pt;
    background-color: #059872;
    font-weight: bold;
    width: 80px;
  }
  .token-amount {
    width: 150px;
    background-color: #110f0e;
    color: #fff;
    border: 0px;
    font-weight: bold;
    font-size: 14pt;
  }
  .amount-content {
    border: 1px solid #413f3e;
    border-radius: 10px;
    padding: 15px;
    @include flex-column-center();
  }
  .title {
    font-weight: bold;
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
  // height: 250px;
  background-color: #110f0e;
  margin-bottom: 10%;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
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
  }
}
</style>

<script lang="ts">
import Vue from "vue";
import Modal from "./plugin.js";
export interface StakeModalParams {
  modalTitle: string;
  tokenName: string;
  tokenBalance: number;
  onConfirm: () => void;
}
export default Vue.extend({
  data() {
    return {
      visible: false,
      onConfirm: () => {},
      modalTitle: "",
      tokenAmount: 0,
      tokenName: "",
      tokenBalance: 0,
    };
  },
  methods: {
    hide() {
      this.visible = false;
    },
    confirm() {
      if (typeof this.onConfirm === "function") {
        this.onConfirm();
        this.hide();
      } else {
        this.hide();
      }
    },
    show(params: StakeModalParams) {
      this.visible = true;
      this.modalTitle = params.modalTitle;
      this.tokenName = params.tokenName;
      this.tokenBalance = params.tokenBalance;
      this.onConfirm = params.onConfirm;
      this.tokenAmount = 0;
    },
  },
  beforeMount() {
    const CastedModal: any = Modal;
    CastedModal.EventBus.$on("show", (params: any) => {
      this.show(params);
    });
  },
});
</script>
