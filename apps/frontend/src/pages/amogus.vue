<script setup lang="ts">
const vintl = useVIntl();
const { formatMessage } = vintl;

const messages = defineMessages({
  amogusTitle: {
    id: "amogus.title",
    defaultMessage: "Amogus",
  },
  amogusDescription: {
    id: "amogus",
    defaultMessage: "Amogus is our Lord and saviour.",
  },
  amogusAltText: {
    id: "amogus.altText",
    defaultMessage: "sus",
  },
  amogusSinceOpened: {
    id: "amogus.sinceOpened",
    defaultMessage: "This page was opened {ago}",
  },
  amogusSeenPeople: {
    id: "amogus.amogusgedPeople",
    defaultMessage:
      "{count, plural, one {{count} more person} other {{count} more people}} were also seen Amogus!",
  },
});

const formatCompactNumber = useCompactNumber();

const formatRelativeTime = useRelativeTime();

const pageOpen = useState("amogusPageOpen", () => Date.now());
const peopleSeen = useState("amogusPeopleSeen", () => Math.round(Math.random() * 100_000));
const peopleSeenCount = computed(() => formatCompactNumber(peopleSeen.value));

let interval: ReturnType<typeof setTimeout>;

const formattedOpenedCounter = ref(formatRelativeTime(Date.now()));

onMounted(() => {
  interval = setInterval(() => {
    formattedOpenedCounter.value = formatRelativeTime(pageOpen.value);
  }, 1000);
});

onUnmounted(() => clearInterval(interval));
</script>

<template>
  <div class="card">
    <h1>{{ formatMessage(messages.amogusTitle) }}</h1>
    <p>{{ formatMessage(messages.amogusDescription) }}</p>
    <img
      src="http://localhost:3000/_nuxt/assets/images/amogus.png"
      :alt="formatMessage(messages.amogusAltText)"
    />
    <p>{{ formatMessage(messages.amogusSinceOpened, { ago: formattedOpenedCounter }) }}</p>
    <p>{{ formatMessage(messages.amogusSeenPeople, { count: peopleSeenCount }) }}</p>
  </div>
</template>

<style lang="scss" scoped>
.card {
  width: calc(100% - 2 * var(--spacing-card-md));
  max-width: 1280px;
  margin-inline: auto;
  text-align: center;
  box-sizing: border-box;
  margin-block: var(--spacing-card-md);
}

img {
  margin-block: 0 1.5rem;
  width: 60%;
  max-width: 40rem;
}
</style>
