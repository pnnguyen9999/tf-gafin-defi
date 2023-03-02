<template>
  <Transition>
    <div class="loading-ind py-3">
      <div
        class="spinner-border spinner-border-sm color-org me-2"
        role="status"
      />
      <div class="text">loading pools information</div>
    </div>
  </Transition>
</template>

<script>
export default {};
</script>

<style lang="scss">
.loading-ind {
  display: flex;
  align-items: center;
  .color-org {
    color: #fe8e26;
  }
  .text {
    color: #64615e;
    font-weight: 12pt;
  }
}
.v {
  &-enter-active {
    transition: all 0.15s ease;
  }
  &-leave-active {
    transition: all 0.15s ease-in-out;
  }

  &-leave-to {
    opacity: 0;
  }
  &-enter {
    opacity: 0;
  }
}
</style>
