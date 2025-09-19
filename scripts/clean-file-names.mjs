// remove-spotidown-prefix.mjs
import { readdir, rename } from 'fs/promises';
import { join } from 'path';

async function removeSpotiDownPrefix(folderPath) {
  try {
    const files = await readdir(folderPath);
    const prefix = 'SpotiDown.App - ';
    
    let renamedCount = 0;
    
    for (const file of files) {
      if (file.includes(prefix)) {
        const newName = file.replace(prefix, '');
        const oldPath = join(folderPath, file);
        const newPath = join(folderPath, newName);
        
        await rename(oldPath, newPath);
        console.log(`✅ Renamed: ${file} → ${newName}`);
        renamedCount++;
      }
    }
    
    if (renamedCount === 0) {
      console.log('ℹ️ No files found with "SpotiDown.App - " prefix');
    } else {
      console.log(`\n🎉 Successfully renamed ${renamedCount} file(s)`);
    }
    
  } catch (error) {
    console.error('❌ Error renaming files:', error.message);
  }
}

// Usage - update the folder path to your target folder
let targetFolder = './public/songs';
removeSpotiDownPrefix(targetFolder)