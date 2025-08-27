export const baseURL = `https://api-platform.vntana.com/v1`;
export let token = "";

export async function request(endpoint, method, headers = {}, body = undefined) {
  let response;

  try {
    const options = {
      method,
      headers: JSON.parse(JSON.stringify(headers)),     // remove undefined properties
    };

    if (body) {
      options.body = JSON.stringify(body); 
      options.headers["Content-Type"] = "application/json";
    }

    if (token) {
      options.headers["X-AUTH-TOKEN"] = `Bearer ${token}`; 
    }

    const response = await fetch(baseURL + endpoint, options);

    if (response.headers.has("X-AUTH-TOKEN")) {
      token = response.headers.get("X-AUTH-TOKEN");
    }

    const result = await response.json();

    if (result.errors.length > 0) {
      throw new Error(result.errors);
    }

    return result.response;
  } catch (error) {
    const responseData = response ? `${response.status} ${response.statusText}` : "";
    throw new Error(`${endpoint}: ${responseData}: ${error}`);
  }
}
