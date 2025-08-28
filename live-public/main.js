const organizationSlug = "asset-library";
const workspaceSlug = "viewer-demo";
const productUuid = "db656517-2842-4e64-a3de-743acee9ff9d";

const baseUrl = `https://api.vntana.com`;
const productEndpoint = `/products/${productUuid}/organizations/${organizationSlug}/clients/${workspaceSlug}`
const productRequest = fetch(`${baseUrl}${productEndpoint}`);
const product = await productRequest.then(response => response.json());

if (product.errors.length > 0) {
  throw new Error(product.errors);
}

const models = product.response.asset.models;
const getModelURL = format => {
  const id = models.find(model => model.conversionFormat === format).modelBlobId;
  return `${baseUrl}/assets/products/${productUuid}/organizations/${organizationSlug}/clients/${workspaceSlug}/${id}`;
}

const src = getModelURL("GLB");
const usdzSrc = getModelURL("USDZ");

const poster = `${baseUrl}/assets/thumbnail/products/${productUuid}/organizations/${organizationSlug}/clients/${workspaceSlug}/`;
const qrUrl = `https://embed.vntana.com?productUuid=${productUuid}&clientSlug=${workspaceSlug}&organizationSlug=${organizationSlug}&autoAR=true`;

const viewerConfig = JSON.parse(product.response.viewerSettings.config);

const viewer = document.querySelector("vntana-viewer");
Object.assign(viewer, viewerConfig);
Object.assign(viewer, {
  src,
  usdzSrc,
  poster,
});

const qrButton = viewer.querySelector("vntana-qr-button");
qrButton.url = qrUrl;
