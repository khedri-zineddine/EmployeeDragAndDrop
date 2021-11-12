<template>
  <ResizablePane>
    <template v-slot:widget>
      <WidgetEmployee />
    </template>
    <template v-slot:content>
      <ContentArea />
    </template>
  </ResizablePane>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import WidgetEmployee from "./widgetEmployee/WidgetEmployee.vue";
import ContentArea from "./contentArea/ContentArea.vue";
import ResizablePane from "@/components/panes/ResizablePane.vue";
@Options({
  components: {
    WidgetEmployee,
    ContentArea,
    ResizablePane,
  },
})
export default class Main extends Vue {}
</script>
