<template>
  <div
    v-if="userAddress"
    class="panel w-100 d-flex align-items-center justify-content-end animate__animated animate__bounceInDown"
  >
    <img
      class="user-avt"
      :src="`https://avatars.dicebear.com/v2/jdenticon/${userAddress}.svg`"
    />
    <div class="user-address">{{ trimedAddress }}</div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import GafinCrypto from "~/utils/GafinCrypto";
const processAddressString = (_address: string): string => {
  return _address.substring(0, 8) + "..." + _address.substring(38);
};
export default Vue.extend({
  name: "Header",
  data() {
    return {
      gafinCryptoData: GafinCrypto,
    };
  },
  computed: {
    userAddress(): string {
      return this.gafinCryptoData.address;
    },
    trimedAddress(): string {
      return processAddressString(this.userAddress);
    },
  },
});
</script>

<style lang="scss">
.user-avt {
  width: 50px;
  border-radius: 50%;
  border: 1px solid #3f3f3f;
}
.user-address {
  font-family: fontbold;
  margin-left: 10px;
}
</style>
