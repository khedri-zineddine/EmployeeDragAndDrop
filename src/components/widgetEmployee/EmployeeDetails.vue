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
  },
  methods: {
    //convert the tree into array of objects
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
    // create array of objects. this array store the state of each node in the tree : Expanded, Visible
    initExpandedElements(employee:any){
      const val = {expand:false,visible:false}
      this.expandedElements[employee.uniqueId] = val
      for (const emp of employee.subordinates) {
        this.initExpandedElements(emp)
        this.expandedElements[employee.uniqueId] = val
      }
    },
    // define the element that will be rendred. based on scroll, itemHeight, heigth
    updateList(){
        const visibleData = this.flattenTree(this.employee,0).filter(elem=>this.expandedElements[elem.emp.uniqueId].visible)
        this.baseHeight = visibleData.length*this.itemHeight + this.itemHeight 
        let start = this.getStartIndex
        const end = start + this.countVisibleItem
        this.listData = visibleData.slice(start,end)
    },
    // expand and collapse tree elements
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
    // update tree visibility when undo/redo is triggered
    checkExpands(employee:any){
      const recursiveExpand=(employees:Employee[],expanded:boolean,visible:boolean)=>{
        for(const index in employees){
          const subEmp = employees[index]
          this.expandedElements[subEmp.uniqueId].visible = expanded && visible
          const tmp = this.expandedElements[subEmp.uniqueId].expand
          recursiveExpand(subEmp.subordinates,tmp,expanded && visible)
        }
      }
      const valExp = this.expandedElements[employee.uniqueId].expand
      const valVisib = this.expandedElements[employee.uniqueId].visible
      recursiveExpand(employee.subordinates,valExp,valVisib)
      this.updateList()
    },
    // event to drag element
    startDrag(event:any, emp:Employee,parent:Employee) {
      event.dataTransfer.dropEffect = 'move'
      event.dataTransfer.effectAllowed = 'move'
      const data = JSON.stringify(emp)
      const par = JSON.stringify(parent)
      event.dataTransfer.setData('emp', data)
      event.dataTransfer.setData('par', par)
    },
    // event to drop element
    onDrop(event:any, supervisor:Employee) {
      const emp = JSON.parse(event.dataTransfer.getData('emp'))
      const parent = JSON.parse(event.dataTransfer.getData('par'))
      if(emp.uniqueId!=supervisor.uniqueId){
        this.emitSignal(emp,parent,supervisor)
      }
    },
    // notify parent when element is droped
    emitSignal(emp:Employee,parent:Employee,supervisor:Employee){
      if(this.moveEmployee){
        this.moveEmployee({empID:emp.uniqueId,supervisorID:supervisor.uniqueId})
        const val = this.expandedElements[supervisor.uniqueId].expand
        this.updateToggleTree(supervisor.subordinates,val)
        const val1 = this.expandedElements[parent.uniqueId].expand
        this.updateToggleTree(emp.subordinates,val1)
        this.updateList()
      }
    }
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