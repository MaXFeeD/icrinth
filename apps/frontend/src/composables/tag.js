import tags from "~/generated/state.json";

export const useTags = () =>
  useState("tags", () => ({
    categories: tags.categories,
    loaders: tags.loaders,
    gameVersions: tags.gameVersions,
    donationPlatforms: tags.donationPlatforms,
    reportTypes: tags.reportTypes,
    projectTypes: [
      {
        actual: "mod",
        id: "mod",
        display: "mod",
      },
      {
        actual: "modpack",
        id: "modpack",
        display: "modpack",
      },
      {
        actual: "server",
        id: "server",
        display: "server",
      },
    ],
    loaderData: {
      dataPackLoaders: ["datapack"],
      modLoaders: [
        "coreengine",
        "forge",
        "fabric",
        "quilt",
        "liteloader",
        "modloader",
        "rift",
        "neoforge",
      ],
      hiddenModLoaders: ["liteloader", "modloader", "rift"],
    },
    projectViewModes: ["list", "grid", "gallery"],
    approvedStatuses: ["approved", "archived", "unlisted", "private"],
    rejectedStatuses: ["rejected", "withheld"],
    staffRoles: ["moderator", "admin"],
  }));
