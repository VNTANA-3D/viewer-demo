# VNTANA Viewer Integration Demos

This package contains several demos describing how to fetch 3D model data
from the VNTANA Platform and pass it to the `<vntana-viewer>` element.

## Table of Contents
- [Getting Started](#getting-started)
- [Common Code](#common-code)
- [Live Public](#live-public)
- [Live Internal](#live-internal)
- [Hotspots](#hotspots)

## Getting Started

To start a demo, run:
```bash
npm run <demo-name>
```
This will run a local server and open the demo in your default browser.
Scripts require no prior installation. 

<div align="center">

| Demo                              |  Description                                                         |  
|:---------------------------------:|----------------------------------------------------------------------|
|[`live-public`](#live-public)      |  Loads the `Live Public` product data from VNTANA Platform           | 
|[`live-internal`](#live-internal)  |  Loads the `Live Internal` product data with user authentication     |
|[`hotspots`](#hotspots)            |  Loads the local asset and creates hotspots from local data          |

</div>

For basic usage and full documentation of the `<vntana-viewer>` component,
visit the [Viewer NPM Page](https://www.npmjs.com/package/@vntana/viewer).
Bundled code of the viewer package is available through [UNPKG](https://unpkg.com) or [jsDelivr](https://jsdelivr.com)
as `bundle.js` (ESM) or `bundle.umd.js` (UMD).

## Common Code
Files for each demo can be found in the directory of the same name. Each directory contains files:
- `index.html`: main content of the page,
- `main.js`: fetching data and assigning it to the elements.

File `index.html` has roughly the same structure in all demos:
```html
<head>
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <link rel="stylesheet" href="../shared/styles/viewer.css" />
  <link rel="stylesheet" href="../shared/styles/style.css" />
</head>

<body>
  <script 
    type="module" 
    src="https://cdn.jsdelivr.net/npm/@vntana/viewer/dist/bundle.js"
  ></script>

  <vntana-viewer>
      <!--- buttons -->
  </vntana-viewer>

  <script type="module" src="main.js"></script>
</body>
```

Inside the document's `<head>` we set the page viewport and load two stylesheets:
- `viewer.css`: default styles for the viewer and button positioning,
- `style.css`: custom demo styles.

**NOTE:** Setting page viewport is required for proper scaling of the viewer on mobile devices.

The `<body>` element starts with loading the viewer code script. This script defines `<vntana-viewer>`
and all components (hotspots, buttons, ...). We continue by adding the `<vntana-viewer>` element
to the page and place different buttons as its children. All buttons work out-of-the-box,
except for the QR button which requires we pass it the URL that will be encoded in the QR code.
Finally, we load the page logic from `main.js` with the `<script>` element.

Each of the subsequent sections outlines the code in `main.js` of the corresponding demo.


## Live Public

This example demonstrates how to fetch data about a Live Public product from the Platform,
prepare it, and pass it to the viewer.

Products in the Platform are determined by their `organizationSlug`, `workspaceSlug`, and
`productUuid`. These can be obtained from Platform links, which are of the form
```js
platform.vntana.com/<organizationSlug>/<workspaceSlug>/products/edit/<productUuid>
```

In this demo we use the product:
<!-- embedme live-public/main.js#L1-L3 -->
```js
const organizationSlug = "asset-library";
const workspaceSlug = "viewer-demo";
const productUuid = "db656517-2842-4e64-a3de-743acee9ff9d";
```

The endpoint used to fetch product data returns a JSON object with properties
`success`, `response`, and `errors`.  If the product is available, `success` will 
be set to `true`, `errors` array will be empty, and `response` will be an object
with data we need to construct model links and set up the viewer.

<!-- embedme live-public/main.js#L5-L8 -->
```js
const baseUrl = `https://api.vntana.com`;
const productEndpoint = `/products/${productUuid}/organizations/${organizationSlug}/clients/${workspaceSlug}`
const productRequest = fetch(`${baseUrl}${productEndpoint}`);
const product = await productRequest.then(response => response.json());
```

The `product.response` object is of the form (with irrelevant data omitted):
```json
{
  "asset": {
    "thumbnailBlobId": "<blob-id>",
    "models": [
      {
        "conversionFormat": "GLB",
        "modelBlobId": "<blob-id>",
      },
      {
        "conversionFormat": "USDZ",
        "modelBlobId": "<blob-id>",
      },
    ]
  },
  "viewerSettings": {
    "config": "<stringified JSON>",
  },
}
```
The viewer loads and renders GLB models specified through its `src` property. The USDZ
model, necessary for native AR experience on Safari devices, is specified through the `usdzSrc`
property. To obtain the links to these models, we search the `product.response.asset.models` array
for entries with the corresponding `conversionFormat` property. The entry will have the `modelBlobId`
property, which alongside `organizationSlug`, `workspaceSlug`, and `productUuid`, is sufficient
to construct the links.

<!-- embedme live-public/main.js#L14-L21 -->
```js
const models = product.response.asset.models;
const getModelURL = format => {
  const id = models.find(model => model.conversionFormat === format).modelBlobId;
  return `${baseUrl}/assets/products/${productUuid}/organizations/${organizationSlug}/clients/${workspaceSlug}/${id}`;
}

const src = getModelURL("GLB");
const usdzSrc = getModelURL("USDZ");
```

In addition to the GLB and USDZ links, we will also set up the poster, an image which is 
displayed in the viewer while the model is loading, and the QR link, which will be encoded 
in the QR code displayed when the QR button is clicked. The poster is set through viewer's
`poster` property and can be constructed from `asset.thumbnailBlobId`, while QR link is
set through QR buttons `url` property. The QR URL we construct is the embed link which
automatically loads the AR.


<!-- embedme live-public/main.js#L23-L24 -->
```js
const poster = `${baseUrl}/assets/thumbnail/products/${productUuid}/organizations/${organizationSlug}/clients/${workspaceSlug}/`;
const qrUrl = `https://embed.vntana.com?productUuid=${productUuid}&clientSlug=${workspaceSlug}&organizationSlug=${organizationSlug}&autoAR=true`;
```

The last piece of information left to obtain are viewer properties like `toneMapping`,
`fieldOfView`, etc. They are stored as stringified JSON in the `product.response.viewerSettings.config`.

<!-- embedme live-public/main.js#L26-L26 -->
```js
const viewerConfig = JSON.parse(product.response.viewerSettings.config);
```

It remains to pass model links and other properties to the viewer, and to pass the `qrURL`
to the QR button.

<!-- embedme live-public/main.js#L28-L37 -->
```js
const viewer = document.querySelector("vntana-viewer");
Object.assign(viewer, viewerConfig);
Object.assign(viewer, {
  src,
  usdzSrc,
  poster,
});

const qrButton = viewer.querySelector("vntana-qr-button");
qrButton.url = qrUrl;
```

## Live Internal

This example demonstrates how to load product data from VNTANA Platform for products
which are not publicly available. This requires the product to be in a Live Internal state,
and the user will first need to log in to the Platform. The example won't work
out-of-the-box, since the user should first input their email and password, as well as 
organization slug, workspace slug, and product UUID before proceeding. A detailed description
of Platform's authentication flow can be found [here](https://www.vntana.com/resource/api-authentication/).

To simplify making endpoint calls, we use the `request` function available from `request.js`.
The function prepends the API base URL to endpoint URLs, keeps track of the authentication
token, and returns the `response` object obtained from the endpoint call.
```js
async function request(endpoint, method, headers, body)
```

We start by importing the `request` function, `baseURL`, and `token` from the `request.js`,
as well as the `VntanaViewer` class from the viewer bundle. 

<!-- embedme live-internal/main.js#L1-L2 -->
```js
import {request, baseURL, token} from './request.js';
import {VntanaViewer} from "https://cdn.jsdelivr.net/npm/@vntana/viewer/dist/bundle.js";
```

In order to log into the Platform, the user needs to provide their email and password.
Products in the Platform are determined by their organization slug, workspace slug, and
product UUID, so we need to specify those as well.

<!-- embedme live-internal/main.js#L4-L8 -->
```js
const email = "<username>";
const password = "<password>";
const organizationSlug = "<organization-slug>";
const workspaceSlug = "<workspace-slug>";
const productUuid = "<product-uuid>";
```

We proceed to log into the Platform with the email and password.

<!-- embedme live-internal/main.js#L10-L10 -->
```js
await request("/auth/login", "POST", {}, {email, password});
```

To fetch product data we first need to determine UUIDs of the organization and workspace
to which it belongs. We start by fetching the list of all organizations available to the
user, and searching it for the one whose `slug` equals the `organizationSlug` set above.
We also extract the user's role in the organization from the `role` property.

<!-- embedme live-internal/main.js#L12-L22 -->
```js
const organizations = (await request("/organizations", "GET")).grid;
const organization = organizations.find(org => org.slug === organizationSlug);

if (!organization) {
  throw new Error(`Organization ${organizationSlug} not found`);
}

const {
  role: organizationRole,
  uuid: organizationUuid,
} = organization;
```

To access data about the organization, like the list of all workspaces, we need to refresh the 
authentication token:

<!-- embedme live-internal/main.js#L24-L24 -->
```js
await request("/auth/refresh-token", "GET", {organizationUuid});
```

We can now fetch the list of workspaces available to the user in the organization, and search it for the one
whose `slug` equals `workspaceSlug`. We only need the `uuid` of the workspace we intend to use.

<!-- embedme live-internal/main.js#L26-L35 -->
```js
const workspaces = (await request("/clients/client-organizations", "GET")).grid;
const workspace = workspaces.find(workspace => workspace.slug === workspaceSlug);

if (!workspace) {
  throw new Error(`Workspace ${workspaceSlug} not found`);
}

const {
  uuid: workspaceUuid,
} = workspace;
```

To finish the login process, we need to refresh the authentication token for the workspace, but only
if the user is not an organization owner or organization admin.

<!-- embedme live-internal/main.js#L37-L39 -->
```js
if (organizationRole !== "ORGANIZATION_OWNER" && organizationRole !== "ORGANIZATION_ADMIN") {
  await request("/auth/refresh-token", "GET", {clientUuid: workspaceUuid});
}
```

The login process is done, and we can focus on loading the product data. The product data
returned by the endpoint has the same structure as the one in the `live-public` demo.

<!-- embedme live-internal/main.js#L41-L43 -->
```js
const response = await request(`/products/${productUuid}`, "GET");
const src = `${baseURL}/products/${productUuid}/download/model?clientUuid=${workspaceUuid}&conversionFormat=GLB`;
const viewerConfig = JSON.parse(response.viewerSettings.config);
```

In order to download the model, the viewer will need to use authentication headers, which we 
set on the `VntanaViewer` class.

<!-- embedme live-internal/main.js#L45-L47 -->
```js
VntanaViewer.setModelRequestHeaders({
  "X-AUTH-TOKEN": `Bearer ${token}`,
});
```
It remains to pass viewer properties and model link to the viewer.

<!-- embedme live-internal/main.js#L49-L53 -->
```js
const viewer = document.querySelector("vntana-viewer");
Object.assign(viewer, viewerConfig);
Object.assign(viewer, {
  src,
});
```

## Hotspots

This example extends the `live-public` demo by fetching hotspot data from the Platform,
creating hotspot elements, and appending them to the viewer. Each hotspot is represented by 
a `<vntana-hotspot>` element, which marks a point on the 3D model that moves
with the camera. 

Main hotspot properties are:
- `position`: defines where the hotspot is located in the scene.
- `normal`: determines whether the hotspot is in front or behind the model, based on the camera
position. When behind the model, hotspot elements automatically get the `hide` class added.

These values are typically generated in the Platform's Editor,
since they can be difficult to define manually. The Platform may additionally store the camera
data that is applied when the hotspot is clicked.

By default, `<vntana-hotspot>` elements don't have any content or styling applied; you can
style them freely with CSS and add any HTML inside the element tags.

Styles provided in `shared/styles/hotspots.css` make hotspot elements circular pins, and hide
their content by default. The content is displayed only once the hotspot gets clicked, in which
case we set the `open` class on the hotspot element.
When positioned behind the model, hotspots are made transparent and interaction is disabled.

**NOTE:** `<vntana-hotspot>` elements are not displayed until the model is loaded, so 
they can be safely appended to the viewer at any time.

The code in `main.js` begins with loading the product data, identical to the `live-public`
demo, and then fetches hotspot data from the Platform. The hotspot endpoint returns paged results,
so the request must include `page` and `size`. For simplicity, this demo assumes the number of 
hotspots is less than 100.

<!-- embedme hotspots/main.js#L29-L41 -->
```js
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
```

Hotspot entries are found in the `hotspots.response.grid` array. Each entry has the shape:
```json
{
  "config": {
    "dimensions": "<stringified JSON>", // contains "position" and "normal"
    "camera": "<stringified JSON>",     // optional camera settings
  },
  "text": "<HTML content string>",      // HTML content
  "type": "TEXT",
}
```

Besides text, the Platform also supports image and video hotspots, though this demo 
assumes that is not the case.

The next step is to create `<vntana-hotspot>` elements for each entry and append it to the
viewer through the following steps: 
1. Extract `position`, `normal`, and (optionally) `camera` data from the hotspot data.
2. Create the element and set its position, normal, and content.
3. Add a click handler that toggles the `open` class. If camera data is included, it is applied
when the hotspot is opened.

<!-- embedme hotspots/main.js#L49-L72 -->
```js
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
```

**NOTE:** Hotspot data doesn't have to come from the Platform. It can also be stored locally or
in another database, as long as `position`, `normal`, content, and (optionally) camera data
are provided.