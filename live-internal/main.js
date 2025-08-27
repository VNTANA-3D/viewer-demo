import {request, baseURL, token} from './request.js';
import {VntanaViewer} from "https://cdn.jsdelivr.net/npm/@vntana/viewer/dist/bundle.js";

const email = "<username>";
const password = "<password>";
const organizationSlug = "<organization-slug>";
const workspaceSlug = "<workspace-slug>";
const productUuid = "<product-uuid>";

await request("/auth/login", "POST", {}, {email, password});

const organizations = (await request("/organizations", "GET")).grid;
const organization = organizations.find(org => org.slug === organizationSlug);

if (!organization) {
  throw new Error(`Organization ${organizationSlug} not found`);
}

const {
  role: organizationRole,
  uuid: organizationUuid,
} = organization;

await request("/auth/refresh-token", "GET", {organizationUuid});

const workspaces = (await request("/clients/client-organizations", "GET")).grid;
const workspace = workspaces.find(workspace => workspace.slug === workspaceSlug);

if (!workspace) {
  throw new Error(`Workspace ${workspaceSlug} not found`);
}

const {
  uuid: workspaceUuid,
} = workspace;

if (organizationRole !== "ORGANIZATION_OWNER" && organizationRole !== "ORGANIZATION_ADMIN") {
  await request("/auth/refresh-token", "GET", {clientUuid: workspaceUuid});
}

const response = await request(`/products/${productUuid}`, "GET");
const src = `${baseURL}/products/${productUuid}/download/model?clientUuid=${workspaceUuid}&conversionFormat=GLB`;
const viewerConfig = JSON.parse(response.viewerSettings.config);

VntanaViewer.setModelRequestHeaders({
  "X-AUTH-TOKEN": `Bearer ${token}`,
});

const viewer = document.querySelector("vntana-viewer");
Object.assign(viewer, viewerConfig);
Object.assign(viewer, {
  src,
});
