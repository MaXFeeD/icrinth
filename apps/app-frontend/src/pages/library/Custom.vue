<script setup>
import GridDisplay from '@/components/GridDisplay.vue'

defineProps({
  instances: {
    type: Array,
    required: true,
  },
})
</script>
<template>
  <GridDisplay
    v-if="instances.length > 0"
    label="Modpacks"
    :instances="instances.filter((i) => i.install_stage !== 'archived' && !i.linked_data)"
  />
</template>
