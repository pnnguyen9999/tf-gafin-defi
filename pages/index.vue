<template>
  <div class="defi">
    <MenuPanel />
    <div class="container ps-md-5 ps-2">
      <div class="py-5">
        <Header />
        <Tabs>
          <Tab name="Farming" :selected="true">
            <Farming />
          </Tab>
          <Tab name="Staking">
            <Staking />
          </Tab>
        </Tabs>
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
import Tabs from "@/components/Tabs/Tabs.vue";
import Tab from "@/components/Tabs/Tab.vue";
import "bootstrap/scss/bootstrap.scss";
import "../style/main.scss";
import "animate.css";

export default Vue.extend({
  name: "IndexPage",
  components: { Tabs, Tab, Farming, Staking, MenuPanel, Header },
});
</script>
