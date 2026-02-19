const express = require('express');
const cors = require('cors');
const session = require('express-session');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

// Hardcoded credentials (change these)
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'vespator2024';

app.use(cors({ credentials: true, origin: true }));
app.use(express.json());
app.use(session({
  secret: 'vespator-star-map-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true if using HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

app.use(express.static('public'));

// Serve the star map image
app.use('/images', express.static(__dirname));

const MARKERS_FILE = path.join(__dirname, 'data', 'markers.json');

// Ensure data directory exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'));
}

// Initialize markers file if it doesn't exist
if (!fs.existsSync(MARKERS_FILE)) {
  fs.writeFileSync(MARKERS_FILE, JSON.stringify({ markers: [] }, null, 2));
}

// Auth middleware
function requireAuth(req, res, next) {
  if (req.session && req.session.authenticated) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized' });
}

// Login endpoint
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  if (username === ADMIN_USER && password === ADMIN_PASS) {
    req.session.authenticated = true;
    req.session.username = username;
    res.json({ success: true, username });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Logout endpoint
app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

// Check auth status
app.get('/api/auth/status', (req, res) => {
  res.json({
    authenticated: !!(req.session && req.session.authenticated),
    username: req.session?.username || null
  });
});

// Get all markers (public - anyone can view)
app.get('/api/markers', (req, res) => {
  try {
    const data = JSON.parse(fs.readFileSync(MARKERS_FILE, 'utf8'));
    res.json(data.markers);
  } catch (error) {
    res.status(500).json({ error: 'Failed to read markers' });
  }
});

// Add a new marker (protected)
app.post('/api/markers', requireAuth, (req, res) => {
  try {
    const { x, y, title, description, faction } = req.body;
    const data = JSON.parse(fs.readFileSync(MARKERS_FILE, 'utf8'));

    const newMarker = {
      id: Date.now().toString(),
      x,
      y,
      title: title || 'Unnamed Gang',
      description: description || '',
      faction: faction || 'imperium',
      createdAt: new Date().toISOString()
    };

    data.markers.push(newMarker);
    fs.writeFileSync(MARKERS_FILE, JSON.stringify(data, null, 2));

    res.status(201).json(newMarker);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create marker' });
  }
});

// Update a marker (protected)
app.put('/api/markers/:id', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const data = JSON.parse(fs.readFileSync(MARKERS_FILE, 'utf8'));

    const index = data.markers.findIndex(m => m.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Marker not found' });
    }

    data.markers[index] = { ...data.markers[index], ...updates };
    fs.writeFileSync(MARKERS_FILE, JSON.stringify(data, null, 2));

    res.json(data.markers[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update marker' });
  }
});

// Delete a marker (protected)
app.delete('/api/markers/:id', requireAuth, (req, res) => {
  try {
    const { id } = req.params;
    const data = JSON.parse(fs.readFileSync(MARKERS_FILE, 'utf8'));

    const index = data.markers.findIndex(m => m.id === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Marker not found' });
    }

    data.markers.splice(index, 1);
    fs.writeFileSync(MARKERS_FILE, JSON.stringify(data, null, 2));

    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete marker' });
  }
});

app.listen(PORT, () => {
  console.log(`Vespator Star Map server running at http://localhost:${PORT}`);
});
