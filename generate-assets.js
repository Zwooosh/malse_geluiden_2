const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, 'assets', 'kud');
const OUTPUT_FILE = path.join(__dirname, 'assets.js');

function generateAssets() {
  if (!fs.existsSync(ASSETS_DIR)) {
    console.error(`Directory not found: ${ASSETS_DIR}`);
    return;
  }

  const episodes = fs.readdirSync(ASSETS_DIR).filter(file => {
    return fs.statSync(path.join(ASSETS_DIR, file)).isDirectory();
  });

  const assets = episodes.map(episode => {
    const episodePath = path.join(ASSETS_DIR, episode);
    const sounds = fs.readdirSync(episodePath).filter(file => {
      return !file.startsWith('.') && (file.endsWith('.mp3') || file.endsWith('.wav') || file.endsWith('.m4a'));
    });

    const soundData = sounds.map(sound => {
      // Create a relative path for require()
      // We are in root, assets is in ./assets
      // But the output file is in root (for now, or src)
      // Let's assume output file is in root.
      const relativePath = `./assets/kud/${episode}/${sound}`;
      return `{ name: "${sound}", source: require("${relativePath}") }`;
    });

    return `{
      title: "${episode}",
      data: [
        ${soundData.join(',\n        ')}
      ]
    }`;
  });

  const fileContent = `export const soundAssets = [
  ${assets.join(',\n  ')}
];
`;

  fs.writeFileSync(OUTPUT_FILE, fileContent);
  console.log(`Assets generated at ${OUTPUT_FILE}`);
}

generateAssets();
