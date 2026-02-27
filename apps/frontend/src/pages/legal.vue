<template>
  <div class="normal-page">
    <div class="normal-page__sidebar">
      <aside class="universal-card">
        <h1>Legal</h1>
        <NavStack>
          <NavStackItem link="/legal/terms" label="Terms of Use">
            <HeartHandshakeIcon aria-hidden="true" />
          </NavStackItem>
          <NavStackItem link="/legal/rules" label="Content Rules">
            <ScaleIcon aria-hidden="true" />
          </NavStackItem>
          <h3>Privacy</h3>
          <NavStackItem link="/legal/privacy" label="Privacy Policy">
            <LockIcon aria-hidden="true" />
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
import { ScaleIcon, HeartHandshakeIcon, LockIcon } from "@icmods/assets";
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
