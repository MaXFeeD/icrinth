<template>
  <div>
    <section id="messages" class="universal-card">
      <h2>Comments</h2>
      <p>
        All messages here are public and visible to every Inner Core Mods user, access to your
        account may be restricted for violating
        <nuxt-link to="/legal/rules" class="text-link" target="_blank">content rules</nuxt-link>.
        Remember also that comments are not place for bug reports, you can submit them via Issues
        project link or contact author via social media.
      </p>
      <!-- Kept heading buttons in case user wanted to write on why this mod is worth downloading -->
      <ConversationThread
        v-if="thread"
        :thread="thread"
        :project="project"
        :commentary="true"
        :current-member="currentMember"
        :media-buttons="false"
        :auth="auth"
        @update-thread="(newThread) => (thread = newThread)"
      />
    </section>
  </div>
</template>
<script setup>
import ConversationThread from "~/components/ui/thread/ConversationThread.vue";

const props = defineProps({
  project: {
    type: Object,
    default() {
      return {};
    },
  },
  currentMember: {
    type: Object,
    default() {
      return null;
    },
  },
  resetProject: {
    type: Function,
    required: true,
    default: () => {},
  },
});

const auth = await useAuth();

const { data: thread } = await useAsyncData(`thread/${props.project.comment_thread_id}`, () =>
  useBaseFetch(`thread/${props.project.comment_thread_id}`),
);
</script>
<style lang="scss" scoped>
.stacked {
  display: flex;
  flex-direction: column;
}

.status-message {
  :deep(.badge) {
    display: contents;

    svg {
      vertical-align: top;
      margin: 0;
    }
  }

  p:last-child {
    margin-bottom: 0;
  }
}

.unavailable-error {
  .code {
    margin-top: var(--spacing-card-sm);
  }

  svg {
    vertical-align: top;
  }
}
</style>
