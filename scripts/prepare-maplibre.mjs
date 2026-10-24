import { copyFile, mkdir } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// Serve the worker and its sibling module from the installed MapLibre version.
const dist = dirname(fileURLToPath(import.meta.resolve("maplibre-gl")));
const target = new URL("../public/maplibre/", import.meta.url);
await mkdir(target, { recursive: true });
for (const file of ["maplibre-gl-worker.mjs", "maplibre-gl-shared.mjs"]) {
  await copyFile(join(dist, file), new URL(file, target));
}
