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
  align-items: center;
  justify-content: center;
  margin: 15px 0px;
  a {
    text-decoration: none;
    color: #b5afaa;
    font-size: 15pt;
    transition: all 0.5s ease-in-out;
    &:hover {
      color: #fff;
    }
  }
  .tab {
    padding: 10px;
    border-radius: 8px;
    @include tabAnimation(200ms);
    &.is-active {
      @include tabAnimation(500ms);
      a {
        color: #fe8e26;
        font-family: fontbold;
      }
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
