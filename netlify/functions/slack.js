exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const { token, path, params } = JSON.parse(event.body);
  const query = new URLSearchParams(params).toString();
  const url = `https://slack.com/api/${path}?${query}`;

  const resp = await fetch(url, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const data = await resp.json();

  return { statusCode: 200, headers, body: JSON.stringify(data) };
};
