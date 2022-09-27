<template>
  <div class="defi">
    <div class="container">
      <div class="py-5">
        <Farming />
        <StakeModal />
      </div>
    </div>
  </div>
</template>
<style lang="scss">
.defi {
  background-image: url("~/assets/bg-1.png");
  background-size: cover;
  background-repeat: no-repeat;
  background-color: #000;
  color: #fff;
  height: 100vh;
}
</style>
<script lang="ts">
import Vue from "vue";
import Farming from "@/views/Farming.vue";
import "bootstrap/scss/bootstrap.scss";
import "../style/main.scss";
import "animate.css";

export default Vue.extend({
  name: "IndexPage",
  components: { Farming },
});
</script>
