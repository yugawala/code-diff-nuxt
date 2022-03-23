<template lang="pug">
div
  DiffLines(
    prefix4Load="sample-program/views/",
    name="index.html",
    display-name="views/index.html",
    beforeV="1",
    afterV="2",
  )
</template>

<script>
import Vue from "vue";
// @ts-ignore
import DiffLines from "~/components/DiffLines.vue";

export default Vue.extend({
  name: "IndexPage",
  components: {
    DiffLines,
  },
});
</script>
