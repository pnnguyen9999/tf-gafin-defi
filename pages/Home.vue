<template>
  <div>
    <FarmingPanel />
    <div class="col-12">
      <div class="row">
        <FarmingCard
          v-for="(data, index) in dataFetchFarmingInfo.singlePools"
          :dataFarmingCard="data"
          :key="index"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss"></style>
<script lang="ts">
import Tabs from "@/components/Tabs/Tabs.vue";
import Tab from "@/components/Tabs/Tab.vue";
import FarmingCard from "@/components/FarmingCard/farming-card.vue";
import FarmingPanel from "@/components/FarmingPanel.vue";
import useFetchFarmingInfo, { FarmingInfoData } from "@/utils/FetchFarmingInfo";
import Vue from "vue";
import EventBus from "~/event/EventBus";

export default Vue.extend({
  name: "Home-DEFI",
  components: {
    Tabs,
    Tab,
    FarmingCard,
    FarmingPanel,
  },
  props: {},
  data() {
    return {
      dataFetchFarmingInfo: {} as FarmingInfoData,
      intervalFetching: null as unknown as NodeJS.Timer,
    };
  },
  created() {
    EventBus.$on("checkAllAllowance", this.checkAllowanceAll.bind(this));
  },
  methods: {
    checkAllowanceAll() {
      this.dataFetchFarmingInfo.singlePools.forEach((pool) => {
        pool.checkAllowance();
      });
    },
  },
  mounted() {
    const fetchingData = async () => {
      this.dataFetchFarmingInfo = await useFetchFarmingInfo();
    };
    fetchingData();
    this.intervalFetching = setInterval(fetchingData, 10000);
  },
  destroyed() {
    clearInterval(this.intervalFetching);
  },
});
</script>
