exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const token = process.env.SLACK_BOT_TOKEN;
  const channelId = process.env.SLACK_CHANNEL_ID;

  if (!token || !channelId) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'SLACK_BOT_TOKEN or SLACK_CHANNEL_ID not configured' })
    };
  }

  try {
    const resp = await fetch(`https://slack.com/api/conversations.history?channel=${channelId}&limit=200`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await resp.json();
    if (!data.ok) throw new Error(data.error || 'Slack API error');
    return { statusCode: 200, headers, body: JSON.stringify({ messages: data.messages || [] }) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
  }
};
