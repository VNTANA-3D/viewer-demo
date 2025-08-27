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


const hotspotEndpoint = `/hotspots/search/organizations/${organizationSlug}/clients/${workspaceSlug}`;
const hotspotRequest = fetch(`${baseUrl}${hotspotEndpoint}`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    page: 1,
    size: 100,
    productUuid,
  }),
});
const hotspots = await hotspotRequest.then(response => response.json());

if (hotspots.errors.length > 0) {
  throw new Error(hotspots.errors);
}

const viewer = document.querySelector("vntana-viewer");

hotspots.response.grid.forEach(data => {
  const dimensions = JSON.parse(data.config.dimensions);
  const camera = data.config.camera ? JSON.parse(data.config.camera) : null;

  const hotspot = document.createElement("vntana-hotspot");
  hotspot.position = dimensions.position;
  hotspot.normal = dimensions.normal;
  hotspot.innerHTML = `<div class="content">${data.text}</div>`;

  hotspot.addEventListener("click", event => {
    if (event.target !== hotspot) {
      return;
    }

    const isOpen = hotspot.classList.contains("open");
    hotspot.classList.toggle("open");

    if (camera && !isOpen) {
      viewer.setCameraRotation(camera.cameraRotation)
      viewer.setCameraDistance(camera.cameraDistance)
      viewer.setCameraTarget(camera.cameraTarget)
      viewer.setFieldOfView(camera.fieldOfView)
      viewer.setOrthographicSize(camera.orthographicSize)
    }
  });

  viewer.append(hotspot);
});

Object.assign(viewer, viewerConfig);
Object.assign(viewer, {
  src,
  usdzSrc,
  poster,
});

const qrButton = viewer.querySelector("vntana-qr-button");
qrButton.url = qrUrl;
