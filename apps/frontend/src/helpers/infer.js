import JSZip from "jszip";

export const inferVersionInfo = async function (rawFile, project, gameVersions) {
  function versionType(number) {
    if (number.includes("alpha")) {
      return "alpha";
    } else if (
      number.includes("beta") ||
      number.match(/[^A-z](rc)[^A-z]/) || // includes `rc`
      number.match(/[^A-z](pre)(release)?[^A-z]/) // includes `pre`/`prerelease`
    ) {
      return "beta";
    } else {
      return "release";
    }
  }

  const supportedGameVersions = gameVersions
    .filter((it) => it.version_type === "release" && it.version.includes("1.16"))
    .map((it) => it.version);

  const inferFunctions = {
    // Inner Core modpacks
    "/modpack.json": (file) => {
      const metadata = JSON.parse(file);

      return {
        name: `${project.title} ${metadata.versionName || metadata.versionCode}`,
        version_number: `${metadata.versionCode}`,
        loaders: ["innercore"],
        version_type: metadata.versionName ? versionType(metadata.versionName) : "release",
        game_versions: supportedGameVersions,
      };
    },
    // Modpacks, .mrpack requires placing in root folder
    "/icmods.index.json": (file) => {
      const metadata = JSON.parse(file);

      return {
        name: `${project.title} ${metadata.versionId}`,
        version_number: metadata.versionId,
        version_type: versionType(metadata.versionId),
        loaders: ["innercore"],
        game_versions: gameVersions
          .filter((x) => x.version === metadata.dependencies.minecraft)
          .map((x) => x.version),
      };
    },
    // Core Engine (powered by Inner Core) mods
    "mod.info": (file) => {
      const metadata = JSON.parse(file);

      return {
        name: `${project.title} ${metadata.version}`,
        version_number: metadata.version,
        loaders: ["coreengine"],
        version_type: versionType(metadata.version),
        game_versions: supportedGameVersions,
      };
    },
  };

  const zipReader = new JSZip();

  const zip = await zipReader.loadAsync(rawFile);

  for (const fileName in inferFunctions) {
    let file = zip.file(fileName.charAt(0) === "/" ? fileName.substring(1) : fileName);

    if (file === null && !fileName.startsWith("/")) {
      try {
        zip.forEach((relativePath, entry) => {
          if (!entry.dir && relativePath.endsWith(fileName)) {
            file = zip.file(entry.name);
            throw new Error("File found in subdirectory");
          }
        });
      } catch {
        // this is actually good, we can continue
      }
    }

    if (file !== null) {
      const text = await file.async("text");
      return inferFunctions[fileName](text, zip);
    }
  }

  throw new Error(
    "Invalid project structure. Missing required metadata file (mod.info, modpack.json, or icmods.index.json).",
  );
};
