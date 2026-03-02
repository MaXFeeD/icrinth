<template>
  <div>
    <div class="landing-hero">
      <IcmodsIcon class="icmods-icon" />
      <h1 class="main-header">
        Your pocket launcher with
        <div class="animate-strong">
          <span>
            <strong v-for="category in categories" class="main-header-strong">
              {{ category }}
              <br />
            </strong>
            <strong class="main-header-strong">{{ categories[0] }}</strong>
          </span>
        </div>
      </h1>
      <h2>
        Discover, share and just have fun with your favourite modifications and something brand new.
      </h2>
      <div class="button-group">
        <ButtonStyled color="brand" size="large">
          <nuxt-link to="/mods"> <CompassIcon aria-hidden="true" /> Discover mods </nuxt-link>
        </ButtonStyled>
        <ButtonStyled size="large" type="outlined">
          <nuxt-link v-if="!auth.user" to="/auth/sign-up" rel="noopener nofollow">
            <LogInIcon aria-hidden="true" />
            Sign up
          </nuxt-link>
          <nuxt-link v-else to="/dashboard/projects">
            <DashboardIcon aria-hidden="true" />
            Go to dashboard
          </nuxt-link>
        </ButtonStyled>
      </div>
    </div>
    <div class="users-section-outer">
      <div class="projects-showcase">
        <div v-for="(row, index) in rows" :key="index" class="row">
          <div v-for="n in 2" :key="n" class="row__content" :class="{ offset: index % 2 }">
            <nuxt-link
              v-for="project in row"
              :key="project.id"
              class="project button-animation"
              :to="`/${project.project_type}/${project.slug ? project.slug : project.id}`"
            >
              <Avatar :src="project.icon_url" :alt="project.title" size="sm" loading="lazy" />
              <div class="project-info">
                <span class="title">
                  {{ project.title }}
                </span>
                <span class="description">
                  {{ project.description }}
                </span>
              </div>
            </nuxt-link>
          </div>
        </div>
      </div>
      <div class="projects-transition" />
      <div class="users-section">
        <div class="section-header" />

        <div class="reveal-section" ref="sectionRef">
          <div class="sticky-viewport">
            <div class="presentation-container">
              <div class="info-block">
                <div
                  v-for="(slide, index) in slides"
                  :key="'text-' + index"
                  class="text-group"
                  :class="{ active: activeSlideIndex === index }"
                >
                  <h2 class="main-header" v-html="slide.title"></h2>
                  <p>{{ slide.desc }}</p>

                  <div class="slide-features" v-if="slide.features">
                    <div
                      class="slide-feature"
                      v-for="(feature, fIndex) in slide.features"
                      :key="'feat-' + fIndex"
                    >
                      <div class="feature-icon">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12"></polyline>
                        </svg>
                      </div>
                      <span>{{ feature }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="image-showcase">
                <div
                  v-for="(slide, index) in slides"
                  :key="'img-' + index"
                  class="img-wrapper"
                  :style="{ zIndex: index + 1, clipPath: getClipPath(index) }"
                >
                  <img
                    :src="slide.img"
                    :alt="slide.title"
                    :style="{ transform: getTransform(index) }"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="creator-section">
        <div class="section-header">
          <h2 class="section-tagline">Evolving through the years</h2>
          <p class="section-description">
            Our Horizon launcher and Inner Core engine have been evolving for years, providing
            players and modders with powerful built-in framework functionality.
          </p>
        </div>

        <div class="features-tabs-section">
          <div class="tabs-nav">
            <button :class="{ active: showcaseTab === 'user' }" @click="showcaseTab = 'user'">
              For Players
            </button>
            <button
              :class="{ active: showcaseTab === 'developer', 'developer-tab': true }"
              @click="showcaseTab = 'developer'"
            >
              For Developers
            </button>
          </div>

          <div class="tabs-content">
            <div class="timeline-era">
              <div class="era-aside">
                <div class="era-icon-wrapper gradient-border">
                  <HorizonIcon />
                </div>
                <div class="era-line"></div>
              </div>
              <div class="era-content">
                <div v-if="showcaseTab === 'user'" class="tab-pane">
                  <div class="feature-item">
                    <CalendarIcon /><span
                      >Play multiplayer with friends where all mods, complex factories, and
                      inventories are synchronized</span
                    >
                  </div>
                  <div class="feature-item">
                    <CalendarIcon /><span
                      >Install and switch between dozens of unique modpacks with separate worlds and
                      saves</span
                    >
                  </div>
                  <div class="feature-item">
                    <CalendarIcon /><span
                      >Heavyweight mods running at the game's core level to alter built-in
                      mechanics</span
                    >
                  </div>
                  <div class="feature-item">
                    <CalendarIcon /><span
                      >Seamless mod integration with modern vanilla including addons, resource packs
                      and worlds</span
                    >
                  </div>
                  <div class="feature-item">
                    <CalendarIcon /><span
                      >Massive expansion of capabilities, from custom hand models to flexible
                      animation handling</span
                    >
                  </div>
                </div>
                <div v-else class="tab-pane">
                  <div class="feature-item">
                    <CalendarIcon /><span
                      >Multiplayer implementation with an extensive synchronization API and
                      dedicated Zote Core servers</span
                    >
                  </div>
                  <div class="feature-item">
                    <CalendarIcon /><span
                      >Integration with the Horizon platform, modpack bundling, and dedicated
                      settings support</span
                    >
                  </div>
                  <div class="feature-item">
                    <CalendarIcon /><span
                      >Support for native C/C++ and Java modifications granting direct access to
                      game engine classes</span
                    >
                  </div>
                  <div class="feature-item">
                    <CalendarIcon /><span
                      >Flexible Data-Driven system to combine mods with addons and resource
                      packs</span
                    >
                  </div>
                  <div class="feature-item">
                    <CalendarIcon /><span
                      >Player management, item models, enchantments creation, and many
                      <nuxt-link
                        class="text-link"
                        to="https://docs.inner-core.org/changelog"
                        target="_blank"
                        >other new APIs</nuxt-link
                      >
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div class="timeline-era">
              <div class="era-aside">
                <div class="era-icon-wrapper gradient-border">
                  <InnerCoreIcon />
                </div>
                <div class="era-line"></div>
              </div>
              <div class="era-content">
                <div v-if="showcaseTab === 'user'" class="tab-pane">
                  <div class="feature-item">
                    <CalendarIcon /><span
                      >Built-in mod browser to search, download, and auto-update mods directly
                      inside the game</span
                    >
                  </div>
                  <div class="feature-item">
                    <CalendarIcon /><span
                      >Renders and blocks with complex detailed geometry and accurate physics</span
                    >
                  </div>
                  <div class="feature-item">
                    <CalendarIcon /><span
                      >Journeys into new dimensions and unexplored biomes with custom structures and
                      mobs</span
                    >
                  </div>
                  <div class="feature-item">
                    <CalendarIcon /><span
                      >Colorful visual effects from thick pipe smoke to streams of magic
                      particles</span
                    >
                  </div>
                  <div class="feature-item">
                    <CalendarIcon /><span
                      >Highly stable standalone launcher, free from third-party utilities, with
                      custom core developments</span
                    >
                  </div>
                </div>
                <div v-else class="tab-pane">
                  <div class="feature-item">
                    <CalendarIcon /><span
                      >Mod browser integration for project publishing, version control, and
                      dependency management</span
                    >
                  </div>
                  <div class="feature-item">
                    <CalendarIcon /><span
                      >Animation and block models for programmatic polygon shapes and conditional
                      hitboxes</span
                    >
                  </div>
                  <div class="feature-item">
                    <CalendarIcon /><span
                      >Custom dimension generation with environmental parameter configuration</span
                    >
                  </div>
                  <div class="feature-item">
                    <CalendarIcon /><span
                      >Creation of custom particle types, controlling their emitters and physical
                      motion vectors</span
                    >
                  </div>
                  <div class="feature-item">
                    <CalendarIcon /><span
                      >Migrating away from BlockLauncher environment to a stable launcher with own
                      game instance</span
                    >
                  </div>
                </div>
              </div>
            </div>

            <div class="timeline-era">
              <div class="era-aside">
                <div class="era-icon-wrapper gradient-border">
                  <CoreEngineIcon />
                </div>
                <div class="era-line"></div>
              </div>

              <div class="era-content">
                <div v-if="showcaseTab === 'user'" class="tab-pane">
                  <div class="feature-item">
                    <CalendarIcon />
                    <span
                      >Interactive interfaces for electric machines, magic altars, and the
                      player</span
                    >
                  </div>
                  <div class="feature-item">
                    <CalendarIcon />
                    <span>Automated factories, wireless energy, and advanced sorting systems</span>
                  </div>
                  <div class="feature-item">
                    <CalendarIcon />
                    <span>Unique mobs and bosses with complex behavior and natural spawning</span>
                  </div>
                  <div class="feature-item">
                    <CalendarIcon />
                    <span>3D machine models with moving parts and informational holograms</span>
                  </div>
                  <div class="feature-item">
                    <CalendarIcon />
                    <span
                      >Full preservation of resources and blocks when updating or replacing
                      mods</span
                    >
                  </div>
                </div>

                <div v-else class="tab-pane">
                  <div class="feature-item">
                    <CalendarIcon />
                    <span
                      >Canvas-based window development featuring multiple elements and window
                      types</span
                    >
                  </div>
                  <div class="feature-item">
                    <CalendarIcon />
                    <span>Functional blocks with containers, events, and interactivity</span>
                  </div>
                  <div class="feature-item">
                    <CalendarIcon />
                    <span>Entity behavior design through state machines and spawn conditions</span>
                  </div>
                  <div class="feature-item">
                    <CalendarIcon />
                    <span
                      >Programmatic modeling of cubes and meshes with UV mapping and animation
                      settings</span
                    >
                  </div>
                  <div class="feature-item">
                    <CalendarIcon />
                    <span>Static IDs utilization and advanced mod data saving</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ButtonStyled } from "@icmods/ui";
import { CompassIcon, LogInIcon, DashboardIcon } from "@icmods/assets";
import CalendarIcon from "~/assets/images/utils/calendar.svg?component";
import IcmodsIcon from "~/assets/images/logo.svg?component";
import Avatar from "~/components/ui/Avatar.vue";
import HorizonIcon from "~/assets/images/external/horizon.svg?component";
import InnerCoreIcon from "~/assets/images/external/innercore.svg?component";
import CoreEngineIcon from "~/assets/images/external/coreengine.svg?component";
import ShowcaseScreenshot1 from "~/assets/images/illustrations/icmods-showcase-1.jpg?component";
import ShowcaseScreenshotAlt1 from "~/assets/images/illustrations/icmods-showcase-1-alt.jpg?component";
import ShowcaseScreenshot2 from "~/assets/images/illustrations/icmods-showcase-2.jpg?component";
import ShowcaseScreenshot3 from "~/assets/images/illustrations/icmods-showcase-3.jpg?component";

import { homePageProjects } from "~/generated/state.json";

const showcaseTab = ref("user");

const auth = await useAuth();
const categories = [
  "endless exploration",
  "technology modpacks",
  "mystical rituals",
  "construction tools",
  "gameplay mechanics",
  "breathtaking worlds",
];

const newProjects = homePageProjects.slice(0, 40);
const val = Math.ceil(newProjects.length / 3);
const rows = ref([
  newProjects.slice(0, val),
  newProjects.slice(val, val * 2),
  newProjects.slice(val * 2, val * 3),
]);

const sectionRef = ref(null);
const scrollProgress = ref(0);

const slides = [
  {
    title: 'Build or Download <br/><span class="feature">Modpacks</span>',
    desc: "Experience the ultimate freedom in modding. Discover hundreds of community-made modpacks or create your own unique build from scratch.",
    img: [ShowcaseScreenshot1, ShowcaseScreenshotAlt1][Math.floor(Math.random() * 2)],
    features: [
      "One-click installation via Horizon or files",
      "Isolated environments for each pack",
      "Custom configurations and scripts",
    ],
  },
  {
    title: 'Play Together in <br/><span class="feature">Multiplayer</span>',
    desc: "Share your modded adventures with friends. Enjoy stable and fully synchronized gameplay on dedicated servers or local networks.",
    img: ShowcaseScreenshot2,
    features: [
      "High-performance Network API",
      "Local & Dedicated server support",
      "Zero desync for custom machines and UIs",
    ],
  },
  {
    title: 'Learn and Get <br/><span class="feature">Support</span>',
    desc: "Master the Inner Core API with our comprehensive documentation and join a vibrant community of developers and players.",
    img: ShowcaseScreenshot3,
    features: [
      "Extensive API Documentation",
      "Active Community Forums",
      "Open-source examples & guides",
    ],
  },
];

const activeSlideIndex = computed(() => {
  if (scrollProgress.value < 0.25) return 0;
  if (scrollProgress.value < 0.75) return 1;
  return 2;
});

const getClipPath = (index) => {
  if (index === 0) return "none";

  const step = 1 / (slides.length - 1);
  const start = (index - 1) * step;
  const localProgress = Math.min(Math.max((scrollProgress.value - start) / step, 0), 1);

  return `polygon(0 ${100 - localProgress * 100}%, 100% ${100 - localProgress * 100}%, 100% 100%, 0 100%)`;
};

const getTransform = (index) => {
  if (index === 0) return `scale(1.1) translateY(${scrollProgress.value * 30}px)`;

  const step = 1 / (slides.length - 1);
  const start = (index - 1) * step;
  const localProgress = Math.min(Math.max((scrollProgress.value - start) / step, 0), 1);

  return `scale(1.1) translateY(${(1 - localProgress) * -30}px)`;
};

const handleScroll = () => {
  if (!sectionRef.value) return;
  const rect = sectionRef.value.getBoundingClientRect();
  const windowHeight = window.innerHeight;
  const scrolled = windowHeight - rect.top;
  const totalScrollable = rect.height;

  let rawProgress = (scrolled - windowHeight) / (totalScrollable - windowHeight);
  scrollProgress.value = Math.max(0, Math.min(1, rawProgress));
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();
});

onUnmounted(() => window.removeEventListener("scroll", handleScroll));
</script>

<style lang="scss" scoped>
.landing-hero {
  background-image: var(--landing-maze-bg);
  background-size: cover;
  object-fit: contain;
  padding: 6rem 1rem 12rem 1rem;

  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  flex-direction: column;

  .icmods-icon {
    width: 13rem;
    height: 13rem;
    margin-bottom: 2.5rem;
  }

  h2 {
    font-size: 1.25rem;
    line-height: 125%;
    margin: 0 0 1.625rem;
    font-weight: 400;
    line-break: loose;
    color: var(--landing-color-subheading);
    max-width: 50rem;
  }

  .button-group {
    width: fit-content;
    gap: 1.25rem;
    margin: 0 auto 5rem;
    justify-content: center;
  }
}

.users-section-outer {
  position: relative;
  background: var(--landing-maze-outer-bg);
  width: 100%;

  &:before {
    content: "";
    position: absolute;
    z-index: 1;
    inset: 0;
    background: linear-gradient(
      180deg,
      var(--landing-transition-gradient-end) 0%,
      var(--landing-transition-gradient-start) 100%
    );
    height: 12.5rem;
    width: 100%;
  }

  .projects-transition {
    position: absolute;
    top: calc(-12.5rem);
    width: 100%;
    height: 12.5rem;
    background: linear-gradient(
      0deg,
      var(--landing-transition-gradient-end) 0%,
      var(--landing-transition-gradient-start) 100%
    );
  }

  .projects-showcase {
    position: absolute;
    z-index: 2;
    top: -11rem;

    .row {
      --gap: 1.5rem;

      width: 100vw;
      gap: var(--gap);
      margin-bottom: var(--gap);

      display: flex;
      overflow: hidden;
      user-select: none;

      &:hover {
        .row__content {
          animation-play-state: paused !important;
        }
      }

      .row__content {
        flex-shrink: 0;
        display: flex;
        min-width: 100%;
        gap: var(--gap);
        animation: scroll 40s linear infinite;

        @media (prefers-reduced-motion) {
          animation-play-state: paused !important;
        }

        @keyframes scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(calc(-100%));
          }
        }

        &.offset {
          animation: scroll-inverse 40s linear infinite;
          transform: translateX(-100%);

          @keyframes scroll-inverse {
            from {
              transform: translateX(calc(-100%));
            }
            to {
              transform: translateX(calc(0%));
            }
          }
        }
      }

      .project {
        position: relative;
        display: flex;

        cursor: pointer;
        padding: 1rem;
        gap: 1rem;
        border-radius: 1rem;
        border: 1px solid var(--landing-border-color);
        transition:
          background 0.5s ease-in-out,
          transform 0.05s ease-in-out;
        // Removed due to lag on mobile :(

        &:hover {
          z-index: -2;
          background: var(--landing-hover-card-gradient);
        }

        img {
          height: 3rem;
        }

        .project-info {
          box-sizing: border-box;
        }

        .title {
          color: var(--landing-color-heading);
          max-width: 13.75rem;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          margin: 0;
          font-weight: 600;
          font-size: 1.25rem;
          line-height: 110%;
          display: block;
        }

        .description {
          width: 13.75rem;

          display: -webkit-box;
          -webkit-line-clamp: 2;
          line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;

          font-weight: 500;
          font-size: 0.875rem;
          line-height: 125%;
          margin: 0.25rem 0 0;
        }
      }
    }
  }

  .users-section {
    width: 100%;
    padding-top: 10rem;
    padding-bottom: 5rem;

    background: var(--landing-maze-gradient-bg);
    background-size: cover;
    background-blend-mode: multiply;
  }
}

.creator-section {
  width: 100%;
  background: var(--landing-creator-gradient);
  padding: 2.5rem 0;
}

.gradient-border {
  position: relative;
  border-radius: 1rem;

  &:before {
    content: "";
    position: absolute;
    inset: 0;
    padding: 1px;
    z-index: -1;
    border-radius: 1rem;
    background: var(--landing-border-gradient);

    -webkit-mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    mask:
      linear-gradient(#fff 0 0) content-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
  }
}

.section-header {
  text-align: center;
  margin: 2rem;

  .section-label {
    margin: 1.5rem auto;
    width: fit-content;
    padding: 1rem 1.5rem;
    border-radius: 0.5rem;
    font-weight: 700;
    font-size: 1rem;
    line-height: 125%;

    &.players {
      background: var(--landing-blue-label-bg);
      color: var(--landing-blue-label);
    }
    &.creators {
      background: var(--landing-orange-label-bg);
      color: var(--landing-orange-label);
    }
  }

  .section-tagline,
  .section-description {
    font-weight: 400;
    font-size: 1.25rem;
    line-break: loose;
    line-height: 125%;
    max-width: 50rem;
  }

  .section-tagline {
    margin: 0 auto;
    color: var(--landing-color-heading);
  }

  .section-description {
    margin: 0.375rem auto;
    color: var(--landing-color-subheading);
  }
}

.main-header {
  color: var(--landing-color-heading);
  font-size: 2.25rem;
  font-weight: 600;
  line-height: 100%;
  margin: 0 0 0.25rem;
}

.main-header-strong {
  font-weight: 600;
  background-color: var(--color-brand);
  background-image: linear-gradient(180deg, #a7d0ff 0%, var(--color-brand) 60%);
  background-size: 100%;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  -moz-text-fill-color: transparent;
  color: transparent;
}

.animate-strong {
  height: 1.2em;
  line-height: 120%;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;

  > span {
    position: absolute;
    top: 0;
    animation: slide 10s infinite;

    @media (prefers-reduced-motion) {
      animation-play-state: paused !important;
    }
  }

  @keyframes slide {
    0%,
    13% {
      top: 0;
    }
    17%,
    30% {
      top: -1.2em;
    }
    33%,
    46% {
      top: -2.4em;
    }
    50%,
    63% {
      top: -3.6em;
    }
    66%,
    79% {
      top: -4.8em;
    }
    83%,
    96% {
      top: -6em;
    }
    99.99997%,
    99.99998% {
      top: -7.2em;
    }
    99.99999% {
      top: 0;
    }
  }
}

@media screen and (min-width: 560px) {
  .landing-hero {
    h2 {
      font-size: 1.5rem;
    }
  }

  .section-header {
    .section-tagline,
    .section-description {
      font-size: 1.5rem;
    }
  }

  .main-header {
    font-size: 4rem;
  }
}

@media screen and (min-width: 1024px) {
  .landing-hero {
    h2 {
      font-size: 1.625rem;
    }

    margin-top: -5rem;
    padding: 11.25rem 1rem 12rem;
  }

  .section-header {
    .section-tagline,
    .section-description {
      font-size: 1.625rem;
    }
  }

  .main-header {
    font-size: 5.25rem;
  }
}

.features-tabs-section {
  width: 100%;
  max-width: 65rem;
  margin: -2rem auto 0;
  padding: 0.25rem 1rem 4rem;
  display: flex;
  flex-direction: column;
  align-items: center;

  .tabs-nav {
    display: flex;
    gap: 0.75rem;
    margin-bottom: 3rem;
    padding: 0.4rem;

    button {
      padding: 0.5rem 1.25rem;
      border-radius: 0.5rem;
      font-weight: 600;
      font-size: 0.9rem;
      color: var(--landing-color-subheading);
      cursor: pointer;
      transition: all 0.2s ease;

      &.active {
        background: var(--landing-blue-label-bg);
        color: var(--landing-blue-label);
      }
      &.active.developer-tab {
        background: var(--landing-orange-label-bg);
        color: var(--landing-orange-label);
      }
    }
  }

  .timeline-era {
    display: flex;
    gap: 2.5rem;
    width: 100%;
    margin-bottom: 2rem;

    .era-aside {
      display: flex;
      flex-direction: column;
      align-items: center;

      .era-icon-wrapper {
        width: 4.5rem;
        height: 4.5rem;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--landing-card-bg);
        flex-shrink: 0;

        img,
        svg {
          width: 2.5rem;
          height: 2.5rem;
          image-rendering: pixelated;
        }
      }

      .era-line {
        width: 2px;
        flex-grow: 1;
        background: linear-gradient(180deg, var(--color-brand) 0%, transparent 100%);
        margin-top: 1rem;
        opacity: 0.3;
      }
    }

    .era-content {
      flex-grow: 1;

      .tab-pane {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        animation: fadeIn 0.3s ease-out;

        .feature-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.625rem 1rem;
          border-left: 3px solid transparent;
          transition: all 0.2s ease;

          svg {
            width: 1.25rem;
            height: 1.25rem;
            flex-shrink: 0;
            color: var(--landing-color-subheading);
            opacity: 0.7;
          }

          span {
            font-weight: 400;
            font-size: 1rem;
            line-height: 1.4;
            color: var(--landing-color-subheading);
          }

          &:hover {
            border-left-color: var(--color-brand);
            background: rgba(255, 255, 255, 0.03);

            svg {
              color: var(--landing-color-heading);
              opacity: 1;
            }
            span {
              color: var(--landing-color-heading);
            }
          }
        }
      }
    }

    &:last-child {
      margin-bottom: 0;
    }
  }
}

@media screen and (max-width: 896px) {
  .timeline-era {
    gap: 1.5rem;
  }
}

.reveal-section {
  position: relative;
  width: 100%;
  height: 250vh;

  .sticky-viewport {
    position: sticky;
    top: 0;
    width: 100%;
    height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .presentation-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    max-width: 100rem;
    padding: 0 3rem;
    gap: 5rem;

    @media screen and (max-width: 896px) {
      flex-direction: column;
      justify-content: center;
      gap: 1.5rem;
      padding: 0 1.5rem;
    }
  }

  .info-block {
    flex: 1;
    position: relative;
    height: 18rem;
    width: 100%;

    @media screen and (max-width: 896px) {
      flex: none;
      height: 22rem;
    }

    .text-group {
      position: absolute;
      top: 50%;
      left: 0;
      width: 100%;
      transform: translateY(-50%) translateX(-30px);
      opacity: 0;
      transition: all 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
      pointer-events: none;

      &.active {
        opacity: 1;
        transform: translateY(-50%) translateX(0);
        pointer-events: auto;
      }

      p {
        font-size: 1.35rem;
        color: var(--landing-color-subheading);
        line-height: 1.5;
        margin: 0;
        max-width: 32rem;

        @media screen and (max-width: 896px) {
          font-size: 1.05rem;
          max-width: 100%;
        }
      }

      .main-header {
        font-size: 3.5rem;
        margin-bottom: 1rem;

        @media screen and (max-width: 896px) {
          font-size: 2.25rem;
          margin-bottom: 0.5rem;
        }

        :deep(.feature) {
          color: var(--color-brand);
        }
      }

      .slide-features {
        margin-top: 2rem;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;

        @media screen and (max-width: 896px) {
          margin-top: 1.25rem;
          gap: 0.5rem;
        }

        .slide-feature {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 0.875rem 1.25rem;
          background: var(--landing-card-bg);
          border-radius: 0.75rem;
          border-left: 3px solid transparent;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

          transform: translateX(-20px);
          opacity: 0;
          transition: all 0.3s ease;

          @media screen and (max-width: 896px) {
            padding: 0.625rem 1rem;
            gap: 0.75rem;
          }

          &:hover {
            background: rgba(255, 255, 255, 0.03);
            border-left-color: var(--color-brand);
            transform: translateX(8px) !important;
            transition-delay: 0s !important;

            .feature-icon svg {
              color: var(--landing-color-heading);
            }
          }

          .feature-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            width: 1.5rem;
            height: 1.5rem;

            svg {
              width: 100%;
              height: 100%;
              color: var(--color-brand);
              transition: color 0.3s ease;
            }
          }

          span {
            font-size: 1.1rem;
            color: var(--landing-color-heading);
            font-weight: 500;
            line-height: 1.3;

            @media screen and (max-width: 896px) {
              font-size: 0.95rem;
            }
          }
        }
      }

      &.active {
        .slide-feature {
          transform: translateX(0);
          opacity: 1;

          &:nth-child(1) {
            transition-delay: 0.2s;
          }
          &:nth-child(2) {
            transition-delay: 0.3s;
          }
          &:nth-child(3) {
            transition-delay: 0.4s;
          }
          &:nth-child(4) {
            transition-delay: 0.5s;
          }
        }
      }
    }
  }

  .image-showcase {
    flex: 1.4;
    position: relative;
    width: 100%;
    height: 45rem;
    border-radius: 2rem;
    overflow: hidden;
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
    border: 1px solid var(--landing-border-color);

    @media screen and (max-width: 896px) {
      flex: none;
      height: 35vh;
      min-height: 18rem;
      border-radius: 1.25rem;
    }

    .img-wrapper {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        will-change: transform;
      }
    }
  }
}
</style>
