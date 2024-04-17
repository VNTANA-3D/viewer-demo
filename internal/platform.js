const baseURL = `https://api-platform.vntana.com/v1`;

export class Platform {
  #token = "";

  get token() {
    return this.#token;
  }

  // REQUESTS
  
  async genericRequest(endpoint, method, headers = {}, body) {
    const options = {
      method,
      headers: JSON.parse(JSON.stringify(headers)),     // remove undefined properties
    };

    if (body) {
      options.body = JSON.stringify(body); 
      options.headers["Content-Type"] = "application/json";
    }

    if (this.token) {
      options.headers["X-AUTH-TOKEN"] = `Bearer ${this.token}`; 
    }

    const data = await fetch(baseURL + endpoint, options);

    if (data.headers.has("X-AUTH-TOKEN")) {
      this.#token = data.headers.get("X-AUTH-TOKEN");
    }

    return data;
  }

  async request(endpoint, method, headers = {}, body) {
    let response;

    try {
      response = await this.genericRequest(endpoint, method, headers, body);
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

  async blobRequest(endpoint, method, headers = {}, body) {
    let response;

    try {
      response = await this.genericRequest(endpoint, method, headers, body);
      return response.blob();
    } catch (error) {
      const responseData = response ? `${response.status} ${response.statusText}` : "";
      throw new Error(`${endpoint}: ${responseData}: ${error}`);
    }
  }

  // LOGIN
  
  async login(email, password) {
    return this.request("/auth/login", "POST", {}, {email, password});
  }

  async loginToken(token) {
    return this.request("/auth/login/token", "POST", {}, {"personal-access-token": token});
  }

  async refreshToken(organizationUuid, clientUuid) {
    const headers  = JSON.parse(JSON.stringify({
      organizationUuid,
      clientUuid,
    }));

    return this.request("/auth/refresh-token", "GET", headers);
  }

  // ENTITIES
  
  async getOrganizations() {
    return (await this.request("/organizations", "GET")).grid;
  }

  async getWorkspaces() {
    return (await this.request("/clients/client-organizations", "GET")).grid;
  }

  async getProduct(uuid) {
    return this.request(`/products/${uuid}`, "GET");
  }

  getModelURL(workspaceUuid, productUuid) {
      return `${baseURL}/products/${productUuid}/download/model?clientUuid=${workspaceUuid}&conversionFormat=GLB`
  }

  getHeaders() {
    return {
      "X-AUTH-TOKEN": `Bearer ${this.token}`,
    };
  }

  async getPresets(workspaceUuid) {
    return (await this.request(`/viewer-presets/by-organization`, "GET", {clientUuid: workspaceUuid})).grid;
  }
}
