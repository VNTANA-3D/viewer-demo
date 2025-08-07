# VNTANA Viewer Integration Demos

This package contains several demos describing how to fetch 3D model data
from the VNTANA Platform and pass it to the `<vntana-viewer>` element.

## Table of Contents
- [Getting Started](#getting-started)
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

Files for each demo can be found in the directory of the same name.

For basic usage and full documentation of the `<vntana-viewer>` component,
visit the [Viewer NPM Page](https://www.npmjs.com/package/@vntana/viewer).
Bundled code of the viewer package is available through [UNPKG](https://unpkg.com) or [jsDelivr](https://jsdelivr.com)
as `bundle.js` (ESM) or `bundle.umd.js` (UMD).

All demos use shared styles found in the `shared` directory:
- `style.css`: custom demo styles,
- `viewer.css`: default styles for the viewer and button positioning.

### Live Public Example

Directory `live-public` contains two files: `index.html` with HTML code for the page, and `platform.js` containing the function `getPlatformData`, which we will use to fetch the product data from VNTANA Platform.

**NOTE**: Function `getPlatformData` only works with products in `Live Public` state.

The first part of the page’s body loads the viewer with different buttons:
```html
  <vntana-viewer>
    <vntana-fs-button></vntana-fs-button>
    <vntana-qr-button class="expandable"></vntana-qr-button>
    <vntana-ar-button></vntana-ar-button>
    <vntana-center-button></vntana-center-button>
    <div class="button-container zoom-buttons">
      <vntana-zoom-in-button></vntana-zoom-in-button>
      <vntana-zoom-out-button></vntana-zoom-out-button>
    </div>
  </vntana-viewer>
```
Classes `button-container`, `zoom-buttons`, and `expandable` come as part of viewer’s default styling, and are defined in `viewer.css`. Elements `<vntana-qr-button>` and `<vntana-ar-button>` are mutually exclusive, so at most one of them will be visible at any time. Unless we provide the URL that will be encoded in the QR, `<vntana-qr-button>` won’t be visible.

Second part of the body handles the main purpose of this demo - loading data from VNTANA Platform. We start by importing the `getPlatformData` function from file `platform.js`.
```js
  <script type="module">
    import {getPlatformData} from './platform.js';

    const platformData = await getPlatformData(
      "asset-library",
      "furniture",
      "85a51c7b-07c1-4143-bd56-aa2a43acaa42"
    );

    const config = {
      src: platformData.src,
      usdzSrc: platformData.usdzSrc,
      poster: platformData.poster,
      ...platformData.config,
    };

    const viewer = document.querySelector("vntana-viewer");

    Object.assign(viewer, config);

    const qrButton = viewer.querySelector("vntana-qr-button");
    qrButton.url = platformData.qrUrl;
  </script>
```

The `getPlatformData` function accepts three parameters: `organizationSlug`, `clientSlug`, and `productUuid`. All three parameters can be easily obtained from VNTANA Platform links, since all platform links are of the form:

```
https://platform.vntana.com/<organizationSlug>/<clientSlug>/products/edit/<productUuid>
```

The function returns an object with the following properties:

- `src` - URL of the GLB model,
- `usdzSrc` - URL of the USDZ model,
- `poster` - URL of the poster/thumbnail,
- `qrUrl` - URL of the product’s embed link with autoAR enabled,
- `config` - config data for the viewer without links.

The `qrUrl` should in almost all cases be replaced with a different URL for custom integrations. After obtaining the platform data in lines `4-8`. In lines `10-15` we merge all the data into one config containing a list of `(key,value)` pairs that will be passed to the viewer. In line `17` we obtain a reference to the viewer, and call `Object.assign` on it with the config in line `19`. We obtain the reference to the `<vntana-qr-button>` in line `21`, and pass it the `qrUrl` string.


### Live Internal Example

This example demonstrates how to load product data from VNTANA Platform for products
which are not publicly available. This requires the product to be in a Live Internal state,
and the user will first need to log in to the Platform. The example won't work
out-of-the-box, since the user should first input their email and password, as well as 
organization and workspace slug, before proceeding. 

Directory `live-internal` contains files `index.html` and `platform.js`, latter containing
the `Platform` class. The purpose of this class is to abstract away the details of VNTANA API, as well
as to keep track of tokens needed for authentication into organizations and workspaces. A detailed
description of Platform's authentication flow can be found [here](https://www.vntana.com/resource/api-authentication/).

The class provides the following methods (wrappers around other endpoints could be easily added):

  - `login(email, password)` - (async) logs the user into the platform with email and password.
  - `loginToken(token)` - (async) logs the user into the platform with the authentication token obtained from VNTANA Platform.
  - `refreshToken(organizationUuid, workspaceUuid)` - (async) refreshes the token when changing organization or workspace. Exactly one of the parameters must be `undefined`.
  - `getOrganization()` - (async) returns an array of objects, each representing a different organization accessible to the user.
  - `getWorkspaces()` - (async) returns an array of objects, each representing a different workspace accessible to the user within the current organization.
  - `getProduct(uuid)` - (async) returns data about the product with the given `uuid`.
  - `getModelURL(workspaceUuid, productUuid)` - returns the URL of the GLB file associated with the product. 
  - `getHeaders()` - returns an object with `header-value` pairs needed for downloading models.

In line `17` we import the `Platform` class from `platform.js`, and in line `18` we import
the `VntanaViewer` class from the viewer build. We will need the `VntanaViewer` class to set the
appropriate headers needed for model downloads.

Lines `19-24` specify data the user should input. `email` and `password` are the ones
used to log in to the VNTANA Platform (and could be replaced by authentication token). `organizationSlug`
and `workspaceSlug` are used here primarily to easily determine organization and workspace UUIDs within
which the product resides, and should probably be removed in production code.

In line `27` we instantiate the `Platform` class which we will use to call platform endpoints,
and log in to the platform in line `28`. Lines `30-35` fetch the list of all available organizations,
and search the list for the organization whose `organizationSlug` we set beforehand. In lines `32-35`
we obtain the UUID of our organization and the user's role within it. Line `37` performs authentication into the organization. 

Lines `39-43` repeat the same steps for the workspace, the only difference
being that we ignored the user's role in the workspace.  Lines `45-47` authenticate the user into the workspace. Organization owners and admins must not
perform this step, since they are already authenticated into all workspaces within their organization.

In line `49` we finally fetch the data associated with the product. Viewer-related properties
are stored as JSON string within `product.viewerSettings.config` property, and obtain the URL of the model in line `51`.

Before passing the data to the viewer, we must ensure the viewer uses correct access headers
when downloading the model. In order to so, we obtain these headers through a call to `platform.getHeaders()`
and pass them to the static method `setModelRequestHeader` of `VntanaViewer` class. These headers
can be used for all subsequent downloads as long we don't change the organization or workspace.

Lines `55-64` merge all the viewer properties into one object, which are then passed to the
viewer in the same way we did in the last example.

**NOTE:** The `Platform` class also provides the `getPresets(workspaceUuid)` method which returns
an array of all available presets within the organization (or workspace if `workspaceUuid` is provided).
Each entry in the array contains the `config` property whose value is JSON string of viewer settings. 
This settings can be used as other viewer settings we encountered in the examples.

### Hotspots Example

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