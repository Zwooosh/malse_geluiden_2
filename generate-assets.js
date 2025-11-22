const fs = require('fs');
const path = require('path');

const ASSETS_ROOT = path.join(__dirname, 'assets');
const OUTPUT_FILE = path.join(__dirname, 'assets.js');

const CATEGORIES = ['kud', 'lekker_spelen'];

function generateAssets() {
  let allAssets = [];

  CATEGORIES.forEach(category => {
    const categoryDir = path.join(ASSETS_ROOT, category);

    if (!fs.existsSync(categoryDir)) {
      console.warn(`Category directory not found: ${categoryDir}`);
      return;
    }

    const episodes = fs.readdirSync(categoryDir).filter(file => {
      return fs.statSync(path.join(categoryDir, file)).isDirectory();
    });

    const categoryAssets = episodes.map(episode => {
      const episodePath = path.join(categoryDir, episode);
      const sounds = fs.readdirSync(episodePath).filter(file => {
        return !file.startsWith('.') && (file.endsWith('.mp3') || file.endsWith('.wav') || file.endsWith('.m4a'));
      });

      const soundData = sounds.map(sound => {
        const relativePath = `./assets/${category}/${episode}/${sound}`;
        return `{ name: "${sound}", source: require("${relativePath}") }`;
      });

      return `{
        title: "${episode}",
        category: "${category}",
        data: [
          ${soundData.join(',\n        ')}
        ]
      }`;
    });

    allAssets = allAssets.concat(categoryAssets);
  });

  const fileContent = `export const soundAssets = [
  ${allAssets.join(',\n  ')}
];
`;

  fs.writeFileSync(OUTPUT_FILE, fileContent);
  console.log(`Assets generated at ${OUTPUT_FILE}`);
}

generateAssets();
