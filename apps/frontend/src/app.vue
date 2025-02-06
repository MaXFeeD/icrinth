<template>
  <NuxtLayout>
    <IcmodsLoadingIndicator />
    <Notifications />
    <NuxtPage />
  </NuxtLayout>
</template>
<script setup lang="ts">
import IcmodsLoadingIndicator from "~/components/ui/icmods-loading-indicator";
import Notifications from "~/components/ui/Notifications.vue";
</script>
