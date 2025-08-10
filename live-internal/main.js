import {Platform} from './platform.js';
import {VntanaViewer} from "https://cdn.jsdelivr.net/npm/@vntana/viewer/dist/bundle.js";

const email = "<username>";
const password = "<password>";
const organizationSlug = "<organization-slug>";
const workspaceSlug = "<workspace-slug>";
const productUuid = "<product-uuid>";

const platform = new Platform();
await platform.login(email, password);

const organizations = await platform.getOrganizations();
const organization = organizations.find(org => org.slug === organizationSlug);
const {
  role: organizationRole,
  uuid: organizationUuid,
} = organization;

await platform.refreshToken(organizationUuid);

const workspaces = await platform.getWorkspaces();
const workspace = workspaces.find(workspace => workspace.slug === workspaceSlug);
const {
  uuid: workspaceUuid,
} = workspace;

if (organizationRole !== "ORGANIZATION_OWNER" && organizationRole !== "ORGANIZATION_ADMIN") {
  await platform.refreshToken(undefined, workspace.uuid);
}

const product = await platform.getProduct(productUuid);
const viewerConfig = JSON.parse(product.viewerSettings.config);
const src = platform.getModelURL(workspaceUuid, productUuid);

VntanaViewer.setModelRequestHeaders(platform.getHeaders());

const config = {
  src,
  ...viewerConfig,
};

const viewer = document.querySelector("vntana-viewer");
Object.assign(viewer, config);
