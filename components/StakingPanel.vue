<template>
  <div class="staking-panel">
    <div class="d-flex justify-content-between align-items-center">
      <div class="staking-status">
        <div
          :class="['live', isLiveStaking && 'active']"
          @click="switchLiveStatusStaking(true)"
        >
          Live
        </div>
        <div
          :class="['finished', !isLiveStaking && 'active']"
          @click="switchLiveStatusStaking(false)"
        >
          Finished
        </div>
      </div>
      <div>
        <img
          class="view-icon"
          @click="changeViewStaking(ViewType.SQUARE)"
          :src="
            require(`@/assets/img/square-view${
              viewTypeState === ViewType.SQUARE ? '-active' : ''
            }.png`)
          "
        />
        <img
          class="view-icon"
          @click="changeViewStaking(ViewType.RECTANGLE)"
          :src="
            require(`@/assets/img/rectangle-view${
              viewTypeState === ViewType.RECTANGLE ? '-active' : ''
            }.png`)
          "
        />
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.staking-panel {
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 10px;
  border: 1px solid #37322f;
  padding: 10px;
  .staking-status {
    display: flex;
    align-items: center;
    padding: 5px;
    border: 1px solid #393939;
    border-radius: 8px;
    .live,
    .finished {
      cursor: pointer;
      padding: 8px 20px;
      border-radius: 8px;
      color: #b6b0aa;
      transition: all 0.2s ease-in-out;
      margin-right: 5px;
      &.active {
        font-family: fontbold;
        background-color: #fe8e26;
        color: #fff;
      }
    }
  }
}
.view-icon {
  margin: 0px 4px;
  height: 22px;
  cursor: pointer;
}
</style>
<script lang="ts">
import { mapMutations, mapState } from "vuex";
import Vue from "vue";
import ViewType from "@/constant/UI";

export default Vue.extend({
  name: "stakingPanel",
  data() {
    return {
      ViewType: ViewType,
    };
  },
  computed: {
    ...mapState("UserInterfaceState", {
      isLiveStaking: "isLiveStaking",
      viewTypeState: "viewTypeStaking",
    }),
  },
  methods: {
    ...mapMutations({
      changeViewStaking: "UserInterfaceState/changeViewStaking",
      switchLiveStatusStaking: "UserInterfaceState/switchLiveStatusStaking",
    }),
  },
});
</script>
