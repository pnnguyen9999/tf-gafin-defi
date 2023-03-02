import Vue from "vue";
import { ToastApi } from "vue-toast-notification";
import { StakeModalApi } from "~/lib/CustomModal/StakeModal";

declare module "vue/types/vue" {
  // constructor for class model use
  interface VueConstructor {
    $stakeModal: StakeModalApi;
    $toast: ToastApi;
  }
  // global component use
  interface Vue {
    $stakeModal: StakeModalApi;
    $toast: ToastApi;
  }
}

declare global {
  interface Window {
    ethereum: any;
  }
}
