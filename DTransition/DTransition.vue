<template>
    <transition :name="type" mode="out-in">
        <slot></slot>
    </transition>
</template>

<script>
export default {
    name: "DTransition",
    props: {
        type: {
            default: "fade"
        }
    }
}
</script>
<style>
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active em versões anteriores a 2.1.8 */ {
  opacity: 0;
}
</style>

