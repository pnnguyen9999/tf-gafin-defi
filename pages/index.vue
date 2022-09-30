<template>
  <div class="defi">
    <MenuPanel />
    <div class="container main-ctn">
      <div class="pt-5">
        <Header />
        <Tabs>
          <Tab name="Farming" :selected="true">
            <Farming />
          </Tab>
          <Tab name="Staking">
            <Staking />
          </Tab>
        </Tabs>
        <Footer />
        <StakeModal />
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.defi {
  color: #fff;
  height: 100vh;
}
</style>
<script lang="ts">
import Vue from "vue";
import Farming from "@/views/Farming.vue";
import Staking from "@/views/Staking.vue";
import MenuPanel from "~/components/MenuPanel/MenuPanel.vue";
import Header from "~/components/Header/Header.vue";
import Footer from "~/components/Footer/Footer.vue";
import Tabs from "@/components/Tabs/Tabs.vue";
import Tab from "@/components/Tabs/Tab.vue";
import "bootstrap/scss/bootstrap.scss";
import "../style/main.scss";
import "animate.css";
import EventBus from "~/event/EventBus";
import { mapMutations, mapState } from "vuex";

export default Vue.extend({
  name: "IndexPage",
  components: { Tabs, Tab, Farming, Staking, MenuPanel, Header, Footer },
  created() {
    EventBus.$on("fetching-completed", this.setCompleteStatusState.bind(this));
  },
  computed: {
    ...mapState("FetchingState", {
      isFetchingCompleted: "isCompleted",
    }),
  },
  methods: {
    ...mapMutations({
      setCompleteStatus: "FetchingState/setCompleteStatus",
    }),
    setCompleteStatusState() {
      if (!this.isFetchingCompleted) {
        this.setCompleteStatus(true);
        this.$toast.open("All data has been loaded");
      }
    },
  },
});
</script>
