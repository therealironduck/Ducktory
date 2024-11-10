<script lang="ts" setup>
import { ref } from 'vue'

const props = withDefaults(defineProps<{
  default: string
  tabClasses?: string
  contentClasses?: string
}>(), {
  tabClasses: '',
  contentClasses: '',
})

const emit = defineEmits<{
  select: [tab: string]
}>()

const tab = ref(props.default)

function select(newTab: string) {
  tab.value = newTab
  emit('select', newTab)
}
</script>

<template>
  <div class="ducktory-tab-container">
    <div :class="contentClasses">
      <slot :name="'tab-' + tab" />
    </div>
    <div :class="tabClasses">
      <slot
        :active="tab"
        :select="select"
        name="tabs"
      />
    </div>
  </div>
</template>
