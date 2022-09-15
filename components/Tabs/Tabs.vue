<template>
  <div>
    <div class="tabs">
      <div
        v-for="tab in tabs"
        :class="[{ 'is-active': tab.isActive }, 'tab']"
        :key="tab.name"
      >
        <a :href="tab.href" @click="selectTab(tab)">{{ tab.name }}</a>
      </div>
    </div>

    <div class="tabs-details">
      <slot></slot>
    </div>
  </div>
</template>
<style lang="scss">
@mixin tabAnimation($timing-duration) {
  transition-duration: $timing-duration;
  transition-timing-function: ease-in-out;
  transition-property: background-color;
}
.tabs {
  display: flex;
  a {
    text-decoration: none;
    color: #000;
    &:hover {
      color: #000;
    }
  }
  .tab {
    padding: 8px;
    border-radius: 8px;
    @include tabAnimation(200ms);
    &.is-active {
      background: #fe8e26;
      @include tabAnimation(500ms);
    }
  }
}
</style>

<script>
export default {
  name: "tabs",
  data() {
    return {
      tabs: [],
    };
  },
  created() {
    this.tabs = this.$children;
    console.log(this.$children);
  },
  methods: {
    selectTab(selectedTab) {
      this.tabs.forEach((tab) => {
        tab.isActive = tab.name == selectedTab.name;
      });
    },
  },
};
</script>
