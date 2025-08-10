const organizationSlug = "asset-library";
const workspaceSlug = "furniture";
const productUuid = "85a51c7b-07c1-4143-bd56-aa2a43acaa42";

const baseUrl = `https://api.vntana.com`;
const endpoint = `/products/${productUuid}/organizations/${organizationSlug}/clients/${workspaceSlug}`
const {response, errors} = await fetch(`${baseUrl}${endpoint}`).then(response => response.json());

if (errors.length > 0) {
  throw new Error(errors);
}

const models = response.asset.models;
const getModelURL = format => {
  const id = models.find(model => model.conversionFormat === format).modelBlobId;
  return `${baseUrl}/assets/products/${productUuid}/organizations/${organizationSlug}/clients/${workspaceSlug}/${id}`;
}

const src = getModelURL("GLB");
const usdzSrc = getModelURL("USDZ");

const poster = `${baseUrl}/assets/thumbnail/products/${productUuid}/organizations/${organizationSlug}/clients/${workspaceSlug}/`;
const qrUrl = `https://embed.vntana.com?productUuid=${productUuid}&clientSlug=${workspaceSlug}&organizationSlug=${organizationSlug}&autoAR=true`;

const viewerConfig = JSON.parse(response.viewerSettings.config);

const viewer = document.querySelector("vntana-viewer");
Object.assign(viewer, viewerConfig);
Object.assign(viewer, {
  src,
  usdzSrc,
  poster,
});

const qrButton = viewer.querySelector("vntana-qr-button");
qrButton.url = qrUrl;
