<template>
  <div
    class="new-page sidebar experimental-styles-within"
    :class="{ 'alt-layout': !cosmetics.rightSearchLayout }"
  >
    <Head>
      <Title>Search {{ projectType.display }}s - Inner Core Mods</Title>
    </Head>
    <Teleport v-if="flags.searchBackground" to="#absolute-background-teleport">
      <div class="search-background"></div>
    </Teleport>
    <aside
      :class="{
        'normal-page__sidebar': true,
      }"
      aria-label="Filters"
    >
      <AdPlaceholder
        v-if="!auth.user || !isPermission(auth.user.badges, 1 << 0) || flags.showAdsWithPlus"
      />
      <div v-if="filtersMenuOpen" class="fixed inset-0 z-40 bg-bg"></div>
      <div
        class="flex flex-col gap-3"
        :class="{
          'fixed inset-0 z-50 m-4 mb-0 overflow-auto rounded-t-3xl bg-bg-raised': filtersMenuOpen,
        }"
      >
        <div
          v-if="filtersMenuOpen"
          class="sticky top-0 z-10 mx-1 flex items-center justify-between gap-3 border-0 border-b-[1px] border-solid border-divider bg-bg-raised px-6 py-4"
        >
          <h3 class="m-0 text-lg text-contrast">Filters</h3>
          <ButtonStyled circular>
            <button
              @click="
                () => {
                  filtersMenuOpen = false;
                  scrollToTop('instant');
                }
              "
            >
              <XIcon />
            </button>
          </ButtonStyled>
        </div>
        <SearchSidebarFilter
          v-for="filter in filters.filter((f) => f.display !== 'none')"
          :key="`filter-${filter.id}`"
          v-model:selected-filters="currentFilters"
          v-model:toggled-groups="toggledGroups"
          v-model:overridden-provided-filter-types="overriddenProvidedFilterTypes"
          :provided-filters="providedFilters"
          :filter-type="filter"
          :class="
            filtersMenuOpen
              ? 'border-0 border-b-[1px] border-solid border-divider last:border-b-0'
              : 'rounded-2xl bg-bg-raised'
          "
          button-class="button-animation flex flex-col gap-1 px-6 py-4 w-full bg-transparent cursor-pointer border-none"
          content-class="mb-4 mx-3"
          inner-panel-class="p-1"
          :open-by-default="true"
        >
          <template #header>
            <h3 class="m-0 text-lg">{{ filter.formatted_name }}</h3>
          </template>
        </SearchSidebarFilter>
      </div>
    </aside>
    <section class="normal-page__content">
      <div class="flex flex-col gap-3">
        <div class="iconified-input w-full">
          <SearchIcon aria-hidden="true" class="text-lg" />
          <input
            v-model="query"
            class="h-12"
            autocomplete="off"
            spellcheck="false"
            type="text"
            :placeholder="`Search ${projectType.display}s...`"
            @input="updateSearchResults()"
          />
          <Button v-if="query" class="r-btn" @click="() => (query = '')">
            <XIcon />
          </Button>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <DropdownSelect
            v-slot="{ selected }"
            v-model="currentSortType"
            class="!w-auto flex-grow md:flex-grow-0"
            name="Sort by"
            :options="sortTypes"
            :display-name="(option) => option?.display"
            @change="updateSearchResults(1)"
          >
            <span class="font-semibold text-primary">Sort by: </span>
            <span class="font-semibold text-secondary">{{ selected }}</span>
          </DropdownSelect>
          <DropdownSelect
            v-slot="{ selected }"
            v-model="maxResults"
            name="Max results"
            :options="currentMaxResultsOptions"
            :default-value="maxResults"
            :model-value="maxResults"
            class="!w-auto flex-grow md:flex-grow-0"
            @change="updateSearchResults(1)"
          >
            <span class="font-semibold text-primary">View: </span>
            <span class="font-semibold text-secondary">{{ selected }}</span>
          </DropdownSelect>
          <div class="lg:hidden">
            <ButtonStyled>
              <button @click="filtersMenuOpen = true"><FilterIcon /> Filter results...</button>
            </ButtonStyled>
          </div>
          <ButtonStyled circular>
            <button
              v-tooltip="$capitalizeString(cosmetics.searchDisplayMode[projectType.id]) + ' view'"
              :aria-label="$capitalizeString(cosmetics.searchDisplayMode[projectType.id]) + ' view'"
              @click="cycleSearchDisplayMode()"
            >
              <GridIcon v-if="cosmetics.searchDisplayMode[projectType.id] === 'grid'" />
              <ImageIcon v-else-if="cosmetics.searchDisplayMode[projectType.id] === 'gallery'" />
              <ListIcon v-else />
            </button>
          </ButtonStyled>
          <Pagination
            :page="currentPage"
            :count="pageCount"
            class="mx-auto sm:ml-auto sm:mr-0"
            @switch-page="setPage"
          />
        </div>
        <SearchFilterControl
          v-model:selected-filters="currentFilters"
          :filters="filters.filter((f) => f.display !== 'none')"
          :provided-filters="providedFilters"
          :overridden-provided-filter-types="overriddenProvidedFilterTypes"
        />
        <LogoAnimated v-if="searchLoading && !noLoad" />
        <div v-else-if="results && results.hits && results.hits.length === 0" class="no-results">
          <p>No results found for your query!</p>
        </div>
        <div v-else class="search-results-container">
          <div
            id="search-results"
            class="project-list"
            :class="'display-mode--' + cosmetics.searchDisplayMode[projectType.id]"
            role="list"
            aria-label="Search results"
          >
            <template v-for="result in results?.hits" :key="result.project_id">
              <ProjectCard
                v-if="flags.oldProjectCards"
                :id="result.slug ? result.slug : result.project_id"
                :display="cosmetics.searchDisplayMode[projectType.id]"
                :featured-image="
                  result.featured_gallery ? result.featured_gallery : result.gallery[0]
                "
                :type="result.project_type"
                :author="result.author"
                :name="result.title"
                :description="result.description"
                :created-at="result.date_created"
                :updated-at="result.date_modified"
                :downloads="result.downloads.toString()"
                :follows="result.follows.toString()"
                :icon-url="result.icon_url"
                :client-side="result.client_side"
                :server-side="result.server_side"
                :categories="result.display_categories"
                :search="true"
                :show-updated-date="currentSortType.name !== 'newest'"
                :color="result.color"
              />
              <NuxtLink
                v-if="flags.newProjectCards"
                :to="`/${projectType.id}/${result.slug ? result.slug : result.project_id}`"
              >
                <NewProjectCard :project="result" :categories="result.display_categories">
                  <template v-if="false" #actions> </template>
                </NewProjectCard>
              </NuxtLink>
            </template>
          </div>
        </div>
        <div class="pagination-after">
          <pagination
            :page="currentPage"
            :count="pageCount"
            class="justify-end"
            @switch-page="setPage"
          />
        </div>
      </div>
    </section>
  </div>
</template>
<script setup>
import {
  Pagination,
  SearchSidebarFilter,
  useSearch,
  DropdownSelect,
  Button,
  ButtonStyled,
  NewProjectCard,
  SearchFilterControl,
} from "@icmods/ui";
import { XIcon } from "@icmods/assets";
import { computed } from "vue";
import ProjectCard from "~/components/ui/ProjectCard.vue";
import LogoAnimated from "~/components/brand/LogoAnimated.vue";

import SearchIcon from "~/assets/images/utils/search.svg?component";
import FilterIcon from "~/assets/images/utils/filter.svg?component";
import GridIcon from "~/assets/images/utils/grid.svg?component";
import ListIcon from "~/assets/images/utils/list.svg?component";
import ImageIcon from "~/assets/images/utils/image.svg?component";
import AdPlaceholder from "~/components/ui/AdPlaceholder.vue";
import NavTabs from "~/components/ui/NavTabs.vue";

const { formatMessage } = useVIntl();

const filtersMenuOpen = ref(false);

const data = useNuxtApp();
const route = useNativeRoute();
const router = useNativeRouter();

const cosmetics = useCosmetics();
const tags = useTags();
const flags = useFeatureFlags();
const auth = await useAuth();

const projectType = ref();
function setProjectType() {
  const projType = tags.value.projectTypes.find(
    (x) => x.id === route.path.replaceAll(/^\/|s\/?$/g, ""), // Removes prefix `/` and suffixes `s` and `s/`
  );

  if (projType) {
    projectType.value = projType;
  }
}
setProjectType();
router.afterEach(() => {
  setProjectType();
});

const projectTypes = computed(() => [projectType.value.id]);

// There should be predefined filters, but we doesn't have those
const providedFilters = computed(() => []);

const maxResultsForView = ref({
  list: [5, 10, 15, 20, 50, 100],
  grid: [6, 12, 18, 24, 48, 96],
  gallery: [6, 10, 16, 20, 50, 100],
});

const currentMaxResultsOptions = computed(
  () => maxResultsForView.value[cosmetics.value.searchDisplayMode[projectType.value.id]],
);

const {
  // Selections
  query,
  currentSortType,
  currentFilters,
  toggledGroups,
  maxResults,
  currentPage,
  overriddenProvidedFilterTypes,

  // Lists
  filters,
  sortTypes,

  // Computed
  requestParams,

  // Functions
  createPageParams,
} = useSearch(projectTypes, tags, providedFilters);

const noLoad = ref(false);
const {
  data: rawResults,
  refresh: refreshSearch,
  pending: searchLoading,
} = useLazyFetch(
  () => {
    const config = useRuntimeConfig();
    const base = import.meta.server ? config.apiBaseUrl : config.public.apiBaseUrl;

    return `${base}search${requestParams.value}`;
  },
  {
    transform: (hits) => {
      noLoad.value = false;
      return hits;
    },
  },
);

const results = shallowRef(toRaw(rawResults));
const pageCount = computed(() =>
  results.value ? Math.ceil(results.value.total_hits / results.value.limit) : 1,
);

function setPage(newPageNumber) {
  currentPage.value = newPageNumber;

  window.scrollTo({ top: 0, behavior: "smooth" });

  updateSearchResults();
}

function scrollToTop(behavior = "smooth") {
  window.scrollTo({ top: 0, behavior });
}

function updateSearchResults() {
  noLoad.value = true;

  if (query.value === null) {
    return;
  }

  refreshSearch();

  if (import.meta.client) {
    router.replace({ path: route.path, query: createPageParams() });
  }
}

watch([currentFilters, requestParams], () => {
  updateSearchResults();
});

function cycleSearchDisplayMode() {
  cosmetics.value.searchDisplayMode[projectType.value.id] = data.$cycleValue(
    cosmetics.value.searchDisplayMode[projectType.value.id],
    tags.value.projectViewModes,
  );
  setClosestMaxResults();
}

function setClosestMaxResults() {
  const view = cosmetics.value.searchDisplayMode[projectType.value.id];
  const maxResultsOptions = maxResultsForView.value[view] ?? [20];
  const currentMax = maxResults.value;
  if (!maxResultsOptions.includes(currentMax)) {
    maxResults.value = maxResultsOptions.reduce(function (prev, curr) {
      return Math.abs(curr - currentMax) <= Math.abs(prev - currentMax) ? curr : prev;
    });
  }
}

const ogTitle = computed(
  () => `Search ${projectType.value.display}s${query.value ? " | " + query.value : ""}`,
);
const description = computed(
  () =>
    `Search and browse hundreds of Inner Core ${projectType.value.display}s on Inner Core Mods with instant, accurate search results. Our filters help you quickly find the best Inner Core ${projectType.value.display}s.`,
);

useSeoMeta({
  description,
  ogTitle,
  ogDescription: description,
});
</script>

<style lang="scss" scoped>
.normal-page__content {
  // Passthrough children as grid items on mobile
  display: contents;

  @media screen and (min-width: 1024px) {
    display: block;
  }
}

// Move the filters "sidebar" on mobile underneath the search card
.normal-page__sidebar {
  grid-row: 3;

  // Always show on desktop
  @media screen and (min-width: 1024px) {
    display: block;
  }
}

.filters-card {
  padding: var(--spacing-card-md);

  @media screen and (min-width: 1024px) {
    padding: var(--spacing-card-lg);
  }
}

.sidebar-menu {
  display: none;
}

.sidebar-menu_open {
  display: block;
}

.sidebar-menu-heading {
  margin: 1.5rem 0 0.5rem 0;
}

// EthicalAds
.content-wrapper {
  grid-row: 1;
}

.search-controls {
  display: flex;
  flex-direction: row;
  gap: var(--spacing-card-md);
  flex-wrap: wrap;
  padding: var(--spacing-card-md);
  grid-row: 2;

  .search-filter-container {
    display: flex;
    width: 100%;
    align-items: center;

    .sidebar-menu-close-button {
      max-height: none;
      // match height of the search field
      height: 40px;
      transition: box-shadow 0.1s ease-in-out;
      margin-right: var(--spacing-card-md);

      &.open {
        color: var(--color-button-text-active);
        background-color: var(--color-brand-highlight);
        box-shadow:
          inset 0 0 0 transparent,
          0 0 0 2px var(--color-brand);
      }
    }

    .iconified-input {
      flex: 1;

      input {
        width: 100%;
        margin: 0;
      }
    }
  }

  .sort-controls {
    width: 100%;
    display: flex;
    flex-direction: row;
    gap: var(--spacing-card-md);
    flex-wrap: wrap;
    align-items: center;

    .labeled-control {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.5rem;

      .labeled-control__label {
        white-space: nowrap;
      }
    }

    .square-button {
      margin-top: auto;
      // match height of search dropdowns
      height: 40px;
      width: 40px; // make it square!
    }
  }
}

.search-controls__sorting {
  min-width: 14rem;
}

.labeled-control__label,
.labeled-control__control {
  display: block;
}

.pagination-before {
  grid-row: 4;
}

.search-results-container {
  grid-row: 5;
}

.pagination-after {
  grid-row: 6;
}

.no-results {
  text-align: center;
  display: flow-root;
}

.loading-logo {
  margin: 2rem;
}

#search-results {
  min-height: 20vh;
}

@media screen and (min-width: 750px) {
  .search-controls {
    flex-wrap: nowrap;
    flex-direction: row;
  }

  .sort-controls {
    min-width: fit-content;
    max-width: fit-content;
    flex-wrap: nowrap;
  }

  .labeled-control {
    align-items: center;
    display: flex;
    flex-direction: column !important;
    flex-wrap: wrap;
    gap: 0.5rem;
    max-width: fit-content;
  }

  .labeled-control__label {
    flex-shrink: 0;
    margin-bottom: 0 !important;
  }
}

@media screen and (min-width: 860px) {
  .labeled-control {
    flex-wrap: nowrap !important;
    flex-direction: row !important;
  }
}

@media screen and (min-width: 1024px) {
  .sidebar-menu {
    display: block;
    margin-top: 0;
  }

  .sidebar-menu-close-button {
    display: none;
  }

  .labeled-control {
    flex-wrap: wrap !important;
    flex-direction: column !important;
  }
}

@media screen and (min-width: 1100px) {
  .labeled-control {
    flex-wrap: nowrap !important;
    flex-direction: row !important;
  }
}

.search-background {
  width: 100%;
  height: 20rem;
  background-image: url("https://minecraft.wiki/images/The_Garden_Awakens_Key_Art_No_Creaking.jpg?9968c");
  background-size: cover;
  background-position: center;
  pointer-events: none;
  mask-image: linear-gradient(to bottom, black, transparent);
  opacity: 0.25;
}

.stylized-toggle:checked::after {
  background: var(--color-accent-contrast) !important;
}
</style>
