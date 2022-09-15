<template>
  <div class="col-md-4 p-1">
    <div class="farming-card">
      <div class="farming-card-content">
        <div class="d-flex justify-content-between">
          <div class="">icon</div>
          <div class="">{TOKEN - TOKEN}</div>
        </div>
        <div class="d-flex justify-content-between">
          <div class="">APR</div>
          <div class="">12 %</div>
        </div>
        <div class="d-flex justify-content-between">
          <div class="">Earn</div>
          <div class="">12 %</div>
        </div>
        <div>TOP EARNED</div>
      </div>
      <div class="farming-btn--light">Connect Wallet</div>
      <div class="farming-btn--detail" @click="showExpand">Expand</div>
      <div v-show="isShowExpand" class="farming-card--expand">expanded</div>
    </div>
  </div>
</template>

<script lang="ts">
import Vue, { PropType } from "vue";
export interface IFarmingCard {
  name: string;
  apr: string;
}
export default Vue.extend({
  name: "farming-card",
  props: {
    data: {
      type: Object as PropType<IFarmingCard>,
      required: false,
    },
  },
  data() {
    return {
      isShowExpand: false,
      maxHeight: "100px",
    };
  },
  computed: {},
  methods: {
    showExpand() {
      this.isShowExpand = !this.isShowExpand;
    },
  },
});
</script>
