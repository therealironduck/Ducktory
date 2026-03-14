<script lang="ts" setup>
defineProps<{
  label: string
  href?: string
}>()
</script>

<template>
  <component
    :is="href ? 'a' : 'button'"
    :href="href"
    :target="href ? '_blank' : undefined"
    :rel="href ? 'noopener noreferrer' : undefined"
    :type="href ? undefined : 'button'"
    class="ducktory:flex ducktory:flex-col ducktory:items-center ducktory:justify-center ducktory:gap-2 ducktory:w-32 ducktory:h-32 ducktory:border-2 ducktory:border-secondary/30 ducktory:rounded-2xl ducktory:text-secondary ducktory:hover:border-secondary ducktory:hover:bg-secondary/5 ducktory:transition-all ducktory:cursor-pointer"
  >
    <slot />
    <span class="ducktory:text-sm ducktory:font-medium">{{ label }}</span>
  </component>
</template>
