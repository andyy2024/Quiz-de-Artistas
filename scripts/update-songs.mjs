// update-songs.mjs
// this mjs updates the empty path inside songs.json
// update-songs.mjs
import fs from "fs/promises";
import path from "path";

const songsJsonPath = path.resolve("public/songs.json");
const songsDirPath = path.resolve("public/songs");
const outJsonPath = path.resolve("public/songs2.json");

// Helper: normalize strings for comparison
function normalize(str) {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]/g, ""); // remove non-alphanumeric
}

async function main() {
  try {
    // Load JSON
    const data = JSON.parse(await fs.readFile(songsJsonPath, "utf8"));
    const canciones = data.canciones;

    // Read all filenames in songs dir
    const files = await fs.readdir(songsDirPath);

    console.log("🎵 Starting song match process...\n");

    let matchedCount = 0;
    let missingCount = 0;

    for (const song of canciones) {
      const normName = normalize(song.name);

      // Try to find a matching file
      const match = files.find((file) => normalize(file).includes(normName));

      if (match) {
        song.path = `songs/${match}`;
        matchedCount++;
        console.log(
          `✅ Matched: \x1b[32m${song.name}\x1b[0m → \x1b[36m${match}\x1b[0m`
        );
      } else {
        missingCount++;
        console.log(
          `❌ No match: \x1b[31m${song.name}\x1b[0m`
        );
      }
    }

    // Write updated JSON to new file
    await fs.writeFile(outJsonPath, JSON.stringify({ canciones }, null, 2), "utf8");

    console.log("\n📀 Done!");
    console.log(`✨ Matches found: \x1b[32m${matchedCount}\x1b[0m`);
    console.log(`⚠️  Not found: \x1b[31m${missingCount}\x1b[0m`);
    console.log(`📂 Updated JSON written to: ${outJsonPath}`);
  } catch (err) {
    console.error("🚨 Error:", err);
  }
}

main();
