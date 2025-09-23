<template>
  <img
    v-if="src"
    ref="img"
    class="`experimental-styles-within avatar"
    :style="`--_size: ${cssSize}`"
    :class="{
      circle: circle,
      'no-shadow': noShadow,
      raised: raised,
      pixelated: raised,
    }"
    :src="src"
    :alt="alt"
    :loading="loading"
    @load="updatePixelated"
  />
  <svg
    v-else
    class="`experimental-styles-within avatar"
    :style="`--_size: ${cssSize}${tint ? `;--_tint:oklch(50% 75% ${tint})` : ''}`"
    :class="{
      tint: tint,
      circle: circle,
      'no-shadow': noShadow,
      raised: raised,
    }"
    xml:space="preserve"
    viewBox="0 0 40 40"
    aria-hidden="true"
  >
    <g fill="#fff">
      <path
        d="m30.261 14.336c-3.047-2.188-5.823-3.402-9.667-5.082l-0.194-0.085c-0.255-0.111-0.546-0.111-0.801 0l-0.202 0.088c-3.839 1.679-6.614 2.892-9.659 5.079-0.038 0.027-0.073 0.057-0.106 0.089 3.19 2.211 6.246 3.558 10.369 5.36 4.121-1.801 7.178-3.148 10.367-5.36-0.033-0.032-0.069-0.062-0.106-0.089z"
      />
      <path
        d="m9 21.162c0 3.806 0.308 4.964 0.37 5.158 0.068 0.214 0.207 0.399 0.393 0.525 2.956 1.996 6.473 3.535 9.237 4.069v-9.385c-3.845-1.681-6.789-2.988-9.833-5.004-0.084 1.024-0.167 2.563-0.167 4.637z"
      />
      <path
        d="m30.833 16.525c-3.045 2.017-5.989 3.325-9.833 5.005v9.384c2.765-0.534 6.282-2.073 9.237-4.069 0.187-0.126 0.325-0.311 0.393-0.525 0.062-0.194 0.37-1.352 0.37-5.158 0-2.074-0.083-3.614-0.167-4.638z"
      />
    </g>
  </svg>
</template>

<script setup>
import { computed, ref } from 'vue'

const pixelated = ref(false)
const img = ref(null)

const props = defineProps({
  src: {
    type: String,
    default: null,
  },
  alt: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: '2rem',
  },
  circle: {
    type: Boolean,
    default: false,
  },
  noShadow: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: String,
    default: 'eager',
  },
  raised: {
    type: Boolean,
    default: false,
  },
  tintBy: {
    type: String,
    default: null,
  },
})

const LEGACY_PRESETS = {
  xxs: '1.25rem',
  xs: '2.5rem',
  sm: '3rem',
  md: '6rem',
  lg: '9rem',
}

const cssSize = computed(() => LEGACY_PRESETS[props.size] ?? props.size)

function updatePixelated() {
  if (img.value && img.value.naturalWidth && img.value.naturalWidth <= 96) {
    pixelated.value = true
  } else {
    pixelated.value = false
  }
}

const tint = computed(() => {
  if (props.tintBy) {
    return hash(props.tintBy) % 360
  } else {
    return null
  }
})

function hash(str) {
  let hash = 0
  for (let i = 0, len = str.length; i < len; i++) {
    const chr = str.charCodeAt(i)
    hash = (hash << 5) - hash + chr
    hash |= 0
  }
  return hash
}
</script>

<style lang="scss" scoped>
.avatar {
  @apply min-w-[--_size] min-h-[--_size] w-[--_size] h-[--_size];
  --_size: 2rem;

  border: 1px solid var(--color-button-border);
  background-color: var(--color-button-bg);
  object-fit: contain;
  border-radius: calc(16 / 96 * var(--_size));
  position: relative;

  &.circle {
    border-radius: 50%;
  }

  &:not(.no-shadow) {
    box-shadow: var(--shadow-card);
  }

  &.no-shadow {
    box-shadow: none;
  }

  &.pixelated {
    image-rendering: pixelated;
  }

  &.raised {
    background-color: var(--color-raised-bg);
  }

  &.tint {
    background-color: color-mix(in oklch, var(--color-button-bg) 100%, var(--_tint) 5%);
  }
}
</style>
