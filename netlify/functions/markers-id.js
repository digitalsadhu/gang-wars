const JSONBIN_BIN_ID = process.env.JSONBIN_BIN_ID;
const JSONBIN_API_KEY = process.env.JSONBIN_API_KEY;
const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;

const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'vespator2024';
const AUTH_TOKEN = Buffer.from(`${ADMIN_USER}:${ADMIN_PASS}`).toString('base64');

function isAuthenticated(event) {
  const cookie = event.headers.cookie || '';
  return cookie.includes(`auth=${AUTH_TOKEN}`);
}

async function getMarkers() {
  const response = await fetch(JSONBIN_URL + '/latest', {
    headers: { 'X-Master-Key': JSONBIN_API_KEY }
  });
  const data = await response.json();
  return data.record?.markers || [];
}

async function saveMarkers(markers) {
  await fetch(JSONBIN_URL, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Master-Key': JSONBIN_API_KEY
    },
    body: JSON.stringify({ markers })
  });
}

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Extract marker ID from path
  const pathParts = event.path.split('/');
  const id = pathParts[pathParts.length - 1];

  if (!isAuthenticated(event)) {
    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({ error: 'Unauthorized' })
    };
  }

  try {
    const markers = await getMarkers();
    const index = markers.findIndex(m => m.id === id);

    // PUT - update marker
    if (event.httpMethod === 'PUT') {
      if (index === -1) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Marker not found' })
        };
      }

      const updates = JSON.parse(event.body);
      markers[index] = { ...markers[index], ...updates };
      await saveMarkers(markers);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(markers[index])
      };
    }

    // DELETE - remove marker
    if (event.httpMethod === 'DELETE') {
      if (index === -1) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ error: 'Marker not found' })
        };
      }

      markers.splice(index, 1);
      await saveMarkers(markers);

      return {
        statusCode: 204,
        headers,
        body: ''
      };
    }

    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error', details: error.message })
    };
  }
};
