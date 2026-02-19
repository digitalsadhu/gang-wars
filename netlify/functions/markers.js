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

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`JSONBin fetch failed: ${response.status} - ${error}`);
  }

  const data = await response.json();
  console.log('JSONBin response:', JSON.stringify(data));
  return data.record?.markers || [];
}

async function saveMarkers(markers) {
  const response = await fetch(JSONBIN_URL, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Master-Key': JSONBIN_API_KEY
    },
    body: JSON.stringify({ markers })
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`JSONBin save failed: ${response.status} - ${error}`);
  }

  return response.json();
}

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    // GET - return all markers
    if (event.httpMethod === 'GET') {
      // Debug mode - add ?debug=1 to see raw JSONBin response
      if (event.queryStringParameters?.debug) {
        const response = await fetch(JSONBIN_URL + '/latest', {
          headers: { 'X-Master-Key': JSONBIN_API_KEY }
        });
        const data = await response.json();
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ binId: JSONBIN_BIN_ID, raw: data })
        };
      }

      const markers = await getMarkers();
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(markers)
      };
    }

    // POST - create new marker (requires auth)
    if (event.httpMethod === 'POST') {
      if (!isAuthenticated(event)) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: 'Unauthorized' })
        };
      }

      const { x, y, title, description, faction } = JSON.parse(event.body);
      const markers = await getMarkers();

      const newMarker = {
        id: Date.now().toString(),
        x,
        y,
        title: title || 'Unnamed Gang',
        description: description || '',
        faction: faction || 'imperium',
        createdAt: new Date().toISOString()
      };

      markers.push(newMarker);
      await saveMarkers(markers);

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(newMarker)
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
