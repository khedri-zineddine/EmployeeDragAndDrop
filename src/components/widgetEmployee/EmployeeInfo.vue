<template>
  <div
    class="
      flex
      items-center
      cursor-pointer
      pr-3
      py-3
      hover:bg-gray-900 hover:bg-opacity-10
      transition
    "
    :class="dragHover?' bg-gray-900 bg-opacity-10 ':''"
    @click="this.handleTree(employee)"
    draggable="true"
    @dragstart="startDrag($event,employee,parent)"
    @drop="onDropElem" 
    @dragover="onDragEnter"
    @dragenter.prevent
    @dragleave="onDragLeave"
  >
    <div :style="{ width: offsetItem ? offsetItem * 28 + 'px' : '10px' }"></div>
    <span
      class="material-icons select-none"
      v-if="employee.subordinates && employee.subordinates.length"
    >
      {{ toggled ? "remove_circle" : "add_circle" }}
    </span>
    <div v-else :style="{ width: '23px' }">
      <span class="material-icons select-none">
          horizontal_rule
      </span>
    </div>
    <span class="block ml-2 select-none">{{ employee.name }}</span>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "EmployeeInfo",
  props: {
    offsetItem: Number,
    handleTree: Function,
    toggled: Boolean,
    employee: Object,
    startDrag: Function,
    onDrop: Function,
    parent:Object,
  },
  data(){
    return{
      dragHover:false
    }
  },
  methods:{
    onDragEnter(event:any){
      event.preventDefault()
      this.dragHover = true
    },
    onDragLeave(event:any){
      event.preventDefault()
      this.dragHover = false
    },
    onDropElem(event:any){
      if(this.onDrop)
        this.onDrop(event, this.employee)
      this.dragHover = false
    }
  }
});
</script>