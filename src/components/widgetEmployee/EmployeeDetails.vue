<template>
  <div class="mb-2">
    <EmployeeInfo
      :handleTree="toggleTree"
      :toggled="treeToggled"
      :employee="employee"
      :offsetItem="offsetItem"
    />
    <div
      :style="{
        maxHeight: treeToggled ? '2000px' : '0px',
      }"
      class="transition-all overflow-hidden"
      v-if="employee.subordinates && employee.subordinates.length"
    >
      <div v-if="treeToggled">
        <EmployeeDetails
          :key="index"
          v-for="(child, index) in employee.subordinates"
          :employee="child"
          :offsetItem="offsetItem + 1"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import EmployeeInfo from "./EmployeeInfo.vue";

export default defineComponent({
  name: "EmployeeDetails",
  props: {
    employee: Object,
    offsetItem: Number,
  },
  components: {
    EmployeeInfo,
  },
  data() {
    return {
      treeToggled: false,
    };
  },
  methods: {
    toggleTree() {
      this.treeToggled = !this.treeToggled;
    },
  },
});
</script>