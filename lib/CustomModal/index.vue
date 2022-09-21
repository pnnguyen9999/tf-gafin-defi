<template>
  <Transition>
    <div class="modal-wrapper" v-if="visible">
      <h2>{{ modalTitle }}</h2>
      <p>{{ tokenName }}</p>
      <div class="modal-buttons">
        <button class="modal-button" @click="hide">Close</button>
        <button class="modal-button" @click="confirm">Confirm</button>
      </div>
    </div>
  </Transition>
</template>

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

<style lang="scss" scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.2s ease;
}

.v-enter,
.v-leave-to {
  opacity: 0;
}
.modal-wrapper {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 300px;
  height: 200px;
  z-index: 1000;
  border-radius: 2px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
  background-color: #301a09;
}
.modal-buttons {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
}
.modal-button {
  flex-grow: 1;
}
</style>
