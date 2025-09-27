<template>
  <div class="ad-parent relative mb-3 flex w-full justify-center rounded-2xl bg-bg-raised">
    <div
      class="flex max-h-[250px] min-h-[250px] min-w-[300px] max-w-[300px] flex-col items-center gap-4 p-6"
    >
      <p class="m-0 text-2xl font-bold text-contrast">75% of ad revenue goes to creators</p>
      <img
        ref="adPlaceholder"
        class="h-36"
        style="display: none"
        src="@/assets/images/sad-expression.webp"
      />
    </div>
    <div
      class="absolute top-0 flex items-center justify-center overflow-hidden rounded-2xl bg-bg-raised"
    >
      <div id="icmods-rail-1">
        <ins
          ref="googleAd"
          class="adsbygoogle max-h-[250px] min-h-[250px] min-w-[300px] max-w-[300px]"
          style="display: inline-block"
          data-ad-client="ca-pub-7817840874175901"
          data-ad-slot="1913330664"
        />
      </div>
    </div>
  </div>
</template>
<script setup>
const googleAd = ref(null);
const googleAdLoaded = ref(false);
const yandexAdLoaded = ref(false);
const fallbackTimeout = ref(null);
const adPlaceholder = ref(null);

useHead({
  script: [
    {
      src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7817840874175901",
      crossorigin: "anonymous",
      async: true,
    },
    {
      src: "https://yandex.ru/ads/system/context.js",
      async: true,
    },
  ],
  link: [
    {
      rel: "preload",
      as: "script",
      href: "https://www.googletagservices.com/tag/js/gpt.js",
    },
  ],
});

const loadGoogleAd = () => {
  if (window.adsbygoogle && !googleAdLoaded.value) {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      googleAdLoaded.value = true;
    } catch (error) {
      loadYandexAd();
    }
  }
};

const loadYandexAd = () => {
  if (yandexAdLoaded.value) return;

  try {
    window.yaContextCb = window.yaContextCb || [];
    window.yaContextCb.push(() => {
      Ya.Context.AdvManager.render({
        blockId: "R-A-17355902-1",
        renderTo: "icmods-rail-1",
        onError: (_) => {
          clearTimeout(fallbackTimeout.value);
          showAdblockPlaceholder();
        },
        onRender: () => {
          clearTimeout(fallbackTimeout.value);
          yandexAdLoaded.value = true;
        },
      });
    });
  } catch (error) {
    clearTimeout(fallbackTimeout.value);
    showAdblockPlaceholder();
  }
};

const checkGoogleAdRendered = () => {
  if (!googleAd.value) return false;

  const hasContent = googleAd.value.innerHTML.trim().length > 0;
  const hasIframe = googleAd.value.querySelector("iframe");

  return hasContent || hasIframe;
};

const showAdblockPlaceholder = () => {
  if (adPlaceholder.value) {
    adPlaceholder.value.style.display = "";
  }
};

onMounted(() => {
  fallbackTimeout.value = setTimeout(() => {
    if (!googleAdLoaded.value && !checkGoogleAdRendered()) {
      loadYandexAd();
      fallbackTimeout.value = setTimeout(() => {
        if (!yandexAdLoaded.value) {
          showAdblockPlaceholder();
        }
      }, 3000);
    }
  }, 3000);

  if (window.adsbygoogle) {
    loadGoogleAd();
  } else {
    const googleScriptCheck = setInterval(() => {
      if (window.adsbygoogle) {
        clearInterval(googleScriptCheck);
        loadGoogleAd();
      }
    }, 100);

    setTimeout(() => {
      if (!googleAdLoaded.value) {
        clearInterval(googleScriptCheck);
        loadYandexAd();
      }
    }, 5000);
  }

  if (googleAd.value) {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "childList" && checkGoogleAdRendered()) {
          googleAdLoaded.value = true;
          clearTimeout(fallbackTimeout.value);
          observer.disconnect();
        }
      });
    });

    observer.observe(googleAd.value, {
      childList: true,
      subtree: true,
    });
  }
});

onUnmounted(() => {
  if (fallbackTimeout.value) {
    clearTimeout(fallbackTimeout.value);
  }
});
</script>
<style>
iframe[id^="google_ads_iframe"] {
  color-scheme: normal;
  background: transparent;
}

@media (max-width: 1024px) {
  .ad-parent {
    display: none;
  }
}
</style>
