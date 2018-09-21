<template>
    <div :value="value" @click="selected"  >
        <slot></slot>
    </div>
</template>
<script>
export default {
    name: "DOption",
    props : [ 'value' ],

    methods : {
        selected() {
            this.$emit('selected');
        }
    }

}
</script>

