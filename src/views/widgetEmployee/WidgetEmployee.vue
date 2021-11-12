<template>
  <div class="w-full h-full box-border py-3">
    <EmployeeDetails :employee="employeeOrg.ceo" :offsetItem="0" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component"; // @ is an alias to /src
import EmployeeDetails from "@/components/widgetEmployee/EmployeeDetails.vue";
import { EmployeeOrgApp } from "@/core/models/EmployeeOrgApp.model";
import { employeeOrg } from "@/core/mocks/employees";

@Options({
  components: {
    EmployeeDetails,
  },
})
export default class WidgetEmployee extends Vue {
  employeeOrg = new EmployeeOrgApp(employeeOrg);
  mounted() {}
}
</script>