/**
 * Serverless Function - LeadRat CRM Proxy
 * Forwarding endpoint for LeadRat CRM API
 */

export async function handler(event, context) {
  // CORS & Method check
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS'
      },
      body: ''
    };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };
  }

  const apiKey = process.env.LEADRAT_API_KEY || 'N2FmNjU3ZmItNmY3OC00MTc4LTg0ZGQtOWIwNDZmYTQ0Mjlm';

  try {
    let leadPayload;
    try {
      leadPayload = JSON.parse(event.body);
    } catch (parseError) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ error: 'Invalid JSON payload format in request body' })
      };
    }

    console.log('Sending lead payload to LeadRat CRM:', JSON.stringify(leadPayload));

    const response = await fetch('https://connect.leadrat.com/api/v1/integration/Website', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'API-Key': apiKey,
        'X-API-Key': apiKey
      },
      body: JSON.stringify(leadPayload)
    });


    const responseText = await response.text();
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      responseData = responseText;
    }

    if (!response.ok) {
      console.error(`LeadRat API returned HTTP status ${response.status}:`, responseData);
      return {
        statusCode: response.status,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          error: 'LeadRat CRM API Error',
          status: response.status,
          details: responseData
        })
      };
    }

    console.log('LeadRat CRM submission successful:', responseData);

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        data: responseData
      })
    };
  } catch (err) {
    console.error('LeadRat Serverless Handler Error:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ error: err.message || 'Internal Server Error' })
    };
  }
}
