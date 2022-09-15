<template>
  <!-- <Tutorial/> -->
  <div class="defi">
    <div class="container">
      <Home :homeType="passHome" />
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
import Home from "@/pages/Home.vue";
import "bootstrap/scss/bootstrap.scss";
import "../style/main.scss";

export default Vue.extend({
  name: "IndexPage",
  components: { Home },
  data() {
    return {
      passHome: "this is passHome",
    };
  },
});
</script>
