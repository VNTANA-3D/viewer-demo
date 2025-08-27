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
const workspaceSlug = "furniture";
const productUuid = "85a51c7b-07c1-4143-bd56-aa2a43acaa42";
```

The endpoint used to fetch product data returns a JSON object with properties
`success`, `response`, and `errors`.  If the product is available, `success` will 
be set to `true`, `errors` array will be empty, and `response` will be an object
with data we need to construct model links and set up the viewer.

<!-- embedme live-public/main.js#L5-L7 -->
```js
const baseUrl = `https://api.vntana.com`;
const endpoint = `/products/${productUuid}/organizations/${organizationSlug}/clients/${workspaceSlug}`
const {response, errors} = await fetch(`${baseUrl}${endpoint}`).then(response => response.json());
```

The `response` object is of the form (with irrelevant data omitted):
```json
{
  "asset": {
    "thumbnailBlobId": "0159e500-d9e4-4c09-953e-3fc327df263e.png",
    "models": [
      {
        "conversionFormat": "GLB",
        "modelBlobId": "cc36aed0-df3f-4efa-b590-df752559140f.glb",
      },
      {
        "conversionFormat": "USDZ",
        "modelBlobId": "cc36aed0-df3f-4efa-b590-df752559140f.usdz",
      },
    ]
  },
  "viewerSettings": {
    "config": <stringified JSON>,
  },
}
```
The viewer loads and renders GLB models specified through its `src` property. The USDZ
model, necessary for native AR experience on Safari devices, is specified through the `usdzSrc`
property. To obtain the links to these models, we search the `response.asset.models` array
for entries with the corresponding `conversionFormat` property. The entry will have the `modelBlobId`
property, which alongside `organizationSlug`, `workspaceSlug`, and `productUuid`, is sufficient
to construct the links.

<!-- embedme live-public/main.js#L13-L20 -->
```js
const models = response.asset.models;
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


<!-- embedme live-public/main.js#L22-L23 -->
```js
const poster = `${baseUrl}/assets/thumbnail/products/${productUuid}/organizations/${organizationSlug}/clients/${workspaceSlug}/`;
const qrUrl = `https://embed.vntana.com?productUuid=${productUuid}&clientSlug=${workspaceSlug}&organizationSlug=${organizationSlug}&autoAR=true`;
```

The last piece of information left to obtain are viewer properties like `toneMapping`,
`fieldOfView`, etc. They are stored as stringified JSON in the `response.viewerSettings.config`.

<!-- embedme live-public/main.js#L25-L25 -->
```js
const viewerConfig = JSON.parse(response.viewerSettings.config);
```

It remains to pass model links and other properties to the viewer, and to pass the `qrURL`
to the QR button.

<!-- embedme live-public/main.js#L27-L36 -->
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

The `hotspots` example covers the creation of hotspots using the `vntana-hotspot` custom HTML element. The `hotspots` directory contains 
`index.html` and `hotspots.js`. The demo is created as a simple example where hotspot data is pulled on page load and each hotspot is appended
to the `vntana-viewer` element.

When working with the `vntana-hotspot` element, it is important first to understand what it is and what it isn't. The `vntana-hotspot` element itself 
largely just exists as a point within the viewer, typically on the model. It contains `position` and `normal` attributes which are used to
update where in the viewer/on the model the hotspot exists, as well as when it is determined to be *behind* the model. Out of the box, a `vntana-hotspot` has
no visual representation, however the element itself can be styled as you see fit. To create a cicular pin for it you can use the styling:

```css
vntana-hotspot {
  background-color: #4b61f9; 
  border: 2px solid white; 
  color: white; 
  border-radius: 50%; 
  width: 26px; 
  height: 26px;
  display: flex; 
  align-items: center;
  justify-content: center;
  font-size: 16px;
  cursor: pointer;
}
```
This will create a similar style pin as what is in VNTANA embed links, without the number in the middle. Additional styling can be added for the `hide` class on
the `vntana-hotspot` element which is toggled when the viewer uses the `normal` to determine whether it is *behind* the model or not.
```css
vntana-hotspot.hide {
    opacity: 50%;
    pointer-events: none;
}
```
We disable mouse interactions when `hide` is present, however this is not necessary.

To actually add hotspots, we first need to retrieve their data. In the demo, this is just done by pulling from memory, however the method
`requestHotspotData` on line 21 should be viewed as a placeholder for the method needed in your implementation to pull the data. This can be handled
by requesting it from a database via methods such as HTTP calls, reading from a file, or pulling from memory. 

On lines `24-27`, we will iterate over each hotspot returned and create their corresponding `vntana-hotspot` element, before appending to the 
viewer. The expected hotspot data should have values for the `position` and `normal` for each needed hotspot, at a minimum. These values will be 
`positions` consisting of three values and their units, such as `0m 0m 0m`. In addition to this info, you could also have:
- `Camera Settings`: these can be utilized with an on-click event handler for the `vntana-hotspot` to update the camera to a specific place for hotspot.
- `Details`: This is vague, but can be any content you can place as a child of the `vntana-hotspot`. In this demo, we just create a `div` to house some text.
- `uuid`: It is recommended to generate `uuid`'s for your hotspots so you can sync them with your models and any pre-existing database entities intended to be displayed in the hotspot. This assumes you are not retrieving hotspots from the VNTANA Platform via the API.

In `hotspots.js` the process of creating each individual hotspot occurs on lines `34-70`. First, on line `36` the `vntana-hotspot` element is created and the `position` and `normal` attributes are set. Then, on line `41` a `div` is created which will be house the information we wish to display when the hotspot is clicked, which will be appended to the `vntana-hotspot` as a child. A `p` element is created on line `46` housing the text for that hotspot and appended to the `div`. These steps are dependent on if and how you wish to hae extra info displayed when a hotspot is clicked. It can also be displayed on a side panel in which case you would not append these as children to the `vntana-hotspot`.

Finally, we add some `click` listeners to the hotspot. On lines `51-55` we add a listener for when the hotspot is clicked which toggles the `hidden` class to show or display the intended info for the hotspot. Additionally, if the hotspot had `camera` data, we call the `moveCamera` method to update camera settings. On lines `57-67` we add `mousedown` and `mouseup` events to handle ensuring that when a hotspot's content is visible, and you click elsewhere, the hotspot panel is hidden once more, similar to the behavior on the VNTANA Platform.