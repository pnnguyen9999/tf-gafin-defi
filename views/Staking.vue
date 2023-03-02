<template>
  <div>
    <StakingPanel />
    <Loading v-if="!isFetchingCompleted" />
    <div v-else class="col-12">
      <div v-if="isLiveStaking" class="row">
        <FarmingCard
          v-for="(data, index) in dataFetchStakingInfoLive"
          :dataFarmingCard="data"
          cardType="staking"
          :key="index"
        />
        <div v-if="dataFetchStakingInfoLive.length === 0">
          <EmptyAnim />
        </div>
      </div>
      <div v-else class="row">
        <FarmingCard
          v-for="(data, index) in dataFetchStakingInfoEnd"
          :dataFarmingCard="data"
          cardType="staking"
          :key="index + 'end'"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss"></style>
<script lang="ts">
import FarmingCard from "@/components/FarmingCard/farming-card.vue";
import useFetchFarmingInfo, { FarmingInfoData } from "@/utils/FetchFarmingInfo";
import Vue from "vue";
import EventBus from "~/event/EventBus";
import { mapState } from "vuex";
import Moment from "moment";
import PoolStaking from "~/utils/StakingPool";
import StakingPanel from "~/components/StakingPanel.vue";
import EmptyAnim from "~/components/Stuff/EmptyAnim.vue";
import Loading from "~/components/Stuff/Loading.vue";

export default Vue.extend({
  name: "Home-DEFI",
  components: {
    FarmingCard,
    StakingPanel,
    EmptyAnim,
    Loading,
  },
  props: {},
  data() {
    return {
      dataFetchStakingInfo: {} as FarmingInfoData,
      intervalFetching: null as unknown as NodeJS.Timer,
      dataFetchStakingInfoEnd: [] as PoolStaking[],
    };
  },
  created() {
    EventBus.$on("userWalletConnected", this.userWalletConnected.bind(this));
  },
  computed: {
    ...mapState("UserInterfaceState", {
      isLiveStaking: "isLiveStaking",
    }),
    ...mapState("FetchingState", {
      isFetchingCompleted: "isCompleted",
    }),
    dataFetchStakingInfoLive(): PoolStaking[] {
      const arr = [] as PoolStaking[];
      const arrEnd = [] as PoolStaking[];
      if (this.dataFetchStakingInfo.poolsStaking) {
        this.dataFetchStakingInfo.poolsStaking.forEach((pool) => {
          console.log(pool.poolEndTimeUnix);
          if (pool.isLive()) {
            arr.push(pool);
          } else {
            arrEnd.push(pool);
            this.dataFetchStakingInfoEnd = arrEnd;
          }
        });
      }
      return arr;
    },
  },
  methods: {
    userWalletConnected() {
      this.dataFetchStakingInfo.poolsStaking.forEach(async (pool) => {
        await pool.checkAllowance();
        await pool.initUserInfoInPool();
      });
    },
  },
  mounted() {
    const timeNow = Moment().unix();
    console.log(timeNow);
    const fetchingData = async () => {
      this.dataFetchStakingInfo = await useFetchFarmingInfo();
    };
    fetchingData();
    this.intervalFetching = setInterval(fetchingData, 30000);
  },

  destroyed() {
    clearInterval(this.intervalFetching);
  },
});
</script>
