<template>
  <div
    class="flex h-full w-full"
    :class="{ 'is-dragging': dragging }"
    @mousemove="dragMove"
    @mouseup="dragEnd"
    @mouseleave="dragEnd"
  >
    <div
      class="h-full transition-panels overflow-y-auto"
      :style="{ width: splitLeft }"
    >
      <slot name="widget"></slot>
    </div>
    <div
      class="h-full border-l-4 border-gray-600 pannel-move"
      @mousedown="dragStart"
    ></div>
    <div class="h-full transition-panels" :style="{ width: splitRight }">
      <slot name="content"></slot>
    </div>
  </div>
</template>
<script>
import { defineComponent, onMounted } from "vue";
export default defineComponent({
  name: "ResizablePane",
  data() {
    return {
      gutter: 11,
      split: 18,
      dragging: false,
      startX: 0,
      startSplit: 0,
      totalWidth: 0,
    };
  },
  computed: {
    splitLeft: function () {
      return `calc(${this.split}% - ${this.gutter}px)`;
    },
    splitRight: function () {
      return `calc(${100 - this.split}% - ${this.gutter}px)`;
    },
  },
  methods: {
    dragStart(e) {
      this.dragging = true;
      this.startX = e.pageX;
      this.startSplit = this.split;
      this.totalWidth = this.$el.offsetWidth;
    },
    dragMove(e) {
      if (this.dragging) {
        const dx = e.pageX - this.startX;
        let newSplit = this.startSplit + ~~((dx / this.totalWidth) * 100);
        if (newSplit >= 17 && newSplit <= 23) this.split = newSplit;
      }
    },
    dragEnd() {
      this.dragging = false;
    },
  },
});
</script>
<style lang="sass">
.pannel-move
  cursor: col-resize
.transition-panels
  transition: all .07s ease
.is-dragging
  cursor: col-resize
</style>