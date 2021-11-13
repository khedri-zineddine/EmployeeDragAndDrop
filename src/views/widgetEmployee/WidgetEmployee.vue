<template>
  <div class='m-3  flex items-center'>
    <button class='flex items-center bg-white text-gray-800 font-semibold py-1 px-3 border border-gray-400 rounded shadow cursor-pointer' @click="undoAction()" :class="this.employeeOrg.stack_undo.length===0?'cursor-not-allowed opacity-50':'hover:bg-gray-100'" >
        <span class="material-icons">
            undo
        </span>
    </button>
    <button :style="{marginLeft:'10px'}" class='flex items-center bg-white  text-gray-800 font-semibold py-1 px-3 border border-gray-400 rounded shadow cursor-pointer' @click="redoAction()" :class="this.employeeOrg.stack_redo.length===0?'cursor-not-allowed opacity-50':'hover:bg-gray-100'">
        <span class="material-icons">
            redo
        </span>
    </button>
    
  </div>
  <div></div>
  <div class="w-full h-full box-border py-3 overflow-y-auto" :style="{height: height + 'px'}" @scroll="onScroll">
    <EmployeeDetails :employee="employeeOrg.ceo" :moveEmployee="moveEmp" :undo="undoAction" :redo="redoAction"  :itemHeight="itemHeight" :height="height" :scrollTop="scrollTop" :undoRedoData="undoRedoData" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component"; // @ is an alias to /src
import EmployeeDetails from "@/components/widgetEmployee/EmployeeDetails.vue";
import { EmployeeOrgApp } from "@/core/models/EmployeeOrgApp.model";
import { employeeOrg } from "@/core/mocks/employees";
import {Employee} from '@/core/interfaces'

@Options({
  components: {
    EmployeeDetails,
  },
})
export default class WidgetEmployee extends Vue {
  employeeOrg = new EmployeeOrgApp(employeeOrg);
  itemHeight = 50
  scrollTop = 0
  height = 500
  undoRedoData : Employee[] =[]
 public moveEmp(event:any) {
   this.employeeOrg.move(parseInt(event.empID),event.supervisorID)
 }
 public undoAction(){
   const data = this.employeeOrg.undo()??null
   if(data){
    this.undoRedoData = data
  }
 }
 public redoAction(){
   const data = this.employeeOrg.redo()??null
   if(data){
      this.undoRedoData = data
  }
 }
 public onScroll(event:any){
   this.scrollTop = event.target.scrollTop
 }

}
</script>