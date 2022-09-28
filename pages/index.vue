<template>
  <div class="defi">
    <div class="container">
      <div class="py-5">
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
import Tabs from "@/components/Tabs/Tabs.vue";
import Tab from "@/components/Tabs/Tab.vue";
import "bootstrap/scss/bootstrap.scss";
import "../style/main.scss";
import "animate.css";

export default Vue.extend({
  name: "IndexPage",
  components: { Tabs, Tab, Farming, Staking },
});
</script>
