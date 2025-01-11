<script lang="ts" setup>
import { ref } from 'vue'

const props = withDefaults(defineProps<{
  default: string
  tabClasses?: string
  contentClasses?: string
  tabs: string[]
}>(), {
  tabClasses: '',
  contentClasses: '',
})

const emit = defineEmits<{
  select: [tab: string]
}>()

const active = ref(props.default)

function select(newTab: string) {
  active.value = newTab
  emit('select', newTab)
}
</script>

<template>
  <div class="ducktory-tab-container">
    <div :class="contentClasses">
      <template
        v-for="tab in tabs"
        :key="tab"
      >
        <div v-show="tab === active">
          <slot :name="'tab-' + tab" />
        </div>
      </template>
    </div>
    <div :class="tabClasses">
      <slot
        :active="active"
        :select="select"
        name="tabs"
      />
    </div>
  </div>
</template>
