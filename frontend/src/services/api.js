const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

async function handleResponse(response) {
  if (!response.ok) {
    let errorMsg = `HTTP ${response.status}`;
    try {
      const data = await response.json();
      if (data && data.detail) errorMsg = data.detail;
      else if (data && data.error) errorMsg = data.error;
    } catch (_) {}
    throw new Error(errorMsg);
  }
  return response.json();
}

export const api = {
  async getEvents() {
    const res = await fetch(`${BASE_URL}/api/events`);
    return handleResponse(res);
  },

  async getEventById(id) {
    const res = await fetch(`${BASE_URL}/api/events/${encodeURIComponent(id)}`);
    return handleResponse(res);
  },

  async getSources() {
    const res = await fetch(`${BASE_URL}/api/sources`);
    return handleResponse(res);
  },

  async getTeam() {
    const res = await fetch(`${BASE_URL}/api/team`);
    return handleResponse(res);
  },

  async getSteps() {
    const res = await fetch(`${BASE_URL}/api/steps`);
    return handleResponse(res);
  },

  async submitFeedback({ name, message }) {
    const res = await fetch(`${BASE_URL}/api/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name, message })
    });
    return handleResponse(res);
  }
};
