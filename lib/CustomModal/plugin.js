import AppModal from "./StakeModal.vue";

const Modal = {
  install(Vue, options) {
    this.EventBus = new Vue();

    Vue.component("StakeModal", AppModal);

    Vue.prototype.$stakeModal = {
      show(params) {
        Modal.EventBus.$emit("show", params);
      },
      hide() {
        Modal.EventBus.$emit("hide");
      },
    };
  },
};

export default Modal;
