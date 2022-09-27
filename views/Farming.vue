<template>
  <div>
    <FarmingPanel />
    <div class="col-12">
      <div v-if="isLiveFarming" class="row">
        <FarmingCard
          v-for="(data, index) in dataFetchFarmingInfoLive"
          :dataFarmingCard="data"
          :key="index"
        />
      </div>
      <div v-else class="row">
        <FarmingCard
          v-for="(data, index) in dataFetchFarmingInfoEnd"
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
import { mapState } from "vuex";
import Moment from "moment";
import PoolSingle from "~/utils/SinglePool";

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
      dataFetchFarmingInfoEnd: [] as PoolSingle[],
    };
  },
  created() {
    EventBus.$on("userWalletConnected", this.userWalletConnected.bind(this));
  },
  computed: {
    ...mapState("UserInterfaceState", {
      isLiveFarming: "isLiveFarming",
    }),
    dataFetchFarmingInfoLive(): PoolSingle[] {
      const arr = [] as PoolSingle[];
      if (this.dataFetchFarmingInfo.pools) {
        this.dataFetchFarmingInfo.pools.forEach((pool) => {
          console.log(pool.poolEndTimeUnix);
          if (pool.poolEndTimeUnix > Moment().unix()) {
            arr.push(pool);
          } else {
            this.dataFetchFarmingInfoEnd.push(pool);
          }
        });
      }
      return arr;
    },
  },
  methods: {
    userWalletConnected() {
      this.dataFetchFarmingInfo.pools.forEach(async (pool) => {
        await pool.checkAllowance();
        await pool.initUserInfoInPool();
      });
    },
  },
  mounted() {
    const timeNow = Moment().unix();
    console.log(timeNow);
    const fetchingData = async () => {
      this.dataFetchFarmingInfo = await useFetchFarmingInfo();
    };
    fetchingData();
    this.intervalFetching = setInterval(fetchingData, 15000);
  },

  destroyed() {
    clearInterval(this.intervalFetching);
  },
});
</script>
