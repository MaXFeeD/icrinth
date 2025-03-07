import JSZip from "jszip";

export const inferVersionInfo = async function (rawFile, project, gameVersions) {
  function versionType(number) {
    if (number.includes("alpha")) {
      return "alpha";
    } else if (
      number.includes("beta") ||
      number.match(/[^A-z](rc)[^A-z]/) || // includes `rc`
      number.match(/[^A-z](pre)[^A-z]/) // includes `pre`
    ) {
      return "beta";
    } else {
      return "release";
    }
  }

  const simplifiedGameVersions = gameVersions
    .filter((it) => it.version_type === "release")
    .map((it) => it.version);

  const inferFunctions = {
    // Core Engine/Inner Core
    "mod.info": (file) => {
      const metadata = JSON.parse(file);

      return {
        name: `${project.title} ${metadata.version}`,
        version_number: metadata.version,
        loaders: ["coreengine"],
        version_type: versionType(metadata.version),
        // TODO#icmods: Uhm, do we really need those? :>
        game_versions: simplifiedGameVersions,
      };
    },
    // Modpacks
    "modrinth.index.json": (file) => {
      const metadata = JSON.parse(file);

      const loaders = [];
      if ("coreengine" in metadata.dependencies) {
        loaders.push("coreengine");
      }

      return {
        name: `${project.title} ${metadata.versionId}`,
        version_number: metadata.versionId,
        version_type: versionType(metadata.versionId),
        loaders,
        game_versions: gameVersions
          .filter((x) => x.version === metadata.dependencies.minecraft)
          .map((x) => x.version),
      };
    },
    // Resource Packs + Behavior Packs
    "pack.mcmeta": (file) => {
      const metadata = JSON.parse(file);

      function getRange(versionA, versionB) {
        const startingIndex = gameVersions.findIndex((x) => x.version === versionA);
        const endingIndex = gameVersions.findIndex((x) => x.version === versionB);

        const final = [];
        const filterOnlyRelease = gameVersions[startingIndex].version_type === "release";

        for (let i = startingIndex; i >= endingIndex; i--) {
          if (gameVersions[i].version_type === "release" || !filterOnlyRelease) {
            final.push(gameVersions[i].version);
          }
        }

        return final;
      }

      const loaders = [];
      let newGameVersions = [];

      if (project.actualProjectType === "mod") {
        loaders.push("behaviorpack");

        switch (metadata.pack.pack_format) {
          case 4:
            newGameVersions = getRange("1.13", "1.14.4");
            break;
          case 5:
            newGameVersions = getRange("1.15", "1.16.1");
            break;
          case 6:
            newGameVersions = getRange("1.16.2", "1.16.5");
            break;
          case 7:
            newGameVersions = getRange("1.17", "1.17.1");
            break;
          case 8:
            newGameVersions = getRange("1.18", "1.18.1");
            break;
          case 9:
            newGameVersions.push("1.18.2");
            break;
          case 10:
            newGameVersions = getRange("1.19", "1.19.3");
            break;
          case 11:
            newGameVersions = getRange("23w03a", "23w05a");
            break;
          case 12:
            newGameVersions.push("1.19.4");
            break;
          default:
        }
      }

      return {
        loaders,
        game_versions: newGameVersions,
      };
    },
  };

  const zipReader = new JSZip();

  const zip = await zipReader.loadAsync(rawFile);

  for (const fileName in inferFunctions) {
    const file = zip.file(fileName);

    if (file !== null) {
      const text = await file.async("text");
      return inferFunctions[fileName](text, zip);
    }
  }
};
