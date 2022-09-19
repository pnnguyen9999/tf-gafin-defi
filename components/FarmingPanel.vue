<template>
  <div class="farming-panel">
    <div class="d-flex justify-content-between align-items-center">
      <div>123</div>
      <div>
        <img
          class="view-icon"
          @click="changeView(ViewType.SQUARE)"
          src="@/assets/img/square-view.png"
        />
        <img
          class="view-icon"
          @click="changeView(ViewType.RECTANGLE)"
          src="@/assets/img/rectangle-view.png"
        />
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.farming-panel {
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  border: 1px solid #37322f;
  padding: 10px;
}
.view-icon {
  margin: 0px 4px;
  height: 22px;
  cursor: pointer;
}
</style>
<script lang="ts">
import { mapMutations } from "vuex";
import Vue from "vue";
import ViewType from "@/constant/UI";

export default Vue.extend({
  name: "FarmingPanel",
  data() {
    return {
      ViewType: ViewType,
    };
  },
  methods: {
    ...mapMutations({
      changeView: "UserInterfaceState/changeView",
    }),
  },
});
</script>
