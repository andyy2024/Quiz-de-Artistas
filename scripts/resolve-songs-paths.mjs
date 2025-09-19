import { readFile } from 'fs/promises';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import { access, constants } from 'fs/promises';

// Get the current directory of the script
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Construct the path to the JSON file relative to the script's directory
const jsonPath = resolve(__dirname, '../public/songs3.json');

async function checkSongPaths() {
  try {
    // Read and parse the JSON file
    const data = await readFile(jsonPath, 'utf8');
    const { canciones } = JSON.parse(data);

    // Check if the "canciones" array exists
    if (!canciones || !Array.isArray(canciones)) {
      console.error('JSON does not contain a "canciones" array.');
      return;
    }

    // Map each song to an async operation that checks its path
    const pathChecks = canciones.map(async (song, index) => {
      const { path } = song;
      if (!path) {
        console.warn(`⚠️ Song at index ${index} has no 'path' property.`);
        return { index, path: null, exists: false, error: 'Path is missing' };
      }

      // Resolve the song's path relative to the "public" directory
      const songPath = resolve(__dirname, '../public', path);
      try {
        await access(songPath, constants.F_OK);
        return { index, path, exists: true };
      } catch (error) {
        return { index, path, exists: false, error: error.message };
      }
    });

    // Wait for all path checks to complete
    const results = await Promise.all(pathChecks);

    // Print the report
    console.log('--- Path Resolution Report ---');
    let allExist = true;
    results.forEach(result => {
      if (result.exists) {
        console.log(`✅ Path '${result.path}' resolves successfully.`);
      } else {
        allExist = false;
        console.error(`❌ Path '${result.path}' does NOT exist. Error: ${result.error}`);
      }
    });

    console.log('------------------------------');
    if (allExist) {
      console.log('🎉 All song paths resolve to existing files!');
    } else {
      console.log('❗ Some song paths do not resolve.');
    }

  } catch (error) {
    console.error(`An error occurred: ${error.message}`);
  }
}

checkSongPaths();