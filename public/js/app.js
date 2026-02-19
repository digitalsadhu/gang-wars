// Vespator Star Map Application

const IMAGE_PATH = '/images/hive-city.jpg';  // Now served from public/images/

// Image dimensions (adjust if needed)
const IMAGE_WIDTH = 4032;
const IMAGE_HEIGHT = 3024;

// Infrastructure data (loaded from JSON)
let infrastructureData = [];

// Power Level description
const POWER_DESCRIPTION = `Each planet tracks a Power Level (1 - 4) for each Alliance.
Power Level represents influence, control, and effectiveness on that planet.
Power Levels affect:
• Mission gameplay and outcomes
• Infrastructure placement priority
• Event resolution`;

// Player data (loaded from JSON)
let playersData = [];

// Config data (loaded from JSON)
let configData = null;

// Cache for loaded SVG icons
const iconCache = {};

let map;
let markers = [];
let markerLayer;
let addMode = null; // null, 'gang', 'infrastructure', 'power', or 'theatre'
let isAuthenticated = false;
let theatresData = null;
let operationsData = null;

// Initialize the map
async function initMap() {
  const bounds = [[0, 0], [IMAGE_HEIGHT, IMAGE_WIDTH]];

  map = L.map('map', {
    crs: L.CRS.Simple,
    minZoom: -2,
    maxZoom: 2,
    zoomSnap: 0.25,
    zoomDelta: 0.5
  });

  L.imageOverlay(IMAGE_PATH, bounds).addTo(map);
  map.fitBounds(bounds);

  markerLayer = L.layerGroup().addTo(map);

  await checkAuthStatus();
  await loadConfig();
  await loadPlayers();
  await loadInfrastructure();
  await loadTheatres();
  await loadOperations();
  await loadMarkers();
  setupEventListeners();
}

// Check authentication status
async function checkAuthStatus() {
  try {
    const response = await fetch('/api/auth/status');
    const data = await response.json();
    isAuthenticated = data.authenticated;
    updateAuthUI(data.username);
  } catch (error) {
    console.error('Failed to check auth status:', error);
  }
}

// Update UI based on auth status
function updateAuthUI(username = null) {
  const loggedOutControls = document.getElementById('logged-out-controls');
  const loggedInControls = document.getElementById('logged-in-controls');
  const userDisplay = document.getElementById('user-display');

  if (isAuthenticated) {
    loggedOutControls.classList.add('hidden');
    loggedInControls.classList.remove('hidden');
    userDisplay.textContent = username || 'Admin';
  } else {
    loggedOutControls.classList.remove('hidden');
    loggedInControls.classList.add('hidden');
  }

  // Re-render markers to show/hide edit buttons
  renderMarkers();
}

// Load config data
async function loadConfig() {
  try {
    const response = await fetch('/data/config.json');
    configData = await response.json();
    populateAllianceDropdowns();
    await preloadIcons();
  } catch (error) {
    console.error('Failed to load config:', error);
  }
}

// Preload all faction icons
async function preloadIcons() {
  if (!configData || !configData.factions) return;

  const loadPromises = Object.entries(configData.factions).map(async ([faction, config]) => {
    if (config.icon) {
      try {
        const response = await fetch(config.icon);
        const svgText = await response.text();
        iconCache[faction] = svgText;
      } catch (error) {
        console.error(`Failed to load icon for ${faction}:`, error);
      }
    }
  });

  await Promise.all(loadPromises);
}

// Get SVG icon for a faction
function getFactionIcon(faction) {
  if (iconCache[faction]) {
    return iconCache[faction];
  }
  // Default fallback icon (simple diamond)
  return '<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12,3 4,20 12,16 20,20"/></svg>';
}

// Get faction colors from config
function getFactionColors(faction) {
  if (configData && configData.factions && configData.factions[faction]) {
    return configData.factions[faction];
  }
  // Default fallback colors
  return { background: '#666666', border: '#888888' };
}

// Populate alliance dropdowns from config
function populateAllianceDropdowns() {
  const selects = [
    document.getElementById('infra-alliance'),
    document.getElementById('power-alliance')
  ];

  if (!configData || !configData.factions) return;

  const factions = Object.keys(configData.factions);

  selects.forEach(select => {
    if (!select) return;
    select.innerHTML = '';
    factions.forEach(faction => {
      const option = document.createElement('option');
      option.value = faction;
      option.textContent = faction;
      select.appendChild(option);
    });
  });
}

// Load players data
async function loadPlayers() {
  try {
    const response = await fetch('/data/players.json');
    const data = await response.json();
    playersData = data.players;
    populatePlayerDropdown();
  } catch (error) {
    console.error('Failed to load players:', error);
  }
}

// Populate player dropdown
function populatePlayerDropdown() {
  const select = document.getElementById('marker-player');
  select.innerHTML = '';
  playersData.forEach(player => {
    const option = document.createElement('option');
    option.value = player.name;
    option.textContent = player.name;
    select.appendChild(option);
  });
}

// Get faction for a player name
function getPlayerFaction(playerName) {
  const player = playersData.find(p => p.name === playerName);
  return player ? player.faction : '';
}

// Load infrastructure data
async function loadInfrastructure() {
  try {
    const response = await fetch('/data/infrastructure.json');
    const data = await response.json();
    infrastructureData = data.infrastructure;
    populateInfrastructureDropdown();
  } catch (error) {
    console.error('Failed to load infrastructure:', error);
  }
}

// Populate infrastructure dropdown
function populateInfrastructureDropdown() {
  const select = document.getElementById('infra-type');
  if (!select) return;

  select.innerHTML = '';
  infrastructureData.forEach(infra => {
    const option = document.createElement('option');
    option.value = infra.name;
    option.textContent = infra.name;
    select.appendChild(option);
  });
}

// Get infrastructure description by name
function getInfrastructureDescription(name) {
  const infra = infrastructureData.find(i => i.name === name);
  return infra ? infra.description : '';
}

// Check if a title matches an infrastructure name
function isInfrastructureName(title) {
  return infrastructureData.some(i => i.name === title);
}

// Load markers from the server
async function loadMarkers() {
  try {
    const response = await fetch('/api/markers');
    markers = await response.json();
    renderMarkers();
  } catch (error) {
    console.error('Failed to load markers:', error);
  }
}

// Load theatres data
async function loadTheatres() {
  try {
    const response = await fetch('/data/theatres.json');
    const data = await response.json();
    theatresData = data.theatres;
    populateTheatreDropdown();
  } catch (error) {
    console.error('Failed to load theatres:', error);
  }
}

// Populate theatre dropdown
function populateTheatreDropdown() {
  const select = document.getElementById('theatre-select');
  select.innerHTML = '<option value="">-- Select a Theatre --</option>';
  theatresData.forEach((theatre, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = theatre.name;
    select.appendChild(option);
  });
}

// Display selected theatre
function displayTheatre(index) {
  const theatre = theatresData[index];
  const content = document.getElementById('theatre-content');

  if (!theatre) {
    content.classList.add('hidden');
    return;
  }

  document.getElementById('theatre-description').textContent = theatre.description;
  document.getElementById('theatre-benefits').textContent = theatre.tacticalBenefits;
  document.getElementById('theatre-terrain').textContent = theatre.recommendedTerrain;

  const twistsContainer = document.getElementById('theatre-twists');
  twistsContainer.innerHTML = theatre.twists.map(twist => `
    <div class="twist-card">
      <div class="twist-header">
        <span class="twist-roll">${twist.roll}</span>
        <span class="twist-name">${escapeHtml(twist.name)}</span>
      </div>
      <p class="twist-flavour">${escapeHtml(twist.flavourText)}</p>
      <p class="twist-rule">${escapeHtml(twist.rule)}</p>
    </div>
  `).join('');

  content.classList.remove('hidden');
}

// Theatre modal functions
function openTheatreModal(markerId = null, x = null, y = null) {
  const modal = document.getElementById('theatre-modal');
  const form = document.getElementById('theatre-form');
  const title = document.getElementById('theatre-modal-title');
  const deleteBtn = document.getElementById('theatre-delete-btn');
  const saveBtn = modal.querySelector('button[type="submit"]');
  const select = document.getElementById('theatre-select');
  const selectGroup = select.closest('.form-group');

  form.reset();
  document.getElementById('theatre-content').classList.add('hidden');

  // Always show form controls when adding/editing
  saveBtn.classList.remove('hidden');
  selectGroup.classList.remove('hidden');

  if (markerId) {
    const marker = markers.find(m => m.id === markerId);
    if (!marker) return;

    title.textContent = 'Edit Theatre';
    document.getElementById('theatre-id').value = marker.id;
    document.getElementById('theatre-x').value = marker.x;
    document.getElementById('theatre-y').value = marker.y;

    // Find the theatre index by name
    const theatreIndex = theatresData.findIndex(t => t.name === marker.title);
    if (theatreIndex >= 0) {
      select.value = theatreIndex;
      displayTheatre(theatreIndex);
    }
    deleteBtn.classList.remove('hidden');
  } else {
    title.textContent = 'Add Theatre';
    document.getElementById('theatre-id').value = '';
    document.getElementById('theatre-x').value = x;
    document.getElementById('theatre-y').value = y;
    deleteBtn.classList.add('hidden');
  }

  modal.classList.remove('hidden');
}

function closeTheatreModal() {
  document.getElementById('theatre-modal').classList.add('hidden');
}

// Handle theatre form submission
async function handleTheatreSubmit(e) {
  e.preventDefault();

  const id = document.getElementById('theatre-id').value;
  const theatreIndex = document.getElementById('theatre-select').value;
  const theatre = theatresData[theatreIndex];

  if (!theatre) return;

  const data = {
    x: parseFloat(document.getElementById('theatre-x').value),
    y: parseFloat(document.getElementById('theatre-y').value),
    title: theatre.name,
    markerType: 'theatre'
  };

  try {
    const url = id ? `/api/markers/${id}` : '/api/markers';
    const method = id ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (response.status === 401) {
      alert('Session expired. Please log in again.');
      isAuthenticated = false;
      updateAuthUI();
      closeTheatreModal();
      return;
    }

    await loadMarkers();
    closeTheatreModal();
  } catch (error) {
    console.error('Failed to save theatre marker:', error);
  }
}

// Handle theatre marker deletion
async function handleTheatreDelete() {
  const id = document.getElementById('theatre-id').value;
  if (!id) return;

  if (!confirm('Are you sure you want to delete this theatre marker?')) return;

  try {
    const response = await fetch(`/api/markers/${id}`, { method: 'DELETE' });

    if (response.status === 401) {
      alert('Session expired. Please log in again.');
      isAuthenticated = false;
      updateAuthUI();
      closeTheatreModal();
      return;
    }

    await loadMarkers();
    closeTheatreModal();
  } catch (error) {
    console.error('Failed to delete theatre marker:', error);
  }
}

// Edit theatre (called from popup)
window.editTheatre = function(id) {
  if (!isAuthenticated) return;
  map.closePopup();
  openTheatreModal(id);
};

// Open theatre view modal (for viewing full theatre info when clicking marker)
function openTheatreViewModal(markerId) {
  const marker = markers.find(m => m.id === markerId);
  if (!marker) return;

  const theatreIndex = theatresData.findIndex(t => t.name === marker.title);
  if (theatreIndex < 0) return;

  const modal = document.getElementById('theatre-modal');
  const title = document.getElementById('theatre-modal-title');
  const deleteBtn = document.getElementById('theatre-delete-btn');
  const saveBtn = modal.querySelector('button[type="submit"]');
  const select = document.getElementById('theatre-select');
  const selectGroup = select.closest('.form-group');

  title.textContent = marker.title;
  document.getElementById('theatre-id').value = marker.id;
  document.getElementById('theatre-x').value = marker.x;
  document.getElementById('theatre-y').value = marker.y;
  select.value = theatreIndex;

  // Display the full theatre info
  displayTheatre(theatreIndex);

  // Show/hide edit controls based on auth
  if (isAuthenticated) {
    deleteBtn.classList.remove('hidden');
    saveBtn.classList.remove('hidden');
    selectGroup.classList.remove('hidden');
  } else {
    deleteBtn.classList.add('hidden');
    saveBtn.classList.add('hidden');
    selectGroup.classList.add('hidden');
  }

  modal.classList.remove('hidden');
}

// Load operations data
async function loadOperations() {
  try {
    const response = await fetch('/data/operations.json');
    const data = await response.json();
    operationsData = data.operations;
    populateOperationsDropdown();
  } catch (error) {
    console.error('Failed to load operations:', error);
  }
}

// Populate operations dropdown
function populateOperationsDropdown() {
  const select = document.getElementById('operations-select');
  operationsData.forEach((operation, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = operation.name;
    select.appendChild(option);
  });
}

// Display selected operation
function displayOperation(index) {
  const operation = operationsData[index];
  const content = document.getElementById('operations-content');

  if (!operation) {
    content.classList.add('hidden');
    return;
  }

  document.getElementById('operations-type').textContent = operation.type;
  document.getElementById('operations-description').textContent = operation.description;

  content.classList.remove('hidden');
}

// Operations modal functions
function openOperationsModal() {
  document.getElementById('operations-modal').classList.remove('hidden');
}

function closeOperationsModal() {
  document.getElementById('operations-modal').classList.add('hidden');
}

// Render all markers on the map
function renderMarkers() {
  markerLayer.clearLayers();

  markers.forEach(marker => {
    const isPwr = isPower(marker);
    const faction = marker.faction || '';
    const colors = getFactionColors(faction);

    let icon;
    if (isPwr) {
      // Power marker - show the power level number
      let powerLevel = marker.powerLevel;
      if (powerLevel === undefined && marker.title) {
        // Extract from title like "Power Level 3"
        const match = marker.title.match(/Power Level (\d)/);
        powerLevel = match ? parseInt(match[1]) : 0;
      }
      powerLevel = powerLevel !== undefined ? powerLevel : 0;
      icon = L.divIcon({
        className: 'custom-marker power-marker',
        html: `<div class="power-number" style="background: ${colors.background}; border-color: ${colors.border};">${powerLevel}</div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });
    } else if (isInfrastructure(marker)) {
      // Infrastructure marker
      icon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="width: 20px; height: 20px; border-radius: 50%; background: ${colors.background}; border: 2px solid ${colors.border};"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });
    } else if (isTheatre(marker)) {
      // Theatre marker - hexagon shape
      icon = L.divIcon({
        className: 'custom-marker theatre-marker',
        html: `<div class="theatre-icon"><svg viewBox="0 0 24 24" fill="#4a90d9"><polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5"/></svg></div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 15]
      });
    } else {
      // Gang marker with faction-specific icon
      const factionIcon = getFactionIcon(faction);
      icon = L.divIcon({
        className: 'custom-marker gang-marker',
        html: `<div style="background: ${colors.background}; border-color: ${colors.border};" class="gang-icon">${factionIcon}</div>`,
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      });
    }

    const leafletMarker = L.marker([marker.y, marker.x], { icon })
      .addTo(markerLayer);

    // Theatre markers open modal on click, others show popup
    if (isTheatre(marker)) {
      leafletMarker.on('click', () => {
        openTheatreViewModal(marker.id);
      });
    } else {
      leafletMarker.bindPopup(createPopupContent(marker));
    }

    leafletMarker.markerId = marker.id;
  });
}

// Check if marker is infrastructure (by type or by title)
function isInfrastructure(marker) {
  if (marker.markerType === 'infrastructure') return true;
  // Fallback: check if title matches an infrastructure type
  return isInfrastructureName(marker.title);
}

// Check if marker is power
function isPower(marker) {
  if (marker.markerType === 'power') return true;
  // Fallback: check if title starts with "Power Level"
  return marker.title && marker.title.startsWith('Power Level');
}

// Check if marker is theatre
function isTheatre(marker) {
  if (marker.markerType === 'theatre') return true;
  // Fallback: check if title matches a theatre name
  return theatresData && theatresData.some(t => t.name === marker.title);
}

// Get theatre data by name
function getTheatreByName(name) {
  if (!theatresData) return null;
  return theatresData.find(t => t.name === name);
}

// Create popup HTML content
function createPopupContent(marker) {
  const isInfra = isInfrastructure(marker);
  const isPwr = isPower(marker);
  const isThtr = isTheatre(marker);
  const faction = marker.faction || '';
  const colors = getFactionColors(faction);

  let editFunction = 'editMarker';
  if (isInfra) editFunction = 'editInfrastructure';
  if (isPwr) editFunction = 'editPower';
  if (isThtr) editFunction = 'editTheatre';

  const editButton = isAuthenticated
    ? `<button class="popup-edit" onclick="${editFunction}('${marker.id}')">Edit</button>`
    : '';

  const factionBadge = faction ? `<span class="popup-faction" style="background: ${colors.background};">${escapeHtml(faction)}</span>` : '';

  if (isPwr) {
    let powerLevel = marker.powerLevel;
    if (powerLevel === undefined && marker.title) {
      const match = marker.title.match(/Power Level (\d)/);
      powerLevel = match ? parseInt(match[1]) : 0;
    }
    powerLevel = powerLevel !== undefined ? powerLevel : 0;
    return `
      <div class="popup-title">Power Level ${powerLevel}</div>
      ${factionBadge}
      <div class="popup-description power-description">${POWER_DESCRIPTION.replace(/\n/g, '<br>')}</div>
      ${editButton}
    `;
  }

  if (isInfra) {
    const rule = getInfrastructureDescription(marker.title);
    return `
      <div class="popup-title">${escapeHtml(marker.title)}</div>
      ${factionBadge}
      ${rule ? `<div class="popup-rule">${rule}</div>` : ''}
      ${editButton}
    `;
  }

  if (isThtr) {
    const theatre = getTheatreByName(marker.title);
    return `
      <div class="popup-title">${escapeHtml(marker.title)}</div>
      <span class="popup-faction" style="background: #4a90d9;">Theatre</span>
      ${theatre ? `<div class="popup-description">${escapeHtml(theatre.description)}</div>` : ''}
      ${editButton}
    `;
  }

  return `
    <div class="popup-title">${escapeHtml(marker.title)}</div>
    ${factionBadge}
    ${marker.description ? `<div class="popup-description">${escapeHtml(marker.description)}</div>` : ''}
    ${editButton}
  `;
}

// Utility functions
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

// Set up event listeners
function setupEventListeners() {
  // Operations reference
  document.getElementById('operations-btn').addEventListener('click', openOperationsModal);
  document.getElementById('operations-close-btn').addEventListener('click', closeOperationsModal);
  document.getElementById('operations-select').addEventListener('change', (e) => {
    const index = e.target.value;
    if (index !== '') {
      displayOperation(parseInt(index));
    } else {
      document.getElementById('operations-content').classList.add('hidden');
    }
  });

  // Login
  document.getElementById('login-btn').addEventListener('click', showLoginModal);
  document.getElementById('login-form').addEventListener('submit', handleLogin);
  document.getElementById('login-cancel-btn').addEventListener('click', hideLoginModal);

  // Logout
  document.getElementById('logout-btn').addEventListener('click', handleLogout);

  // Add gang marker
  document.getElementById('add-marker-btn').addEventListener('click', () => toggleAddMode('gang'));

  // Add infrastructure
  document.getElementById('add-infra-btn').addEventListener('click', () => toggleAddMode('infrastructure'));

  // Add power
  document.getElementById('add-power-btn').addEventListener('click', () => toggleAddMode('power'));

  // Add theatre
  document.getElementById('add-theatre-btn').addEventListener('click', () => toggleAddMode('theatre'));

  // Cancel add mode
  document.getElementById('cancel-add').addEventListener('click', () => toggleAddMode(null));

  // Map click
  map.on('click', handleMapClick);

  // Gang marker form
  document.getElementById('marker-form').addEventListener('submit', handleFormSubmit);
  document.getElementById('cancel-btn').addEventListener('click', closeMarkerModal);
  document.getElementById('delete-btn').addEventListener('click', handleDelete);

  // Infrastructure form
  document.getElementById('infra-form').addEventListener('submit', handleInfraSubmit);
  document.getElementById('infra-cancel-btn').addEventListener('click', closeInfraModal);
  document.getElementById('infra-delete-btn').addEventListener('click', handleInfraDelete);

  // Infrastructure type change - show rule
  document.getElementById('infra-type').addEventListener('change', updateInfraRuleDisplay);

  // Power form
  document.getElementById('power-form').addEventListener('submit', handlePowerSubmit);
  document.getElementById('power-cancel-btn').addEventListener('click', closePowerModal);
  document.getElementById('power-delete-btn').addEventListener('click', handlePowerDelete);

  // Theatre form
  document.getElementById('theatre-form').addEventListener('submit', handleTheatreSubmit);
  document.getElementById('theatre-close-btn').addEventListener('click', closeTheatreModal);
  document.getElementById('theatre-cancel-btn').addEventListener('click', closeTheatreModal);
  document.getElementById('theatre-delete-btn').addEventListener('click', handleTheatreDelete);
  document.getElementById('theatre-select').addEventListener('change', (e) => {
    const index = e.target.value;
    if (index !== '') {
      displayTheatre(parseInt(index));
    } else {
      document.getElementById('theatre-content').classList.add('hidden');
    }
  });
}

// Update infrastructure rule display
function updateInfraRuleDisplay() {
  const infraType = document.getElementById('infra-type').value;
  const ruleDisplay = document.getElementById('infra-rule-display');
  const rule = getInfrastructureDescription(infraType);
  ruleDisplay.textContent = rule || '';
}

// Login modal
function showLoginModal() {
  document.getElementById('login-modal').classList.remove('hidden');
  document.getElementById('login-username').focus();
}

function hideLoginModal() {
  document.getElementById('login-modal').classList.add('hidden');
  document.getElementById('login-form').reset();
  document.getElementById('login-error').classList.add('hidden');
}

async function handleLogin(e) {
  e.preventDefault();

  const username = document.getElementById('login-username').value;
  const password = document.getElementById('login-password').value;
  const errorDiv = document.getElementById('login-error');

  try {
    const response = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    if (response.ok) {
      const data = await response.json();
      isAuthenticated = true;
      updateAuthUI(data.username);
      hideLoginModal();
    } else {
      errorDiv.textContent = 'Invalid username or password';
      errorDiv.classList.remove('hidden');
    }
  } catch (error) {
    errorDiv.textContent = 'Login failed. Please try again.';
    errorDiv.classList.remove('hidden');
  }
}

async function handleLogout() {
  try {
    await fetch('/api/logout', { method: 'POST' });
    isAuthenticated = false;
    updateAuthUI();

    // Exit add mode if active
    if (addMode) {
      toggleAddMode(null);
    }
  } catch (error) {
    console.error('Logout failed:', error);
  }
}

// Toggle add mode
function toggleAddMode(mode) {
  if (!isAuthenticated) return;

  // If clicking same mode, turn it off
  if (addMode === mode) {
    mode = null;
  }

  addMode = mode;

  // Update button states
  document.getElementById('add-marker-btn').classList.toggle('active', addMode === 'gang');
  document.getElementById('add-infra-btn').classList.toggle('active', addMode === 'infrastructure');
  document.getElementById('add-power-btn').classList.toggle('active', addMode === 'power');
  document.getElementById('add-theatre-btn').classList.toggle('active', addMode === 'theatre');

  // Update instructions
  const instructions = document.getElementById('instructions');
  const instructionsText = document.getElementById('instructions-text');

  if (addMode) {
    instructions.classList.remove('hidden');
    if (addMode === 'gang') {
      instructionsText.textContent = 'Click on the map to place a gang marker';
    } else if (addMode === 'infrastructure') {
      instructionsText.textContent = 'Click on the map to place infrastructure';
    } else if (addMode === 'power') {
      instructionsText.textContent = 'Click on the map to place a power marker';
    } else if (addMode === 'theatre') {
      instructionsText.textContent = 'Click on the map to place a theatre marker';
    }
    map.getContainer().style.cursor = 'crosshair';
  } else {
    instructions.classList.add('hidden');
    map.getContainer().style.cursor = '';
  }
}

// Handle map clicks
function handleMapClick(e) {
  if (!addMode || !isAuthenticated) return;

  const { lat: y, lng: x } = e.latlng;

  if (addMode === 'gang') {
    openMarkerModal(null, x, y);
  } else if (addMode === 'infrastructure') {
    openInfraModal(null, x, y);
  } else if (addMode === 'power') {
    openPowerModal(null, x, y);
  } else if (addMode === 'theatre') {
    openTheatreModal(null, x, y);
  }

  toggleAddMode(null);
}

// Gang Marker modal
function openMarkerModal(markerId = null, x = null, y = null) {
  const modal = document.getElementById('marker-modal');
  const form = document.getElementById('marker-form');
  const title = document.getElementById('modal-title');
  const deleteBtn = document.getElementById('delete-btn');

  form.reset();

  if (markerId) {
    const marker = markers.find(m => m.id === markerId);
    if (!marker) return;

    title.textContent = 'Edit Gang';
    document.getElementById('marker-id').value = marker.id;
    document.getElementById('marker-x').value = marker.x;
    document.getElementById('marker-y').value = marker.y;
    document.getElementById('marker-player').value = marker.title;
    document.getElementById('marker-description').value = marker.description || '';
    deleteBtn.classList.remove('hidden');
  } else {
    title.textContent = 'Add Gang';
    document.getElementById('marker-id').value = '';
    document.getElementById('marker-x').value = x;
    document.getElementById('marker-y').value = y;
    deleteBtn.classList.add('hidden');
  }

  modal.classList.remove('hidden');
}

function closeMarkerModal() {
  document.getElementById('marker-modal').classList.add('hidden');
}

// Handle gang form submission
async function handleFormSubmit(e) {
  e.preventDefault();

  const id = document.getElementById('marker-id').value;
  const player = document.getElementById('marker-player').value;
  const data = {
    x: parseFloat(document.getElementById('marker-x').value),
    y: parseFloat(document.getElementById('marker-y').value),
    title: player,
    faction: getPlayerFaction(player),
    description: document.getElementById('marker-description').value,
    markerType: 'gang'
  };

  try {
    const url = id ? `/api/markers/${id}` : '/api/markers';
    const method = id ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (response.status === 401) {
      alert('Session expired. Please log in again.');
      isAuthenticated = false;
      updateAuthUI();
      closeMarkerModal();
      return;
    }

    await loadMarkers();
    closeMarkerModal();
  } catch (error) {
    console.error('Failed to save marker:', error);
  }
}

// Handle gang marker deletion
async function handleDelete() {
  const id = document.getElementById('marker-id').value;
  if (!id) return;

  if (!confirm('Are you sure you want to delete this gang marker?')) return;

  try {
    const response = await fetch(`/api/markers/${id}`, { method: 'DELETE' });

    if (response.status === 401) {
      alert('Session expired. Please log in again.');
      isAuthenticated = false;
      updateAuthUI();
      closeMarkerModal();
      return;
    }

    await loadMarkers();
    closeMarkerModal();
  } catch (error) {
    console.error('Failed to delete marker:', error);
  }
}

// Infrastructure modal
function openInfraModal(markerId = null, x = null, y = null) {
  const modal = document.getElementById('infra-modal');
  const form = document.getElementById('infra-form');
  const title = document.getElementById('infra-modal-title');
  const deleteBtn = document.getElementById('infra-delete-btn');

  form.reset();

  if (markerId) {
    const marker = markers.find(m => m.id === markerId);
    if (!marker) return;

    title.textContent = 'Edit Infrastructure';
    document.getElementById('infra-id').value = marker.id;
    document.getElementById('infra-x').value = marker.x;
    document.getElementById('infra-y').value = marker.y;
    document.getElementById('infra-type').value = marker.title;
    document.getElementById('infra-alliance').value = marker.faction || 'imperium';
    deleteBtn.classList.remove('hidden');
  } else {
    title.textContent = 'Add Infrastructure';
    document.getElementById('infra-id').value = '';
    document.getElementById('infra-x').value = x;
    document.getElementById('infra-y').value = y;
    deleteBtn.classList.add('hidden');
  }

  updateInfraRuleDisplay();
  modal.classList.remove('hidden');
}

function closeInfraModal() {
  document.getElementById('infra-modal').classList.add('hidden');
}

// Handle infrastructure form submission
async function handleInfraSubmit(e) {
  e.preventDefault();

  const id = document.getElementById('infra-id').value;
  const data = {
    x: parseFloat(document.getElementById('infra-x').value),
    y: parseFloat(document.getElementById('infra-y').value),
    title: document.getElementById('infra-type').value,
    faction: document.getElementById('infra-alliance').value,
    markerType: 'infrastructure'
  };

  try {
    const url = id ? `/api/markers/${id}` : '/api/markers';
    const method = id ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (response.status === 401) {
      alert('Session expired. Please log in again.');
      isAuthenticated = false;
      updateAuthUI();
      closeInfraModal();
      return;
    }

    await loadMarkers();
    closeInfraModal();
  } catch (error) {
    console.error('Failed to save infrastructure:', error);
  }
}

// Handle infrastructure deletion
async function handleInfraDelete() {
  const id = document.getElementById('infra-id').value;
  if (!id) return;

  if (!confirm('Are you sure you want to delete this infrastructure?')) return;

  try {
    const response = await fetch(`/api/markers/${id}`, { method: 'DELETE' });

    if (response.status === 401) {
      alert('Session expired. Please log in again.');
      isAuthenticated = false;
      updateAuthUI();
      closeInfraModal();
      return;
    }

    await loadMarkers();
    closeInfraModal();
  } catch (error) {
    console.error('Failed to delete infrastructure:', error);
  }
}

// Edit marker (called from popup)
window.editMarker = function(id) {
  if (!isAuthenticated) return;
  map.closePopup();
  openMarkerModal(id);
};

// Edit infrastructure (called from popup)
window.editInfrastructure = function(id) {
  if (!isAuthenticated) return;
  map.closePopup();
  openInfraModal(id);
};

// Power modal
function openPowerModal(markerId = null, x = null, y = null) {
  const modal = document.getElementById('power-modal');
  const form = document.getElementById('power-form');
  const title = document.getElementById('power-modal-title');
  const deleteBtn = document.getElementById('power-delete-btn');

  form.reset();

  if (markerId) {
    const marker = markers.find(m => m.id === markerId);
    if (!marker) return;

    // Extract power level from marker or from title
    let powerLevel = marker.powerLevel;
    if (powerLevel === undefined && marker.title) {
      const match = marker.title.match(/Power Level (\d)/);
      powerLevel = match ? parseInt(match[1]) : 0;
    }
    powerLevel = powerLevel !== undefined ? powerLevel : 0;

    title.textContent = 'Edit Power';
    document.getElementById('power-id').value = marker.id;
    document.getElementById('power-x').value = marker.x;
    document.getElementById('power-y').value = marker.y;
    document.getElementById('power-level').value = powerLevel;
    document.getElementById('power-alliance').value = marker.faction || 'imperium';
    deleteBtn.classList.remove('hidden');
  } else {
    title.textContent = 'Add Power';
    document.getElementById('power-id').value = '';
    document.getElementById('power-x').value = x;
    document.getElementById('power-y').value = y;
    deleteBtn.classList.add('hidden');
  }

  modal.classList.remove('hidden');
}

function closePowerModal() {
  document.getElementById('power-modal').classList.add('hidden');
}

// Handle power form submission
async function handlePowerSubmit(e) {
  e.preventDefault();

  const id = document.getElementById('power-id').value;
  const powerLevel = parseInt(document.getElementById('power-level').value);
  const data = {
    x: parseFloat(document.getElementById('power-x').value),
    y: parseFloat(document.getElementById('power-y').value),
    title: `Power Level ${powerLevel}`,
    powerLevel: powerLevel,
    faction: document.getElementById('power-alliance').value,
    markerType: 'power'
  };

  try {
    const url = id ? `/api/markers/${id}` : '/api/markers';
    const method = id ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (response.status === 401) {
      alert('Session expired. Please log in again.');
      isAuthenticated = false;
      updateAuthUI();
      closePowerModal();
      return;
    }

    await loadMarkers();
    closePowerModal();
  } catch (error) {
    console.error('Failed to save power marker:', error);
  }
}

// Handle power deletion
async function handlePowerDelete() {
  const id = document.getElementById('power-id').value;
  if (!id) return;

  if (!confirm('Are you sure you want to delete this power marker?')) return;

  try {
    const response = await fetch(`/api/markers/${id}`, { method: 'DELETE' });

    if (response.status === 401) {
      alert('Session expired. Please log in again.');
      isAuthenticated = false;
      updateAuthUI();
      closePowerModal();
      return;
    }

    await loadMarkers();
    closePowerModal();
  } catch (error) {
    console.error('Failed to delete power marker:', error);
  }
}

// Edit power (called from popup)
window.editPower = function(id) {
  if (!isAuthenticated) return;
  map.closePopup();
  openPowerModal(id);
};

// Initialize
document.addEventListener('DOMContentLoaded', initMap);
