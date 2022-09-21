<template>
  <Transition>
    <div class="custom-modal-wrapper" v-if="visible">
      <div class="custom-modal-content">
        <div class="mb-auto">
          <div>
            <h2>{{ modalTitle }}</h2>
            <p>{{ tokenName }}</p>
            <p>{{ tokenBalance }}</p>
          </div>
        </div>
        <div class="stake-btn-wrapper">
          <div class="btn-cancel" @click="hide">Close</div>
          <div class="btn-confirm" @click="confirm">Confirm</div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
@import "@/style/mixins.scss";
.v {
  &-enter-active {
    transition: all 0.2s ease;
  }
  &-leave-active {
    transition: all 0.3s ease-in-out;
  }

  &-leave-to {
    opacity: 0;
  }
  &-enter {
    opacity: 0;
  }
}

.custom-modal-content {
  display: flex;
  flex-direction: column;
  position: relative;
  width: 380px;
  height: 300px;
  background-color: #110f0e;
  margin-bottom: 100px;
  padding: 10px;
  border-radius: 10px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
}
.custom-modal-wrapper {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100vw;
  height: 100vh;
  z-index: 1000;
  border-radius: 2px;
  background-color: rgba($color: #00000070, $alpha: 0.3);
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
    background-color: #201a0b;
    border: 1px solid #fe8e26;
    color: #fe8e26;
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
  tokenAmount?: number;
  tokenBalance: number;
  onConfirm: () => void;
}
export default Vue.extend({
  data() {
    return {
      visible: false,
      onConfirm: () => {},
      modalTitle: "",
      tokenAmount: "",
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
