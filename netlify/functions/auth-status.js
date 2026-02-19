const ADMIN_USER = process.env.ADMIN_USER || 'admin';
const ADMIN_PASS = process.env.ADMIN_PASS || 'vespator2024';
const AUTH_TOKEN = Buffer.from(`${ADMIN_USER}:${ADMIN_PASS}`).toString('base64');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const cookie = event.headers.cookie || '';
  const authenticated = cookie.includes(`auth=${AUTH_TOKEN}`);

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      authenticated,
      username: authenticated ? ADMIN_USER : null
    })
  };
};
