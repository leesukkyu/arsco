<template>
  <li v-if="node.childList" class="custom-filter-li hasChild">
    <div class="category-title">
      <input
        @click="setAllChildFilter()"
        v-model="node.checked"
        class="magic-checkbox"
        type="checkbox"
        :id="'custom_filter_id_' + id"
      />
      <label :for="'custom_filter_id_' + id"></label>
      <label class="magic-checkbox-text" :for="'custom_filter_id_' + id">{{node.name}}</label>
      <div class="magic-checkbox-wrap union">
        <input
          @click="setAllChildFilter_union()"
          v-model="node.checked_union"
          class="magic-checkbox"
          type="checkbox"
          :id="'custom_filter_union_id_' + id"
        />
        <label :for="'custom_filter_union_id_' + id"></label>
        <label
          style="margin-right:5px;"
          class="magic-checkbox-text"
          :for="'custom_filter_union_id_' + id"
        >∪</label>
      </div>
    </div>
    <ul class="custom-filter-ul">
      <custom-filter-list-node v-for="(node, index) in node.childList" :key="index" :node="node"></custom-filter-list-node>
    </ul>
  </li>
  <li v-else class="custom-filter-li">
    <div class="magic-checkbox-wrap">
      <input
        @click="setFilter()"
        v-model="node.checked"
        class="magic-checkbox"
        type="checkbox"
        :id="'custom_filter_id_' + id"
      />
      <label :for="'custom_filter_id_' + id"></label>
      <label class="magic-checkbox-text" :for="'custom_filter_id_' + id">{{node.name}}</label>
      <div class="color-tag-thumbnail-wrap" v-if="node.thumbnail">
        <img class="color-tag-thumbnail" :src="'/images/' + node.thumbnail" />
      </div>
    </div>
    <div class="magic-checkbox-wrap union">
      <input
        @click="setFilter_union()"
        v-model="node.checked_union"
        class="magic-checkbox"
        type="checkbox"
        :id="'custom_filter_union_id_' + id"
      />
      <label :for="'custom_filter_union_id_' + id"></label>
      <label
        style="margin-right:5px;"
        class="magic-checkbox-text"
        :for="'custom_filter_union_id_' + id"
      >∪</label>
    </div>
  </li>
</template>

<script>
export default {
  name: "custom-filter-list-node",
  props: ["node"],
  created() {
    this.id = this._uid;
  },
  data() {
    return {
      id: null
    };
  },
  methods: {
    setFilter: function() {
      console.log("click");
      this.$root.$children[0].setFilter(this.node, "customTags");
    },
    setAllChildFilter: function() {
      let node;
      if (!event.target.checked) {
        console.log("자식 전체 선택 해제");
        this.$root.$children[0].setFilter(this.node, "customTags");
        this.$root.$children[0].TraversalChildNode(
          this.node.childList,
          function(node, i, parentNode) {
            this.$root.$children[0].setFilter(node[i], "customTags", false);
          }.bind(this)
        );
      } else {
        console.log("자식 전체 선택");
        this.$root.$children[0].setFilter(this.node, "customTags");
        this.$root.$children[0].TraversalChildNode(
          this.node.childList,
          function(node, i, parentNode) {
            this.$root.$children[0].setFilter(node[i], "customTags", true);
          }.bind(this)
        );
      }
    },
    setFilter_union: function() {
      this.$root.$children[0].setFilter_union(this.node, "customTags");
    },
    setAllChildFilter_union: function() {
      let node;
      if (!event.target.checked) {
        console.log("자식 전체 선택 해제");
        this.$root.$children[0].setFilter_union(this.node, "customTags");
        this.$root.$children[0].TraversalChildNode(
          this.node.childList,
          function(node, i, parentNode) {
            this.$root.$children[0].setFilter_union(node[i], "customTags", false);
          }.bind(this)
        );
      } else {
        console.log("자식 전체 선택");
        this.$root.$children[0].setFilter_union(this.node, "customTags");
        this.$root.$children[0].TraversalChildNode(
          this.node.childList,
          function(node, i, parentNode) {
            this.$root.$children[0].setFilter_union(node[i], "customTags", true);
          }.bind(this)
        );
      }
    }
  }
};
</script>

<style>
/* 합집합을 위한 추가 스타일 */
.magic-checkbox-wrap {
  min-width: 110px;
}
.magic-checkbox-wrap.union {
  margin-left: 10px;
}
.magic-checkbox-wrap.union .magic-checkbox + label:after {
  content: "U";
  border: NONE;
  transform: rotate(0deg);
  color: #fff;
  font-weight: bold;
  font-size: 13px;
  left: 0px;
  top: 0px;
  width: 19px;
  height: 19px;
  line-height: 18px;
  text-align: center;
}
.magic-checkbox-wrap.union .magic-checkbox:checked + label:before {
  border: #e91e63;
  background: #e91e63;
}
.color-tag-thumbnail {
  margin-left: 5px;
}
</style>