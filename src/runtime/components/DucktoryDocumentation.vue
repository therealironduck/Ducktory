<script setup lang="ts">
import { useSlots, inject } from 'vue'
import type { CustomVNode } from '../../types/VNodeMagic'
import type { Ref } from '#imports'

defineSlots<{ default?: () => CustomVNode[] }>()
const slots = useSlots()

const documentation = inject<Ref<CustomVNode[] | undefined>>('ducktory-documentation')
if (!documentation) {
  throw new Error('The `DucktoryDocumentation` component can only be used within a story.')
}

documentation.value = slots.default?.()
</script>

<template>
  <span />
</template>
