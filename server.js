const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();

const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, 'public', 'data.json');

app.use(express.json({ limit: '50mb' }));

const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

function saveBase64Image(base64Str) {
  const match = base64Str.match(/^data:image\/([a-zA-Z0-9+]+);base64,(.+)$/);
  if (!match) return base64Str;

  let ext = match[1];
  if (ext === 'svg+xml') ext = 'svg';
  const data = match[2];
  const buffer = Buffer.from(data, 'base64');

  const filename = `img_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${ext}`;
  const filepath = path.join(UPLOADS_DIR, filename);

  fs.writeFileSync(filepath, buffer);
  return `/uploads/${filename}`;
}

function processJsonImages(obj) {
  if (typeof obj === 'string') {
    if (obj.startsWith('data:image/')) {
      return saveBase64Image(obj);
    }
    return obj;
  } else if (Array.isArray(obj)) {
    return obj.map(item => processJsonImages(item));
  } else if (obj !== null && typeof obj === 'object') {
    const newObj = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        newObj[key] = processJsonImages(obj[key]);
      }
    }
    return newObj;
  }
  return obj;
}

// Auto-migration on startup
if (fs.existsSync(DATA_FILE)) {
  try {
    console.log('Checking database for base64 images to migrate...');
    const raw = fs.readFileSync(DATA_FILE, 'utf8');
    const data = JSON.parse(raw);
    let migratedCount = 0;

    function migrateBase64(obj) {
      if (typeof obj === 'string') {
        if (obj.startsWith('data:image/')) {
          migratedCount++;
          return saveBase64Image(obj);
        }
        return obj;
      } else if (Array.isArray(obj)) {
        return obj.map(migrateBase64);
      } else if (obj !== null && typeof obj === 'object') {
        const newObj = {};
        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) {
            newObj[key] = migrateBase64(obj[key]);
          }
        }
        return newObj;
      }
      return obj;
    }

    const migratedData = migrateBase64(data);
    if (migratedCount > 0) {
      fs.writeFileSync(DATA_FILE, JSON.stringify(migratedData, null, 2), 'utf8');
      console.log(`Successfully migrated ${migratedCount} base64 images to local uploads!`);
    } else {
      console.log('Database is clean. No base64 images found to migrate.');
    }
  } catch (e) {
    console.error('Failed to run startup migration:', e);
  }
}

// API Endpoints for persistent storage
app.get('/api/data', (req, res) => {
  if (fs.existsSync(DATA_FILE)) {
    try {
      const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
      res.json(data);
    } catch (e) {
      res.status(500).json({ error: 'Failed to read data' });
    }
  } else {
    res.json(null); // Will fallback to defaultData on client
  }
});

app.post('/api/data', (req, res) => {
  try {
    const processedData = processJsonImages(req.body);
    fs.writeFileSync(DATA_FILE, JSON.stringify(processedData, null, 2), 'utf8');
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: 'Failed to save data' });
  }
});

// Removed separate uploads serving; served via dist now

// Serve static files from the 'dist' directory
app.use(express.static(path.join(__dirname, 'dist')));

// Fallback all routes to index.html for React Router / SPA routing
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
