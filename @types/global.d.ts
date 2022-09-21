import Vue from "vue";

declare module "vue/types/vue" {
  interface Vue {
    $stakeModal: {
      show: (params: any) => void;
    };
  }
}

declare global {
  interface Window {
    ethereum: any;
  }
}
