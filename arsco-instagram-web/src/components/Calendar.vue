<template>
  <v-date-picker :mode='mode' show-caps v-model='selectDate' is-inline popover-visibility="'hidden'" @input="select()"></v-date-picker>
</template>

<script>
export default {
    props: ['item'],
    data: function () {
        return {
            mode: 'range',
            selectDate: null
        }
    },
    methods: {
        select: function () {
            this.$root.$children[0].filterObject.push({
                type: 'date',
                startDate: this.selectDate.start.getTime(),
                endDate: new _Date(this.selectDate.end.getTime()).end().done().getTime(),
                periodType: 'custom'
            })
            vm.menus.date.map['custom'].checked = false;
        }
    }
}
</script>