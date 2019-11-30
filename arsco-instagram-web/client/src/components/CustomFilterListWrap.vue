<template>
  <div>
    <div class="custom-filter-ul-box">
      <ul class="custom-filter-ul root clearfix">
        <custom-filter-list-node v-for="(node, index) in this.menu.list" :node="node" :key="index"></custom-filter-list-node>
      </ul>
    </div>
  </div>
</template>

<script>
import CustomFilterListNode from "./CustomFilterListNode.vue";

export default {
  components: {
    'custom-filter-list-node' : CustomFilterListNode
  },
  props: ["menu"],
  beforeMount() {},
  mounted() {},
  data: function() {
    return {};
  }
};
</script>
