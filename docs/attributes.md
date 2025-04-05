## Attributes and Properties
The viewer can be configured either through HTML attribute manipulation or JavaScript properties.

Attributes are passed as strings, with the exception of boolean attributes whose presence or
absence indicate whether the value is true or false. For example, if we wanted to set shadow 
intensity to `0.3` and enable auto-rotation of the camera, we would use:
```
<vntana-viewer shadow-intensity="0.3" enable-auto-rotate></vntana-viewer>
```
The JavaScript interface is more appropriate if viewer parameters will change during the component’s lifetime. 
Attribute values are automatically reflected in property values, but the converse doesn’t hold - changing property values won’t change the attributes. For example, when we set `shadow-intensity` to `0.3`, the viewer’s `shadowIntensity` property will be set to `0.3`.
```
<vntana-viewer></vntana-viewer>
<script type="module">
  const viewer = document.querySelector("vntana-viewer");
  // Setting viewer properties
  viewer.shadowIntensity = 0.3;
  viewer.enableAutoRotate = true;
</script>
```

Each property has an associated type, a default value, and the set of values it accepts. All property values are
initially set to `null`, which indicates the default value is used, and setting the value to `null` can generally
be used to reset the value of the property. When using the attribute interface, user can specify the `"auto"` value
to reset the value to its default (except for string and boolean attributes) or remove the attribute. Attribute's corresponding
property value will in both cases be set to `null`. If the property is set to an invalid or out-of-range value, its 
value will be set to `null` and the warning will be displayed in the console.

Most property value types fit into one of the following categories:

- **strings** Strings are treated as-is without any modification.

- **booleans** All string values are treated as `true`, while booleans are treated as-is. All boolean
properties default to false.

- **colors** Properties accept six-digit hex color codes (for example, `"#aabbcc"`).

- **options** Accepts string values from a predefined set of available options.

- **numbers** Accepts numbers and strings, where strings will be automatically converted to numbers. 

- **angles** Specified as strings containing number-unit pairs. Available units are radians (`"rad"`, default) and
degrees (`"deg"`). If a number is passed, it will be converted to string of the form `"<number>rad"`. Example: `"20deg"`.

- **rotations** Triplets of angle values. Example: `"20deg 2rad -10deg"`.

- **offsets** Specified as strings containing number-unit pairs. Available units can be absolute or relative
to the model. Absolute units are meters (`"m"`, default), centimeters (`"cm"`), and millimeters (`"mm"`), while relative
units are radius (`"r"`), width (`"w"`), height (`"h"`), and depth (`"d"`). Width, height, and depth refer to dimensions
of model's bounding box, while radius refers to the radius of model's bounding sphere centered at the center of model's
bounding box. If the model's dimension changes, relative units will be internally updated. Example: `"20m"`.

- **positions** Triplets of offset values. Example: `"20m 3r 40h"`.

Except for strings, multiple blanks in the specified strings are ignored.

## Property/Attribute Reference

* [Model](#model)

* [Controls](#controls)

* [Rendering](#rendering)

* [Lighting](#lighting)

* [Jewelry](#jewelry)

* [Loading](#loading)

* [Augmented Reality](#augmented-reality)

* [Utility](#utility)

## Model
Attributes related to the model that gets loaded. 

### src
A URL to a glTF or glB model to load in the web viewer.
```
auto: ""
```

### scale
Model's scaling factors in X, Y, and Z directions.
```
auto: "1 1 1"
```
### rotation
Euler angles specifying rotation of the model around X, Y and Z axes. Rotations are applied
 in YXZ order, that is, the model is first rotated around Z axis, then X, then Y.
```
Accepted Values: (-Infinity, Infinity) (-Infinity, Infinity) (-Infinity, Infinity)
auto: "0deg 0deg 0deg"
```
[Back to Top](#attributes-reference)
## Controls
Attributes to control the camera. Includes the ability to restrict certain camera movements, disable
 some or all camera controls entirely, and generally change various camera settings such as the camera type itself. Camera settings
 such as `cameraRotation` and `fieldOfView` are the initial values used when the model loads or the `center` button is clicked, they
 are not storing the current values when interacting with the camera.

### disableZoom (disable-zoom)
Disables camera zoom through pointer events.
### disablePan (disable-pan)
Disables camera panning through pointer events.
### disableRotation (disable-rotation)
Diables camera rotation through pointer events.
### disableControls (disable-controls)
Disables camera controls in general.
### rotationSensitivity (rotation-sensitivity)
How responsive the camera rotation is when the user engages rotation input. Higher sensitivity
 would result in quicker rotation. Does not impact autoRotate settings.
```
Accepted Values: (-Infinity, Infinity)
auto: 1.5
```
### panSensitivity (pan-sensitivity)
How responsive the camera movement is horizontally or vertically when the user engages
 pan inputs. Higher sensitivity results in a quicker or more drastic movement.
```
Accepted Values: (-Infinity, Infinity)
auto: 1
```
### zoomSensitivity (zoom-sensitivity)
How responsive the camera movement closer to or farther from the model
 is in response to user input. Higher sensitivity would produce a quicker or more drastic movement.
 This setting also influences the zoom using the zoom in/out buttons.
```
Accepted Values: (-Infinity, Infinity)
auto: 1
```
### enableAutoRotate (enable-auto-rotate)
Enables automatic rotation of camera. Use `autoRotateSpeed` and `autoRotateDelay` to control
 the visual.
### autoRotateSpeed (auto-rotate-speed)
Angle traversed in one second of auto-rotate mode.
```
Accepted Values: (-Infinity, Infinity)
auto: "15deg"
```
### autoRotateDelay (auto-rotate-delay)
Number of seconds without user interaction after which the auto-rotating starts.
```
Accepted Values: [0, Infinity)
auto: 5
```
### minFieldOfView (min-field-of-view)
The minimum value (degrees or radians) the Field of View will be clamped to. Only for Perspective Camera
```
Accepted Values: [0deg, 180deg]
auto: "18deg"
```
### maxFieldOfView (max-field-of-view)
The maximum value (degrees or radians) the Field of View will be clamped to. Only for Perspective Camera
```
Accepted Values: [0deg, 180deg]
auto: "45deg"
```
### fieldOfView (field-of-view)
Vertical field of view. Determines how much of the scene is visible in the camera's view. While distance remains the same, 
 changing field of view will result in larger/smaller objects in the scene as more or less area becomes visible. Used as is for Perspective camera.
```
Accepted Values: [0deg, 180deg]
auto: "45deg"
```
### minCameraDistance (min-camera-distance)
The minimum distance to clamp the camera to.
```
Accepted Values: [0m, Infinity)
auto: "2r"
```
### maxCameraDistance (max-camera-distance)
The maximum distance to clamp the camera to. Default is calculated as a scaling factor of radius using the default
 field of view (`45deg`). 
```
Accepted Values: [0m, Infinity)
```

### cameraDistance (camera-distance)
Distance to the target from the camera. Default is calculated as a scaling factor of radius using the default
 field of view (`45deg`). 
```
Accepted Values: [0m, Infinity)
```
### minOrthographicSize (min-orthographic-size)
The minimum value the Orthographic camera frustum can have. Default is calculated 
 using default minimum FoV and default minimum `cameraDistance`, in meters.
```
Accepted Values: [0m, Infinity)
```

### maxOrthographicSize (max-orthographic-size)
The maximum value the Orthographic camera frustum can have. Default is calculated 
 using default FoV and default `cameraDistance`, in meters. 
```
Accepted Values: [0m, Infinity)
```

### orthographicSize (orthographic-size)
Size of the camera frustum for Orthographic Camera. A smaller value makes the model appear
 bigger or closer to the camera. Default calculated based on default `fieldOfView` and `cameraDistance`, in meters. 
```
Accepted Values: [0m, Infinity)
```

### minCameraRotation (min-camera-rotation)
Clamps minimum rotation angles for pitch, yaw, roll. 
Each rotation angle has its own domain defining allowable values, however `roll` cannot be set and must be `0<units>`.
```
Accepted Values: [-90deg, 90deg] (-Infinity, Infinity) [0 0]
auto: "-90deg -Infinity 0deg"
```
### maxCameraRotation (max-camera-rotation)
Clamps maximum rotation angles for pitch, yaw, roll. 
 Each rotation angle has its own domain defining allowable values, however `roll` cannot be set and must be `0<units>`.
```
Accepted Values: [-90deg, 90deg] (-Infinity, Infinity) [0 0]
auto: "90deg +Infinity 0deg"
```
### cameraRotation (camera-rotation)
The initial Euler angles of the camera upon load. Value is a string representing the three rotations to make: rotation
 about the X axis (pitch), rotation about the Y axis (yaw), and rotation about the Z axis (roll). At this time, roll cannot be set to a custom
 value and must be set to `0deg` or `0rad`.
 Units are in degrees or radians. Default "-15deg 0deg 0deg". Each rotation angle has its own `domain` defining allowable values. 
 This is the rotation reset to when the center button is clicked.
```
Accepted Values: [-90deg, 90deg] (-Infinity, Infinity) [0 0]
auto: "-15deg 0deg 0deg"
```
#### Example
```
// Script
 const viewer = document.querySelector('vntana-viewer');
 viewer.cameraRotation = "0deg 30deg 0deg";
 
 <!-- HTML -->
 <vntana-viewer camera-rotation="0deg 30deg 0deg"></vntana-viewer>
```
### cameraTarget (camera-target)
Coordinates of the initial point around which the camera rotates. Coordinates are specified
relative to model's bounding box.
```
Accepted Values: (-Infinity, Infinity) (-Infinity, Infinity) (-Infinity, Infinity)
auto: "0m 0m 0m"
```
### cameraType (camera-type)
Indicates which type of camera to employ: `perspective` (default) or `orthographic`.
```
Accepted Values: perspective, orthographic
auto: perspective
```
### cameraAspect (camera-aspect)
Aspect ratio based on the current type of camera. Default values is computed so that
model fits the screen from all possible rotation angles, if possible.

```
Accepted Values: [0, Infinity)
```
[Back to Top](#attributes-reference)
## Rendering
Attributes available to control the scene rendering. Exposes various post-processing effects such as anti-aliasing, 
 SSAO, and tone mapping.

### exposure
Controls the level of exposure for tone mapping, affecting the perceived brightness of the scene.
```
Accepted Values: [0, Infinity)
auto: 1
```
### toneMapping (tone-mappin)
Sets the tone mapping type which is used to approximate the appearance of HDR on the LDR medium of 
 a standard computer monitor or mobile device's screen.
```
Accepted Values: none, linear, reinhard, cineon, aces, agx, neutral
auto: aces
```
### antiAliasing (anti-aliasing)
Sets the method for anti-aliasing to SSAA or MSAA.
```
Accepted Values: ssaa, msaa
auto: ssaa
```
### msaaSamples (msaa-samples)
The number of samples used for MSAA. Accepted values are integers in the specified range.
```
Accepted Values: [1, 8]
auto: 8
```
### ssaaSamples (ssaa-samples)
The number of SSAA samples. Accepted values are power-of-two values in the specified range.
```
Accepted Values: (1, 16)
auto: 1
```
### sharpenStrength (sharpen-strength)
Sets the intensity of the sharpen pass.
```
Accepted Values: [0, 1]
auto: 0
```
### bloomStrength (bloom-strength)
Sets the intensity of the Bloom pass. This setting produces the effect of bright light on a camera, 
 creating fringes of light extending beyond the borders of a bright area.
```
Accepted Values: [0, Infinity)
auto: 0
```
### bloomRadius (bloom-radius)
The radius of the Bloom kernel. Larger values produce a wider, softer glow while smaller values will create
 a more concentrated, sharp glow.
```
Accepted Values: [0, 5]
auto: 0
```
### bloomThreshold (bloom-threshold)
Indicates the brightness threshold a pixel must meet to contribute to the bloom effect.
```
Accepted Values: [0, Infinity)
auto: 0.85
```
### ssaoStrength (ssao-strength)
Controls the intensity of the shadowing applied to occluded areas. Higher value results in darker occluded areas 
 which may look unnatural if overdone.
```
Accepted Values: [0, 20]
auto: 4
```
### ssaoRadius (ssao-radius)
Determines how far the occlusion effect spreads.
```
Accepted Values: [0, 3]
auto: 1
```
### enableSsr (enable-ssr)
Setting this flag will enable screen space reflections.

### hueShift (hue-shift)
Angle by which hue component of individual pixel colors is rotated.
```
Accepted Values: [0, 360deg]
auto: "0deg"
```
### saturation
Amount by which pixel colors are super-saturated or desaturated.
```
Accepted Values: [0, Infinity)
auto: 1
```
### brightness
Applies the linear multiplier to pixel colors.
```
Accepted Values: [-1, 1]
auto: 0
```
### contrast
Sets the contrast factor of the rendered image.
```
Accepted Values: [0, 2]
auto: 1
```
### transparencyMode (transparency-mode)
Transparency mode is used when rendering transparent objects. Available options are normal and depth-write.
 If set to depth-write, transparent meshes will use the depth buffer when being rendered. This may improve render quality of transparent
 meshes. Default is normal.
```
Accepted Values: normal, depth-write
auto: normal
```
[Back to Top](#attributes-reference)

## Lighting
Controls for Lighting and Shadows in the scene, including the Environment map. Lighting controls
 for both the lights present in the model and custom lighting to add to the scene.

### environmentSrc (environment-src)
A URL to the HDR file containing the equirectangular environment map.
```
auto: ""
```

### environmentRotation (environment-rotation)
Euler angles specifying environment rotation around X, Y, and Z axes.
Rotations are applied in YXZ order, meaning the model is first rotated around Z axis, then X, then Y.
```
Accepted Values: (-Infinity, Infinity) (-Infinity, Infinity) (-Infinity, Infinity)
auto: "0deg 0deg 0deg"
```
### skybox
Indicates whether the environment map should be used as the scene's background.

### shadowIntensity (shadow-intensity)
Intensity of the ground shadow cast by the model.
```
Accepted Values: [0, 1]
auto: 0
```
### shadowRadius (shadow-radius)
Radius of blur kernal used when rendering shadows.
```
Accepted Values: [0, 20]
auto: 2
```
### shadowSamples (shadow-samples)
Number of samples used when blurring the shadow. Accepted values are integers in the specified range.
```
Accepted Values: [1, Infinity)
auto: 16
```
### shadowResolution (shadow-resolution)
The resolution of the shadow map. Default 512, accepts [1,Infinity). 
Accepted values are integers in the specified range.
```
Accepted Values: [1, Infinity)
auto: 512
```
### shadowOffset (shadow-offset)
Vertical offset of the plane onto which the shadow is cast. Zero shadow offset renders the shadow
in the horizontal plane passing through the base of the model's bounding box. 
 
```
Accepted Values: (-Infinity, Infinity)
auto: 0h
```

### lightRigIntensity (light-rig-intensity)
Number value scaling the intensity of all light rigs.
```
Accepted Values: [0, Infinity)
auto: 1
```
### lightRigColor (light-rig-color)
Overrides the color of individual lights in the light rig. Setting the value to `null` indicates
colors shouldn't be overridden.
```
auto: null
```

### lightRig (light-rig)
Specifies an additional lights that will be added to the scene alongside the lights present in 
the model. The list of lights is a `;` separated list of individual light configurations in a single string.
Each light configuration starts with the type of the light (`directional`, `point`, `spot`) followed by
different light properties. Directional lights have properties `intensity`, `color`, `position`, and `direction`,
point lights accept `intensity`, `color`, `position`, and `distance`, while spot lights have `intensity`,
`color`, `position`, `direction`, `distance`, `angle`, and `penumbra`. Example:
 `directional intensity 1 color #ffffff position 0m 0m 0m direction 0m 1m 0m`

#### Example
```
const viewer = document.querySelector('vntana-viewer');
 viewer.lightRig = 
 "
  directional intensity 1 color #ffffff position 0m 0m 0m direction -0.024428939559004506m 0.6049951951138368m 0.7958542836482022m;
  directional intensity 1 color #ffffff position 0m 0m 0m direction 0m 1m 0m;
 "
```
### hideModelLights (hide-model-lights)
Hides all lights from the loaded model.

[Back to Top](#attributes-reference)
## Jewelry
Attributes for use when loading jewelry models.

### enableJewelry (enable-jewelry)
Enables jewelry rendering mode. Models need to be pre-processed in the VNTANA Platform in order
for them to be augmented by jewelry-specific data structures.

### gemAntiAliasing (gem-anti-aliasing)
Enables anti-aliasing when rendering gems.

### gemRayTracingDepth (gem-ray-tracing-depth)
The number of ray tracing steps used when rendering gems. Accepted values are integers in the specified range.
```
Accepted Values: [1, 6]
auto: 4
```
[Back to Top](#attributes-reference)

## Loading
Attributes for the load behavior and whether to display a placeholder image during loading or not.

### loading
Indicates what type of loading strategy to employ when loading the model and setting up the scene. 
`"eager"` starts loading as soon as possible, `"lazy"` when element is near the viewport, and `"hover"` 
when the pointer enters the element.
```
Accepted Values: lazy, eager, hover
auto: lazy
```
### poster
A URL to a poster/thumbnail image to be displayed while the model is loading.
```
auto: ""
```

#### Example
```
<!-- HTML -->
 <vntana-viewer poster='./DamagedHelmet.png'></vntana-viewer>
 
 // Script
 const viewer = document.querySelector('vntana-viewer');
 viewer.poster = './DamagedHelmet.png';
```
[Back to Top](#attributes-reference)

## Augmented Reality
### usdzSrc (usdz-src)
A URL to a USDZ model to load in AR on iOS devices. HTML attribute is `usdz-src`.
#### Example
```
// Script
 const viewer = document.querySelector('vntana-viewer');
 viewer.usdzSrc = ./DamagedHelmet.usdz;
 
 --- or ---
 
 <!-- HTML -->
 <vntana-viewer src='' usdz-src='./DamagedHelmet.usdz'></vntana-viewer>
```

### autoAR (auto-ar)
Determines whether AR should launch once the model loads. Only used if AR is available and ARMode is 
 determined to be `native`. HTML attribute form is `auto-ar`.
#### Example
```
// Script
 const viewer = document.querySelector('vntana-viewer');
 viewer.autoAR = true;
 
 --- or ---
 
 <!-- HTML -->
 <vntana-viewer src='' auto-ar></vntana-viewer>
```

## Utility
Attributes related to the appearance of the viewer. Currently just allows the setting of the background
 color.

### background
Sets the CSS style for the viewer's background. Primarily useful when changing between models with different backgrounds, since the update will be applied just before the new model is revealed.
```
auto: "transparent"
```
#### Example
```
const viewer = document.querySelector('vntana-viewer');
 viewer.background = '#ffffff';
 ---
 viewer.background = 'transparent';
 ---
 viewer.background = 'radial-gradient("#000000","#ffffff")';
```
[Back to Top](#attributes-reference)
