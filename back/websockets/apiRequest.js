const routeApi = "https://api.play2learn.pro/api";

async function apiRequest(endpoint, token = null, method = "GET", body = null) {
  try {
    const options = {
      method,
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      //   credentials: "include",
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${routeApi}${endpoint}`, options);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error en la respuesta: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error en la petición a ${endpoint}:`, error.message);
    throw error;
  }
}

module.exports = apiRequest
