const organizationSlug = "asset-library";
const workspaceSlug = "furniture";
const productUuid = "85a51c7b-07c1-4143-bd56-aa2a43acaa42";

const baseUrl = `https://api.vntana.com`;
const productUrl = `${baseUrl}/products/${productUuid}/organizations/${organizationSlug}/clients/${workspaceSlug}`
const productData = await fetch(productUrl).then(response => response.json());

if (productData.errors.length > 0) {
  throw new Error(productData.errors);
}

const models = productData.response.asset.models;
const glbId = models.find(model => model.conversionFormat === "GLB")?.modelBlobId || "";
const usdzId = models.find(model => model.conversionFormat === "USDZ")?.modelBlobId || "";

const src = `${baseUrl}/assets/products/${productUuid}/organizations/${organizationSlug}/clients/${workspaceSlug}/${glbId}`;
const usdzSrc = `${baseUrl}/assets/products/${productUuid}/organizations/${organizationSlug}/clients/${workspaceSlug}/${usdzId}`;
const poster = `${baseUrl}/assets/thumbnail/products/${productUuid}/organizations/${organizationSlug}/clients/${workspaceSlug}/`;
const qrUrl = `https://embed.vntana.com?productUuid=${productUuid}&clientSlug=${workspaceSlug}&organizationSlug=${organizationSlug}&autoAR=true`;

const config = JSON.parse(productData.response.viewerSettings.config);

const viewerConfig = {
  ...config,
  src,
  usdzSrc,
  poster,
};

const viewer = document.querySelector("vntana-viewer");
Object.assign(viewer, viewerConfig);

const qrButton = viewer.querySelector("vntana-qr-button");
qrButton.url = qrUrl;
