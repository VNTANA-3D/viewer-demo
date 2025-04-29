# VNTANA Viewer

## Contents
* [Attributes and Properties](./docs/attributes.md)

* [UI Buttons](./docs/ui.md)

* [Events](./docs/events.md)

* [Hotspots](./docs/hotspots.md)


## Introduction
VNTANA Viewer is a custom web component for rendering glTF/GLB files in the browser. As a web component
it can be placed, styled, and manipulated like any standard HTML element in the web page, while multiple
options allow fine-grained customization of the 3D experience.

The `<vntana-viewer>` element definition can be loaded through either an ES or UMD standalone modules from 
the following links:
```
https://viewer-build.vntana.com/v2.0.0/viewer.min.js
https://viewer-build.vntana.com/v2.0.0/viewer.umd.min.js
```

Once the element definition is loaded, in order to load the model `DamagedHelmet.glb` with environment map `Neutral.hdr`, for example, it suffices to 
specify the corresponding attributes on the element:

```
<html>
  <head>
    <script src="https://viewer-build.vntana.com/v2.0.0/viewer.min.js"></script>
  </head>
  <body>
    <vntana-viewer src="DamagedHelmet.glb" environment-src="Neutral.hdr">
    </vntana-viewer>
  </body>
</html>
```


## Use Cases
This package comes with three scripts, each demonstrating different aspects of the viewer:

- `simple` - adds the viewer to a web page, and sets it up to display a 3d model with the environment map through the attribute interface,
- `custom` - creates custom points of interest similar to hotspots without placing a pin on the model,
- `integration` - fetches data from VNTANA Platform and applies it to the viewer through the property interface,
- `internal` - similar to `integration`, but loads data for Live Internal model instead of Live Public.

The accompanying `npm` package doesn't need any prior installation. In order to run the scripts it suffices
to execute `npm run simple` or `npm run integration` from the package’s root directory. Both scripts run the `http-server` and open the corresponding page in the browser.

All examples utilize the styles in the shared directory:

- `style.css` - styles used for this demo,
- `viewer.css` - default styles for the viewer and positioning of buttons.

### Simple Example

Directory simple contains the `index.html` containing the page's HTML code, the `chair.glb` model, and `Neutral.hdr` environment map. The body of the document is:

```html
  <body>
    <script type="module" src="https://viewer-build.vntana.com/v2.0.0/viewer.min.js"></script>

    <vntana-viewer src="chair.glb" environment-src="Neutral.hdr" tone-mapping="neutral">
      <vntana-fs-button></vntana-fs-button>
    </vntana-viewer>
  </body>
```

Line `2` loads the ES module containing the viewer. Line `4` adds the viewer elements, sets the model through the `src` attribute and environment through `environment-src`. We also added the `tone-mapping` attribute to improve the lighting experience. `<vntana-fs-button>` is added as a child of the viewer, and toggles the viewer’s fullscreen state when clicked.

### Custom Example

This example provides an example of how you can create a custom UI with hotspot-like callouts which update the camera and provide information in a small panel. Directory `custom` contains the HTML code, example model `yacht.glb`, `custom.css` to contain the styling that is unique to this project, and sub-directory containing thumbnails which will be used for the points of interest. 

Creating the viewer resembles the `simple` example, however we do not add the `vntana-fs-button` while also setting a couple of extra attributes:

```html
<script type="module" src="https://viewer-build.vntana.com/v2.0.0/viewer.min.js"></script>

<vntana-viewer 
  src="yacht.glb" 
  environment-src="Neutral.hdr" 
  tone-mapping="neutral" 
  background="radial-gradient(rgb(206,218,229),rgb(206,218,229))"
  camera-rotation="0.029152963801224008rad -0.7897278114867406rad 0rad"
  min-camera-distance="0r"
>
</vntana-viewer>
```
These deviations from the `simple` example are optional. We set a `radial-gradient` background, as well as the initial `camera-rotation` for the model. Additionally, we need to set the `min-camera-distance` to `0r` to allow us to set camera positions that are within the model. This is only necessary if your model and callouts need to zoom in this much, otherwise you can test around with different minimums to find a value that works for you, or just rely on the default.

The first piece of custom UI used in this demo is to add thumbnail buttons on top of the viewer. The general structure of these buttons is:
```html
<div id="thumbnail-container">
  <div id="side-view">
    <img draggable="false" src="thumbnails/side-view.png">
    <span>OceanDream 5000</span>
  </div>
  ...
</div>
```
Each of these buttons will act as a pseudo-hotspot without the need to set a hotspot's position on the model. By clicking one of the thumbnail buttons, the camera will move to the new location by setting the `cameraRotation`, `cameraTarget`, and `cameraDistance`.
```javascript
document.getElementById("back-deck").addEventListener("click", () => {
  ...
  viewer.setCameraRotation("-0.37610209735644085rad -2.712091563132102rad 0rad");
  viewer.setCameraDistance("0.8092878883914102r");
  viewer.setCameraTarget("0.09354871669701487r -0.7367940167180103r -0.23263606352595337r");
});
```
**NOTE**: To determine the values which are being passed in the above example, you can utilize the methods `getCameraRotation`, `getCameraTarget`, and `getCameraDistance` with the viewer in a dev environment after positioning the camera where you wish it to update to.

Next, we add a *callout* panel that will appear in the bottom right corner when one of the point of interest thumbnails are selected. 
```html
<div id="callout" class="callout inactive squashed">
  <svg class="logo" stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">...</svg>
  <h1 id="callout-header" class="header"></h1>
  <p id="callout-text" class="text"></p>
</div>
```

With this we just use standard CSS and Javascript to show/update the contents of this callout panel, this is completely external to viewer functionality.
```Javascript
function showCallout() {
  document.getElementById("callout").classList.remove("squashed");
  document.getElementById("callout").classList.remove("inactive");
}
...
document.getElementById("side-view").addEventListener("click", () => {
  ...
  showCallout();
  document.getElementById("callout-header").innerText = "";
  document.getElementById("callout-text").innerText = "";
  ...
});
```

Finally, in this demo, the fullscreen button and functionality is customized to both allow for full control over styling the button, as well as ensuring the other custom UI elements are included when in fullscreen view. We add a fullscreen button to a controls element:
```html
<div id="controls">
  <div alt="Toggle Fullscreen" id="fullscreen-button" class="fullscreen-button hidden">
    <svg class="open" stroke="currentColor" fill="none" stroke-width="0" viewBox="0 0 15 15" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">...</svg>
    <svg class="close fullscreen" stroke="currentColor" fill="none" stroke-width="0" viewBox="0 0 15 15" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">...</svg>
  </div>
</div>
```
There are two icons, one for when fullscreen is open and another for when fullscreen is closed. We then add an event listener to the `fullscreen-button` element to tigger fullscreen when clicked, and handle the swapping of fullscreen button svg's on lines `138-153`. We check if the document has a fullscreen element already on line `139`, which determines on lines `141-150` whether to enter fullscreen or exit. Finally on line `152` we toggle the `fullscreen` class on the `fullscreen-button` element to ensure the correct svg is being shown at all times.

### Integration Example

Directory `integration` contains two files: `index.html` with HTML code for the page, and `platform.js` containing the function `getPlatformData`, which we will use to fetch the product data from VNTANA Platform.

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


### Internal Example

This example demonstrates how to load product data from VNTANA Platform for products
which are not publicly available. This requires the product to be in a Live Internal state,
and the user will first need to log in to the Platform. The example won't work
out-of-the-box, since the user should first input their email and password, as well as 
organization and workspace slug, before proceeding. 

Directory `internal` contains files `index.html` and `platform.js`, latter containing
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