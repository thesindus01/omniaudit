import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const skillsDir = path.join(__dirname, '..', 'ai-marketing-claude', 'skills');
const directories = fs.readdirSync(skillsDir, { withFileTypes: true })
  .filter(dirent => dirent.isDirectory())
  .map(dirent => dirent.name);

const skillsData = {};

for (const dir of directories) {
  const skillPath = path.join(skillsDir, dir, 'SKILL.md');
  if (fs.existsSync(skillPath)) {
    const content = fs.readFileSync(skillPath, 'utf8');
    // Truncate to avoid making the file completely unreadable locally, though we keep 2000 chars of core instructions
    skillsData[dir] = content;
  }
}

const outputPath = path.join(__dirname, '..', 'api', 'skillsData.js');
fs.writeFileSync(outputPath, `export const skillsData = ${JSON.stringify(skillsData, null, 2)};\n`);
console.log('Successfully bundled skills to api/skillsData.js');
