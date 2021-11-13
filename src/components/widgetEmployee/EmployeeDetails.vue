<template>
  
  <div class="" :style="{ height: baseHeight + 'px' }" >
    <div class="mb-2" 
      v-for="(item,index) in listData" :key="index" >
      <EmployeeInfo
        v-if="expandedElements[item.emp.uniqueId].visible"
        :handleTree="toggleTree"
        :toggled="expandedElements[item.emp.uniqueId].expand"
        :employee="item.emp"
        :parent="item.parent"
        :offsetItem="item.level"
        :startDrag="startDrag"
        :onDrop="onDrop"
      />
    </div>
    
  </div>
</template>
<script lang="ts">
import { Employee } from "@/core/interfaces";
import { defineComponent, onUpdated } from "vue";
import EmployeeInfo from "./EmployeeInfo.vue";

export default defineComponent({
  name: "EmployeeDetails",
  props: {
    undo: Function,
    redo : Function,
    moveEmployee: Function,
    undoRedoData : Object,
    employee: Object,
    height:{
      type:Number,
      default:500
    },
    itemHeight:{
      type:Number,
      default:50
    },
    scrollTop:{
      type:Number,
      default: 0
    },
  },
  components: {
    EmployeeInfo,
  },
  data() {
    return {
      expandedElements: {} as { [key: string]: {expand:boolean,visible:boolean} },
      listData: [] as {emp:Employee,level:number,parent:Employee}[],
      baseHeight : 0
    };
  },
  computed: {
    getStartIndex(){
      return Math.floor(this.scrollTop / this.itemHeight)
    },
    countVisibleItem(){
      return Math.floor(this.height / this.itemHeight)
    }
  },
  watch: { 
    scrollTop: function(newVal, oldVal) { // watch it
      if(newVal!=oldVal){
        this.updateList()
      }
    },
    listData : function(newVal,oldval){
      //console.log("new val",newVal)
      //console.log("old val",oldval)
    },
    undoRedoData: function(newVal,oldval){
      if(newVal!=oldval){
          console.log("sdflsdjflksjdf")
          if(this.employee){
          const val = this.expandedElements[this.employee.uniqueId].expand;
          this.expandedElements[this.employee.uniqueId].expand = val
          this.updateToggleTree(this.employee.subordinates,val)
          this.updateList()
        }
      }
    }
  },
  methods: {
    flattenTree(employee:any,level:number=0,parent:any=null):{emp:Employee,level:number,parent:Employee}[]{
      if(employee && employee.subordinates.length==0){
        return [{emp:employee,level:level,parent:parent}]
      }
      const listEmployees = employee.subordinates
      let arr = []
      arr.push({emp:employee,level:level,parent:parent})
      for (const emp of listEmployees) {
        arr.push(...this.flattenTree(emp,level+1,employee))
      }
      return arr
    },
    initExpandedElements(employee:any){
      const val = {expand:false,visible:false}
      this.expandedElements[employee.uniqueId] = val
      for (const emp of employee.subordinates) {
        this.initExpandedElements(emp)
        this.expandedElements[employee.uniqueId] = val
      }
    },
    updateList(){
        const visibleData = this.flattenTree(this.employee,0).filter(elem=>this.expandedElements[elem.emp.uniqueId].visible)
        this.baseHeight = visibleData.length*this.itemHeight
        let start = this.getStartIndex
        const end = start + this.countVisibleItem
        this.listData = visibleData.slice(start,end)
    },
    toggleTree(employee:Employee) {
      const val = !this.expandedElements[employee.uniqueId].expand;
      this.expandedElements[employee.uniqueId].expand = val
      this.updateToggleTree(employee.subordinates,val)
      this.updateList()
    },
    updateToggleTree(employee:Employee[],value:boolean){
      for(const index in employee){
        const subEmp = employee[index]
        this.expandedElements[subEmp.uniqueId].visible = value
        if(subEmp.subordinates && this.expandedElements[subEmp.uniqueId].expand){
          this.updateToggleTree(subEmp.subordinates,value)
        }
      }
    },
    startDrag(event:any, emp:Employee,parent:Employee) {
      event.dataTransfer.dropEffect = 'move'
      event.dataTransfer.effectAllowed = 'move'
      const data = JSON.stringify(emp)
      const par = JSON.stringify(parent)
      event.dataTransfer.setData('emp', data)
      event.dataTransfer.setData('par', par)
    },
    onDrop(event:any, supervisor:Employee) {
      const emp = JSON.parse(event.dataTransfer.getData('emp'))
      const parent = JSON.parse(event.dataTransfer.getData('par'))
      if(emp.uniqueId!=supervisor.uniqueId){
        this.emitSignal(emp,parent,supervisor)
      }
    },
    emitSignal(emp:Employee,parent:Employee,supervisor:Employee){
      if(this.moveEmployee){
        this.moveEmployee({empID:emp.uniqueId,supervisorID:supervisor.uniqueId})
        const val = this.expandedElements[supervisor.uniqueId].expand
        this.updateToggleTree(supervisor.subordinates,val)
        const val1 = this.expandedElements[parent.uniqueId].expand
        this.updateToggleTree(emp.subordinates,val1)
        this.updateList()
      }
    },
    /*undoAction(){
      if(this.undo&&this.employee){
        this.undo()
        //const val = this.expandedElements[this.employee.uniqueId].expand
        //this.updateToggleTree(this.employee.subordinates,val)
      }
    },
    redoAction(){
      if(this.redo){
        this.redo()
        this.updateList()
      }
    }*/
  },
  mounted(){
    if(this.employee){
      this.initExpandedElements(this.employee)
      this.expandedElements[1].visible = true
      this.updateList()
    }
  },
});
</script>