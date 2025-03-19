import Cookies from "js-cookie";

const routeApi: string =
  (process.env.API_LARAVEL_URL || "http://127.0.0.1:8000/api");

export async function apiRequest(
  endpoint: string,
  method: string = "GET",
  body: any = null
): Promise<any> {
  try {
    let token: string | undefined;
    
    // Solo ejecutar js-cookie en el cliente
    if (typeof window !== 'undefined') {
      token = Cookies.get("authToken");
    }

    const options: RequestInit = {
      method,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      //   credentials: "include",
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(`${routeApi}${endpoint}`, options);

    if (!response.ok) {
      const errorData: any = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error en la respuesta: ${response.status}`);
    }

    return await response.json();
  } catch (error: any) {
    console.error(`Error en la petición a ${endpoint}:`, error.message);
    throw error;
  }
}
