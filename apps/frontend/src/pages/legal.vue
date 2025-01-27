<template>
  <div class="normal-page">
    <div class="normal-page__sidebar">
      <aside class="universal-card">
        <h1>Legal</h1>
        <NavStack>
          <NavStackItem link="/legal/rules" label="Content Rules">
            <ScaleIcon aria-hidden="true" />
          </NavStackItem>
          <NavStackItem link="/legal/copyright" label="Copyright Policy">
            <CopyrightIcon aria-hidden="true" />
          </NavStackItem>
          <NavStackItem link="/legal/security" label="Security Notice">
            <ShieldIcon aria-hidden="true" />
          </NavStackItem>
        </NavStack>
      </aside>
    </div>
    <div class="normal-page__content">
      <NuxtPage class="universal-card" :route="route" />
    </div>
  </div>
</template>

<script setup>
import {
  ScaleIcon,
  ShieldIcon,
  CopyrightIcon,
} from "@modrinth/assets";
import NavStack from "~/components/ui/NavStack.vue";
import NavStackItem from "~/components/ui/NavStackItem.vue";

const route = useNativeRoute();
</script>

<style lang="scss" scoped>
.normal-page__content :deep(a) {
  color: var(--color-link);
  text-decoration: underline;

  &:focus-visible,
  &:hover {
    color: var(--color-link-hover);
  }

  &:active {
    color: var(--color-link-active);
  }
}
</style>
