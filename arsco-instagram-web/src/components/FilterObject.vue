<template>
  <div class="filter-object" :class="classObject()">
    <span v-if="item.type == 'tag'">
      {{item.tagName}}
      <span @click="delFilterObject()" class="filter-object-del-btn">X</span>
    </span>
    <span v-else-if="item.type == 'customTag'">
      {{item.tagName}}
      <span @click="delFilterObject()" class="filter-object-del-btn">X</span>
    </span>
    <span v-else-if="item.type == 'date'">
      {{new Date(item.startDate).format('yyyy.MM.dd')}} ~ {{new Date(item.endDate).format('yyyy.MM.dd')}}
      <span @click="delFilterObject()" class="filter-object-del-btn">X</span>
    </span>
  </div>
</template>

<script>
export default {
  props: ["item", "index"],
  data: function() {
    return {};
  },
  methods: {
    delFilterObject: function() {
      let type, periodType;
      type = this.$parent.filterObject[this.index].type;
      if (type == "tag" || type == "customTag") {
        this.item.node.checked = false;
      } else if (type == "date") {
        periodType = this.$parent.filterObject[this.index].periodType;
        if (periodType == "week" || periodType == "month") {
          this.item.node.checked = false;
        }
      }
      this.$parent.filterObject.splice(this.index, 1);
      this.$nextTick(function() {
        window.lazy();
      });
    },
    classObject: function() {
      if (this.item.type == "tag") {
        return {
          tag: true
        };
      } else if (this.item.type == "customTag") {
        return {
          customTag: true
        };
      } else if (this.item.type == "date") {
        return {
          date: true
        };
      } else {
        return {
          other: true
        };
      }
    }
  }
};
</script>
