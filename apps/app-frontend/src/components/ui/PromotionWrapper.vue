<script setup>
import { ref, onMounted } from 'vue'
import { init_ads_window } from '@/helpers/ads.js'

const adsWrapper = ref(null)

let devicePixelRatioWatcher = null

function initDevicePixelRatioWatcher() {
  if (devicePixelRatioWatcher) {
    devicePixelRatioWatcher.removeEventListener('change', updateAdPosition)
  }

  devicePixelRatioWatcher = window.matchMedia(`(resolution: ${window.devicePixelRatio}dppx)`)
  devicePixelRatioWatcher.addEventListener('change', updateAdPosition)
}

onMounted(() => {
  updateAdPosition()

  window.addEventListener('resize', updateAdPosition)
  initDevicePixelRatioWatcher()
})

function updateAdPosition() {
  if (adsWrapper.value) {
    init_ads_window()
    initDevicePixelRatioWatcher()
  }
}
</script>

<template>
  <div ref="adsWrapper" class="ad-parent relative flex w-full justify-center cursor-pointer bg-bg">
    <div class="flex max-h-[150px] min-h-[150px] min-w-[260px] max-w-[260px] flex-col gap-4 p-6">
      <p class="m-0 text-2xl font-bold text-contrast">мы пиздим ваши деньги за рекламу</p>
    </div>
  </div>
</template>
