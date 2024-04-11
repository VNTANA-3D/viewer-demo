# VNTANA Viewer Demo

- [Basic usage](#basic-usage)
- [Attributes and properties](#attributes-and-properties)
- [Attribute reference](#attribute-reference)
    - [Model](#model)
    - [Environment](#environment)
    - [Shadow](#shadow)
    - [Lights](#lights)
    - [Rendering](#rendering)
    - [Loading](#loading)
    - [Augmented Reality](#augmented-reality)
    - [Jewelry](#jewelry)
    - [Camera Controls](#camera-controls)
    - [Other](#other)
- [Events](#events)
- [Buttons](#buttons)
- [Integration and examples](#integration-and-examples)
    - [Simple Example](#simple-example)
    - [Integration Example](#integration-example)

## Basic usage

The viewer is a custom web component, and can thus be placed into your web page as any standard HTML element. Before doing so, the script containing the element definition needs to be loaded. ES and UMD modules are available, and can be obtained from the following links: 

<pre>
    https://viewer-build.vntana.com/$version$/viewer.min.js
    https://viewer-build.vntana.com/$version$/viewer.umd.min.js
</pre>

Here `$version$` should be replaced by the version string (latest version is `v1.1.0`).  Scripts define `<vntana-viewer>` element out-of-the-box, and since they are minified standalone builds, no additional preparation steps are necessary.

A simple example demonstrating basic usage of the viewer is as follows. If we wanted load the model `DamagedHelmet.glb` with environment map `Neutral.hdr`, we could do it as

```html
<html>
  <head>
    <script src="https://viewer-build.vntana.com/v1.0.4/viewer.min.js"></script>
  </head>
  <body>
    <vntana-viewer src="DamagedHelmet.glb" environment-src="Neutral.hdr">
    </vntana-viewer>
  </body>
</html>
```

The viewer element is a custom HTML element, and can thus be manipulated, styled, and placed anywhere in the DOM just as a regular element would be. If no attributes are specified, the viewer acts as an empty element. Note that although the viewer doesn’t have any children in this example, the closing tag is still mandatory.

## Attributes and properties
The viewer can be manipulated either by setting and removing attributes in HTML or JavaScript, or directly through its properties. All attributes are passed as strings except boolean attributes, for which it suffices to set or remove the attribute to indicate their state. For example, if we wanted to set shadow intensity to `0.3` and enable auto-rotation of the camera, we would use the following code:
```html
<vntana-viewer shadow-intensity="0.3" enable-auto-rotate></vntana-viewer>
```
Removing the attribute or passing invalid values is equivalent to resetting its value to default. Continuing with the example above, removing the `shadow-intensity` attribute will reset its value to default value of `0`, and removing the `enable-auto-rotate` attribute will set its value to `false`. If we were to set the `shadow-intensity` value to `“something"` it would also be reset to `0`, 
and setting it to an out-of-bounds value like `50` would result in the value being clamped to `1`.

The property interface is more appropriate if viewer parameters will change during the component’s lifetime. Unlike their corresponding attributes, property values are not kept as strings (strings will automatically be parsed if needed) and are automatically converted to basic types. The attribute values are automatically reflected in property values and converted, but the converse doesn’t hold - changing property values won’t change the attributes. For example, when we set `shadow-intensity` to `0.3` in the previous example, the viewer’s `shadowIntensity` property was immediately set to `0.3`.

```html
<vntana-viewer></vntana-viewer>
<script type="module">
  const viewer = document.querySelector("vntana-viewer");
  viewer.shadowIntensity = 0.3;
  viewer.enableAutoRotate = true;
</script>
```

Property value types can be generally classified into the following categories:

**strings**  Falsy values are converted to empty string, to everything else the call to `String()` is first applied.

**booleans**   All strings are converted to `true`, to everything else the call to `Boolean()` is applied first.

**colors**   Can be specified as a # followed by a six-digit hex code or an equivalent number. Always stored in hex code format.

**numbers**   Numbers are treated as numbers, and strings are parsed for numbers. Everything else is discarded. Most numbers have some restrictions on them (for example, they need to belong to some range or be finite). Unless otherwise stated, all numeric values are assumed to be finite.

**quantities**   Quantities represent number-unit pairs, and primarily refer to angles and distances/offsets. Supported angle units are radians (default) and degrees, while distances support meters (default), and in some cases may be specified as percentages to indicate relative quantities. Values passed without units are assumed to have default units. Alternatively, values passed as strings may have a unit suffix (e.g. “50deg” or “10m”).

**vectors**   Vectors are combinations of numbers and quantities, provided as strings and separated by whitespace (for example, “30deg -20m 80rad”)

**arrays**   Arrays are passed as stringified JSONs to attributes or directly to properties. If the passed value is a string, it will be parsed as a JSON, and treated as an array otherwise.

## Attribute reference
### Model
**src**

A URL to a glTF or glB file containing the model.

  - type: string
  - default: `""`

**scale**

Model’s scaling factors in X, Y, and Z directions.

  - type: "<number> <number> <number>"
  - default: `"1 1 1"`

**rotation**

Euler angles specifying rotation of the model around X, Y, and Z axes. Rotations are applied in YXZ order, that is, the model is first rotated around Z axis, then X, and then Y.

  - type: "<angle> <angle> <angle>"
  - default: `"0deg 0deg 0deg"`

### Environment
**environment-src**

A URL to the HDR file containing the equirectangular environment map. 

  - type: string
  - default: `""`

**environment-rotation**

Euler angles specifying environment rotation round X, Y, and Z axes. Rotations are applied in YXZ order.

  - type: "<angle> <angle> <angle>"
  - default: `"0deg 0deg 0deg"`

**skybox**

The environment map is used as scene’s background if set.

  - type: boolean
  - default: `false`

### Shadow
**shadow-intensity**

Intensity of the ground shadow cast by the model. Value must be between 0 and 1.

  - type: number
  - default: `0`

**shadow-radius**

Radius of blur kernel used when rendering shadows. Values must be positive.

  - type: number
  - default: `2`

**shadow-samples**

Number of samples used when blurring the shadow. Values must be positive integers.

  - type: number
  - default: `16`

**shadow-resolution**

The resolution of the shadow map.  Values must be positive integers.

  - type: number
  - default: `512`

**shadow-offset**

Vertical offset of the plane onto which the shadow is cast. Zero shadow offset renders the shadow in the horizontal plane passing through the base of model’s bounding box. The value can be specified as a percentage of bounding box’s height. Negative values move the shadow plane down.

  - type: number
  - default: `0`

### Lights
**hide-model-lights**

Sets the intensity of all lights in the model to 0.       -

  - type: boolean
  - default: `false`

**light-rig-intensity**

Scaling factor for light intensities of lights in the rig. Values must be non-negative.

  - type: number
  - default: `1`

**light-rig-color**

Overrides the color of all lights in the light rig if set.     

  - type: color or null
  - default: `null`

**light-rig**

An array of light configuration objects defining additional lights added to the scene.

  - type: array
  - default: `[]`


```js
viewer.lightRig = [{
  type: "directional",
  intensity: 2,
  color: "#ff0000",
  position: "0m 2m -1m",
  direction: "0m 2m 2m",
}] 
```

Each light configuration object may contain the following properties: 

- **type** 
    Specifies the type of the light. Can be `“directional”`, `“spot”` or `“point”`. If omitted, the config (and thus the whole array) is considered invalid. 

  - type: string
  - default: none

- **intensity**
    Determines the intensity of the light. Values are non-negative numbers.         

  - type: number
  - default: `1`

- **color**
    Color of the light.           

  - type: color
  - default: `"#ffffff"`

- **position**
    Position of the light. Only applies to point and spot lights.

  - type: “<distance> <distance> <distance>”
  - default: `"0m 1m 0m"`

- **direction**       
    Direction vector of the light. The vector doesn’t have to be normalized. Only applies to directional and spot lights.

  - type: string
  - default: `"0m -1m 0m"`

- **distance** 
    Cutoff distance of the light. If set to zero, the distance is treated as infinite. Values must be non-negative. Only applies to point and spot lights.

  - type: number
  - default: `0`

- **angle**
    Maximum angle of light dispersion from its direction axis. Values must be between `0deg` and `90deg`. Only applied to spot lights.           

  - type: string
  - default: `60deg`

- **penumbra**
    Percentage of the attenuated part of the spotlight cone due to penumbra. Values must be between 0 and 1.  Only applied to spot lights.

  - type: number
  - default: `0`

### Rendering
**exposure**

Sets the exposure level of the tone mapping. Non-negative values are accepted.

  - type: number
  - default: `1`

**tone-mapping**

Sets the tone mapping type. Accepted values are `“none”`, `“linear”`, `“reinhard”`, `“cineon”`, `“aces”`, `“agx”`, and `“neutral”`.

  - type: string
  - default: `"aces"`

**anti-aliasing**

Sets the anti-aliasing method. Available options are “ssaa” and “msaa”.  

  - type: string
  - default: `"ssaa"`

**msaa-samples**

The number of MSAA samples used. Available values are integers between 1 and 8.

  - type: number
  - default: `8`

**ssaa-sample**

Base-2 logarithm of the number of SSAA samples used in anti-aliasing. The attribute is ignored if anti-aliasing is set to "msaa". Values are integers between 0 and 4.

  - type: number
  - default: `1`

**sharpen-strength**

Intensity of the sharpen pass. Values are between 0 and 1.

  - type: number
  - default: `0`

**bloom-strength**

Intensity of the Bloom pass. Values are between 0 and 1.

  - type: number
  - default: `0`

**bloom-radius**

Radius of the Bloom kernel. Values are numbers between 0 and 5.

  - type: number
  - default: `0`

**bloom-threshold**

Threshold in Bloom pass. Values are non-negative numbers.

  - type: number
  - default: `0.85`

**ssao-strength**

Strength of SSAO pass. Values are numbers between 0 and 20.

  - type: number
  - default: `4`

**ssao-radius**

Radius of SSAO pass. Values are numbers between 0 and 3.

  - type: number
  - default: `1`

**hue-shift**

Angle by which hue component of individual pixel colors is rotated. 

  - type: angle
  - default: `"0deg"`

**saturation**

Amount by which pixel colors are super-saturated or desaturated. Values are non-negative numbers.

  - type: number
  - default: `1`

**brightness**

Applies the linear multiplier to pixel colors. Values are between -1 and 1.

  - type: number
  - default: `0`

**contrast**

Sets the contrast factor of the rendered image. Values are numbers between 0 and 2.

  - type: number
  - default: `1`

**transparency-mode**

Transparency mode used when rendering transparent objects. Available values are `“normal”` and `“depth-write”`. If set to `"depth-write"`, transparent meshes will use the depth buffer when being rendered. This may improve the render quality of transparent meshes. 

  - type: string
  - default: `"normal"`

### Loading
**poster**

The URL of the poster image that will be displayed before the model is loaded.  

  - type: string
  - default: `""`

**loading**

Determines when the model and environment map start loading. Available options are `"lazy"`, `"eager"`, and `"hover"`. `"eager"` starts loading as soon as possible, `"lazy"` when element is near the viewport, and `"hover"` when the pointer enters the element.

  - type: string
  - default: `"lazy"`

### Augmented Reality
**usdz-src**

The URL of USD or USDZ model. This model is only used in AR on iOS devices.      

  - type: string
  - default: `""`

**auto-ar**

Launches the AR mode immediately when the model starts loading. Ignored if AR is not available. 

  - type: boolean
  - default: `false`

### Jewelry
**enable-jewelry**

Enables jewelry rendering mode. Models need to be pre-processed in VNTANA Platform in order for them to be augmented by jewelry-specific data structures.

  - type: boolean
  - default: `false`

**gem-anti-aliasing**

Enables anti-aliasing when rendering gems.

  - type: boolean
  - default: `false`

**gem-raytracing-depth**

The number of ray tracing steps used when rendering gems. Available values are integers between 0 and 6.

  - type: number
  - default: `4`

### Camera Controls
**disable-controls**

Disables camera controls in general, including panning and zoom.  

  - type: boolean
  - default: `false`

**disable-zoom**

Disables camera zoom.

  - type: boolean
  - default: `false`

**disable-pan**

Disables camera panning.

  - type: boolean
  - default: `false`

**enable-auto-rotate**

Enables camera auto rotate

  - type: boolean
  - default: `false`

**auto-rotate-per-second**

Angles traversed in one second of auto-rotate mode.

  - type: angle
  - default: `"30deg"`

**auto-rotate-delay**

Number of seconds without user interaction after which the auto-rotating starts.

  - type: number
  - default: `5`

**rotate-speed**

Sensitivity of rotation.     

  - type: number
  - default: `1.5`

**camera-target**

Starting point around which camera rotates.  

  - type: "<distance> <distance> <distance>"
  - default: center of model's bounding box
  - example: `"3m -1m 4m"`

**camera-spherical**

Starting spherical coordinates of camera with respect to camera's target. Note that the radius part is actually the distance of the camera to sphere of twice the model’s bounding sphere radius centered at the target divided by zoom factor (i.e. multiplied by tangent of half of field of view multiplied by some model dependent factor). 

  - type: "<distance> <angle> <angle>"
  - example: `"3m 20deg 40deg"`

**min-camera-spherical**

Lower bounds for camera spherical attributes.    

  - type: "<distance> <angle> <angle>"
  - example: `"3m 20deg 40deg"`

**max-camera-spherical**

Upper bounds for camera spherical attributes.  

  - type: "<distance> <angle> <angle>"
  - example: `"3m 20deg 40deg"`

### Other
**background**

A CSS string whose value is set as viewer's internal background property. Primarily useful when changing models with different backgrounds, since the update will be applied just before the new model is revealed.

  - type: string
  - default: ""
  - example: `"radial-gradient(purple, green)"`

### Events
Viewer dispatches the following events:   

**load**

Dispatched when model load is complete. During the next animation frame the poster will be removed and the model will become visible. Model's loading time in milliseconds can be obtained through `event.detail.time`.

**error**  

Dispatched when error is encountered during load.

**environment-change**

Dispatched when environment changes. The source of the environment can be obtained from `event.detail.src`.

**camera-change**  

Dispatched when position or field-of-view of viewer's camera changes in any way.

### Buttons
Viewer comes bundled with several UI web components. Each of them can be placed anywhere inside viewer’s DOM tree, and will be hidden if placed outside of some viewer’s DOM tree or it’s functionality isn’t supported on the current device.

**vntana-fs-button**

The element reflects the viewer’s fullscreen state, and toggles it when clicked. The element is hidden on mobile devices.

**vntana-qr-button**

When clicked, the viewer adds the overlay element with QR modal as viewer’s child. The URL encoded in QR can be passed through url attribute or property. The element is hidden on mobile devices and devices that support AR, or if jewelry mode is enabled.

**vntana-ar-button**

Clicking on this button activates the AR if available on the device. The element is hidden on devices that don’t support AR, or if jewelry mode is enabled.

**vntana-center-button**

Centers the viewer’s camera to its original position when clicked.

**vntana-zoom-in-button**

Zooms in the viewer’s camera while the button is being pressed.

**vntana-zoom-out-button**

Zooms out the viewer’s camera while the button is being pressed.


## Integration and Examples
This package comes with two scripts, each demonstrating different aspects of the viewer:

- `simple` - adds the viewer to a web page, and sets it up to display a 3d model with the environment map through the attribute interface,
- `integration` - fetches data from VNTANA Platform and applies it to the viewer through the property interface.

The accompanying `npm` package doesn't need any prior installation. In order to run the scripts it suffices
to execute `npm run simple` or `npm run integration` from the package’s root directory. Both scripts run the `http-server` and open the corresponding page in the browser.

Both examples utilize the content of the shared directory:

- `viewer.min.js` - ES module containing the VNTANA Viewer code,
- `viewer.umd.min.js` - UMD module containing the VNTANA Viewer code,
- `style.css` - styles used for this demo,
- `viewer.css` - default styles for the viewer and positioning of buttons.

### Simple Example

Directory simple contains the `index.html` containing the page's HTML code, the `chair.glb` model, and `Neutral.hdr` environment map. The body of the document is:

```html
  <body>
    <script type="module" src="../shared/viewer.min.js"></script>

    <vntana-viewer src="chair.glb" environment-src="Neutral.hdr" tone-mapping="neutral">
      <vntana-fs-button></vntana-fs-button>
    </vntana-viewer>
  </body>
```

Line `2` loads the ES module containing the viewer. Line `4` adds the viewer elements, sets the model through the `src` attribute and environment through `environment-src`. We also added the `tone-mapping` attribute to improve the lighting experience. `<vntana-fs-button>` is added as a child of the viewer, and toggles the viewer’s fullscreen state when clicked.

### Integration Example

Directory `integration` contains two files: `index.html` with HTML code for the page, and `platform.js` containing the function `getPlatformData`, which we will use to fetch the product data from VNTANA Platform.

**NOTE**: Function `getPlatformData` only works with products in Live Product state.

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
Classes button-container and zoom-buttons come as part of viewer’s default styling. Elements <vntana-qr-button> and <vntana-ar-button> are mutually exclusive, so at most one of them will be visible at any time. Unless we provide the URL that will be encode in the QR, <vntana-qr-button> won’t be visible.

Second part of the body handles the main purpose of this demo - loading the data from VNTANA Platform. We start by importing the getPlatformData function from file platform.js in the integration directory, and the normalize function to convert data stored in VNTANA Platform to viewer properties.
```js
  <script type="module">
    import {getPlatformData} from './platform.js';
    import {normalize} from '../viewer.min.js';

    const platformData = await getPlatformData(
      "asset-library",
      "furniture",
      "85a51c7b-07c1-4143-bd56-aa2a43acaa42"
    );
    platformData.config = normalize(platformData.config);

    const config = {
      src: platformData.src,
      usdzSrc: platformData.usdzSrc,
      poster: platformData.poster,
      ...platformData.config,
    };

    const viewer = document.querySelector("vntana-viewer");

    for (const [key, value] of Object.entries(config)) {
      viewer[key] = value; 
    }

    const qrButton = viewer.querySelector("vntana-qr-button");
    qrButton.url = platformData.qrUrl;
  </script>
```

The `getPlatformData` function accepts three parameters: organizationSlug, clientSlug, and productUuid. All three parameters can be easily obtained from VNTANA Platform links, since all platform links are of the form:

```
https://platform.vntana.com/<organizationSlug>/<clientSlug>/products/edit/<productUuid>
```

The function returns an object with the following properties:

- `src` - URL of the GLB model,
- `usdzSrc` - URL of the USDZ model,
- `poster` - URL of the poster/thumbnail,
- `qrUrl` - URL of the product’s embed link with autoAR enabled,
- `config` - config data for the viewer without links.

The `qrUrl` should in almost all cases be replaced with a different URL for custom integrations. After obtaining the platform data in lines `5-9`, we call the `normalize` function on the config obtained from `getPlatformData` in line `10`. In lines `12-17` we merge all the data into one config containing a list of `(key,value)` pairs that will be passed to the viewer. In line `19` we obtain a reference to the viewer, and pass it these pairs in lines `21-23`. We obtain the reference to the `<vntana-qr-button>` in line `25`, and pass it the `qrUrl` string.
