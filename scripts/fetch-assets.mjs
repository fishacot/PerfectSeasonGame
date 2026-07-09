import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import https from 'https';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const PLAYERS = {
  basketball: [
    'Michael Jordan', 'LeBron James', 'Magic Johnson', 'Kobe Bryant',
    'Shaquille O\'Neal', 'Larry Bird', 'Stephen Curry', 'Kareem Abdul-Jabbar',
    'Tim Duncan', 'Giannis Antetokounmpo'
  ],
  football: [
    'Thierry Henry', 'Lionel Messi', 'Cristiano Ronaldo', 'Zinedine Zidane',
    'Paolo Maldini', 'David Beckham', 'Erling Haaland', 'Mohamed Salah',
    'Ronaldinho', 'Kylian Mbappe'
  ],
  hockey: [
    'Wayne Gretzky', 'Mario Lemieux', 'Sidney Crosby', 'Alexander Ovechkin',
    'Connor McDavid', 'Martin Brodeur', 'Patrick Roy', 'Jaromir Jagr',
    'Bobby Orr', 'Nicklas Lidstrom'
  ]
};

const BACKGROUNDS = {
  'football-stadium': 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=1200',
  'basketball-arena': 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&q=80&w=1200',
  'hockey-rink': 'https://images.unsplash.com/photo-1515703407324-5f753eed2411?auto=format&fit=crop&q=80&w=1200'
};

function slugify(name) {
  return name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");
}

async function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

async function getWikiThumbnail(name) {
  return new Promise((resolve) => {
    const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(name.replace(/ /g, '_'))}`;
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve(json.thumbnail ? json.thumbnail.source : null);
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

async function run() {
  console.log('--- FETCHING ASSETS ---');

  // Backgrounds
  for (const [name, url] of Object.entries(BACKGROUNDS)) {
    const dest = path.join(__dirname, '../public/backgrounds', `${name}.webp`);
    if (!fs.existsSync(dest)) {
      console.log(`Downloading background: ${name}...`);
      try {
        await download(url, dest);
      } catch (e) {
        console.error(`Failed background ${name}: ${e.message}`);
      }
    }
  }

  // Players
  for (const [sport, names] of Object.entries(PLAYERS)) {
    for (const name of names) {
      const slug = slugify(name);
      const dest = path.join(__dirname, `../public/players/${sport}`, `${slug}.webp`);
      
      if (fs.existsSync(dest)) continue;

      console.log(`Fetching photo for ${name} (${sport})...`);
      const thumbUrl = await getWikiThumbnail(name);
      if (thumbUrl) {
        try {
          await download(thumbUrl, dest);
          console.log(`Saved ${slug}.webp`);
        } catch (e) {
          console.error(`Failed ${name}: ${e.message}`);
        }
      } else {
        console.warn(`No thumbnail found for ${name}`);
      }
    }
  }

  console.log('--- DONE ---');
}

run();
