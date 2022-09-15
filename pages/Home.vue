<template>
  <div>
    <button v-show="!GafinCryptoData.web3" @click="GafinCryptoData.connect()">
      connect wallet
    </button>
    {{ GafinCryptoData.address }}
    <div class="col-12">
      <div class="row">
        <FarmingCard v-for="(data, index) in dataFarmingCard" :key="index" />
      </div>
    </div>
  </div>
</template>

<style lang="scss"></style>
<script lang="ts">
import Tabs from "@/components/Tabs/Tabs.vue";
import Tab from "@/components/Tabs/Tab.vue";
import FarmingCard from "@/components/FarmingCard/farming-card.vue";
import GafinCrypto from "@/utils/GafinCrypto";
import useFetchFarmingInfo, { FarmingInfoData } from "@/utils/FetchFarmingInfo";
import Vue from "vue";

export default Vue.extend({
  name: "Home-DEFI",
  components: {
    Tabs,
    Tab,
    FarmingCard,
  },
  props: {
    homeType: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      dataFarmingCard: [0, 1, 2],
      GafinCryptoData: GafinCrypto,
      dataFetchFarmingInfo: {} as FarmingInfoData,
      intervalFetching: null as unknown as NodeJS.Timer,
    };
  },
  mounted() {
    const fetchingData = async () => {
      this.dataFetchFarmingInfo = await useFetchFarmingInfo();
    };
    fetchingData();
    this.intervalFetching = setInterval(fetchingData, 2000000);
  },
  destroyed() {
    clearInterval(this.intervalFetching);
  },
});
</script>
