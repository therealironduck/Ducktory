<script setup lang="ts">
const props = withDefaults(defineProps<{
    default: string,
    tabClasses?: string,
    contentClasses?: string
}>(), {
    tabClasses: '',
    contentClasses: ''
});

const tab = ref(props.default);

function select(newTab: string) {
    tab.value = newTab;
}
</script>

<template>
    <div class="ducktory-tab-container">
        <div :class="contentClasses">
            <slot :name="'tab-' + tab"></slot>
        </div>
        <div :class="tabClasses">
            <slot name="tabs" :select="select" :active="tab"></slot>
        </div>
    </div>
</template>