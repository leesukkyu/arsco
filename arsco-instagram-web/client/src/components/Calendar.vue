<template>
  <v-date-picker :mode='mode' show-caps v-model='selectDate' is-inline  @input="select()"></v-date-picker>
</template>

<script>
import { _Date } from '../../public/js/common.js';
export default {
    props: ['item'],
    data: function () {
        return {
            mode: 'range',
            selectDate: null
        }
    },
    beforeCreate() {
    },
    created() {
    },
    beforeMount() {
    },
    mounted() {
    },
    beforeUpdate() {
    },
    updated() {
    },
    beforeDestroy() {
    },
    destroyed() {
    },
    methods: {
        select: function () {
            this.$root.$children[0].filterObject.push({
                type: 'date',
                startDate: this.selectDate.start.getTime(),
                endDate: new _Date(this.selectDate.end.getTime()).end().done().getTime(),
                periodType: 'custom'
            })
            this.$parent.$parent.menus.date.map['custom'].checked = false;
        }
    }
}
</script>