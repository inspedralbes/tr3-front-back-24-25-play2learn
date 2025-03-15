import Cookies from "js-cookie";

const routeApi: string =
  (process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000/api/");

export async function apiRequest(
  endpoint: string,
  method: string = "GET",
  body: any = null
): Promise<any> {
  try {
    let token: string | undefined = undefined;

    if (typeof window !== "undefined") {
      // Estamos en el cliente
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

    const cleanEndpoint: string = endpoint.replace(/^\/+|\/+$/g, "");
    const url: string = `${routeApi}${cleanEndpoint}`;

    console.log("URL de la solicitud:", url);
    console.log("Opciones de la solicitud:", options);

    const response = await fetch(url, options);

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
