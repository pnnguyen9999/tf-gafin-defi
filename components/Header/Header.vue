<template>
  <div
    v-if="userAddress"
    class="panel w-100 d-flex align-items-center justify-content-end animate__animated animate__bounceInDown"
  >
    <img
      class="user-avt"
      :src="`https://avatars.dicebear.com/v2/croodles/${userAddress}.svg`"
      type="button"
      id="dropdownMenuButton1"
      data-bs-toggle="dropdown"
    />
    <div class="user-address">{{ trimedAddress }}</div>

    <div
      class="dropdown-menu user-info animate__animated animate__fadeIn animate__faster"
      aria-labelledby="dropdownMenuButton1"
    >
      <div class="user-info--item">
        <img class="icon" src="@/assets/img/bnb-ico.png" />
        <div class="text">{{ userNativeBalance }} BNB</div>
      </div>
      <hr />
      <div class="user-info--item button" @click="handleLogOut()">
        <img class="icon" src="@/assets/img/log-out.png" />
        <div class="log-out">Disconnect</div>
      </div>
    </div>
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
  //   head: {
  //     script: [
  //       {
  //         src: "~/node_modules/bootstrap/dist/js/bootstrap.bundle.min.js",
  //       },
  //     ],
  //   },
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
    userNativeBalance(): string {
      return Number(this.gafinCryptoData.currentBalance).toFixed(2);
    },
  },
  methods: {
    handleLogOut() {
      window.location.reload();
    },
  },
});
</script>

<style lang="scss" scoped>
hr {
  margin: 5px !important;
}
.user-info {
  background-color: #23231d !important;
  color: #fff !important;
  border: 2px solid #505050 !important;
  padding: 8px !important;
  margin-top: 10px !important;
  width: 200px;
  &--item {
    display: flex;
    align-items: center;
    padding: 4px 0px;
    &.button {
      cursor: pointer;
      transition: all 0.2s ease-in-out;
      &:hover {
        transform: translateX(10px);
      }
    }
    .icon {
      width: 22px;
      margin-right: 8px;
    }
    .text {
      font-family: fontbold;
    }
    .log-out {
      font-family: fontreg;
    }
  }
}
.user-avt {
  width: 50px;
  border-radius: 50%;
  border: 3px solid #fe8e26;
  background-color: #fff;
  transition: all 0.2s ease-in-out;
  &:hover {
    transform: scale(1.08);
  }
}
.user-address {
  font-family: fontbold;
  margin-left: 10px;
}
</style>
