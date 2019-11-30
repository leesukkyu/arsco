<template>
  <v-date-picker :mode='mode' show-caps v-model='selectDate' is-inline  @input="select()"></v-date-picker>
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
    beforeCreate() {
        console.log('beforeCreate');
    },
    created() {
      console.log('created');  
    },
    beforeMount() {
        console.log('beforeMount');
    },
    mounted() {
        console.log('mounted');
    },
    beforeUpdate() {
        console.log('beforeUpdate');
    },
    updated() {
        console.log('updated');
    },
    beforeDestroy() {
        console.log('beforeDestroy');
    },
    destroyed() {
       console.log('destroyed'); 
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