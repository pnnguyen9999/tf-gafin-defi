<template>
  <div>
    <div class="tabs">
      <div
        v-for="tab in tabs"
        :key="tab.id"
        @click="onSelected(tab)"
        :class="[{ isActive: tab.isActive }, 'tab']"
      >
        {{ tab.name }}
      </div>
    </div>
    <div class="col-12">
      <div class="row">
        <div
          v-for="tab in tabs"
          :key="tab.id"
          :class="selectedCountToColNumber"
          v-show="tab.isActive"
        >
          {{ tab.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tabs {
  display: flex;
  .tab {
    &.isActive {
      background-color: #fd8e26;
    }
  }
}
</style>
<script lang="ts">
import Vue from "vue";
interface ITab {
  name: string;
  id: string;
  isActive: boolean;
}
export default Vue.extend({
  data() {
    return {
      tabs: [
        {
          name: "cat1",
          id: "cat1",
          isActive: false,
        },
        {
          name: "cat2",
          id: "cat2",
          isActive: false,
        },
        {
          name: "cat3",
          id: "cat3",
          isActive: false,
        },
        {
          name: "cat4",
          id: "cat4",
          isActive: false,
        },
      ] as ITab[],
      selected: [] as ITab[],
    };
  },
  watch: {
    selected(newVal) {
      console.log(newVal);
    },
  },
  computed: {
    selectedCountToColNumber(): string {
      switch (this.selected.length) {
        case 0: {
          return "col-0";
        }
        case 1: {
          return "col-12";
        }
        case 2: {
          return "col-6";
        }
        case 3: {
          return "col-4";
        }
        case 4: {
          return "col-3";
        }
        default: {
          return "col-12";
        }
      }
    },
  },
  methods: {
    onSelected(tab: ITab) {
      console.log(tab);
      const index = this.selected.indexOf(tab);
      if (index === -1) {
        this.selected.push(tab);
        tab.isActive = true;
      } else {
        this.selected.splice(index, 1);
        tab.isActive = false;
      }
    },
  },
});
</script>
