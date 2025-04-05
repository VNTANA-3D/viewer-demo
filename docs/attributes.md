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

- **booleans** All string values are treated as `true`, while booleans are treated as-is.

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

* [Scene](#scene)

* [Controls](#controls)

* [Rendering](#rendering)

* [Lighting](#lighting)

* [Jewelry](#jewelry)

* [Loading](#loading)

* [Utility](#utility)

## Scene
Attributes related to the scene that gets loaded. Set the GLB model to load, AR behavior, as well
 as adjust the model's scale and/or rotation.

### src
A URL to a glTF or glB model to load in the web viewer.
#### Example
```
// Script
 const viewer = document.querySelector('vntana-viewer');
 viewer.src = ./DamagedHelmet.glb;
 
 --- or ---
 
 <!-- HTML -->
 <vntana-viewer src='./DamagedHelmet.glb'></vntana-viewer>
```
### scale
Model's scaling factors in X, Y, and Z directions.
```
auto: 1 1 1
```
### rotation
Euler angles specifying rotation of the model around X, Y and Z axes. Rotations are applied
 in YXZ order, that is, the model is first rotated around Z axis, then X, then Y.
```
Accepted Values: (-Infinity, Infinity)
auto: 0deg 0deg 0deg
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
[Back to Top](#attributes-reference)
## Controls
Attributes to control the camera. Includes the ability to restrict certain camera movements, disable
 some or all camera controls entirely, and generally change various camera settings such as the camera type itself. Camera settings
 such as `cameraRotation` and `fieldOfView` are the initial values used when the model loads or the `center` button is clicked, they
 are not storing the current values when interacting with the camera.

### disableZoom (disable-zoom)
Disables camera zoom. Default `false`.
### disablePan (disable-pan)
Disables camera panning. Default `false`.
### disableRotation (disable-rotation)
Diables camera rotation. Default `false`.
### disableControls (disable-controls)
Disables camera controls in general, including panning and zoom. Default `false`.
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
auto: 15deg
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
Accepted Values: [0, 180]
auto: 18deg
```
### maxFieldOfView (max-field-of-view)
The maximum value (degrees or radians) the Field of View will be clamped to. Only for Perspective Camera
```
Accepted Values: [0, 180]
auto: 45deg
```
### fieldOfView (field-of-view)
Vertical FoV. Values in degrees `deg` or radians `rad`. Determines how much of the scene is visible in the camera's view. While distance remains the same, 
 changing FoV will result in larger/smaller objects in the scene as more or less area becomes visible. Used as is for Perspective camera,
 or used to calculate `orthographicSize` for Orthographic camera. Default is "45deg".
```
Accepted Values: [0, 180]
auto: 45deg
```
### minCameraDistance (min-camera-distance)
The minimum distance to clamp the camera to. Non-negative values accepted.
```
auto: 2r
```
### maxCameraDistance (max-camera-distance)
The maximum distance to clamp the camera to. Default is calculated as a scaling factor of radius using the default
 field of view (`45deg`). Non-negative values accepted.
### cameraDistance (camera-distance)
Distance to the target from the camera. Default is calculated as a scaling factor of radius using the default
 field of view (`45deg`). Non-negative values accepted.
### minOrthographicSize (min-orthographic-size)
The minimum value the Orthographic camera frustum can have. Default is calculated 
 using default minimum FoV and default minimum `cameraDistance`, in meters. Non-negative values accepted.
### maxOrthographicSize (max-orthographic-size)
The maximum value the Orthographic camera frustum can have. Default is calculated 
 using default FoV and default `cameraDistance`, in meters. Non-negative values accepted.
### orthographicSize (orthographic-size)
Size of the camera frustum for Orthographic Camera. A smaller value makes the model appear
 bigger or closer to the camera. Default calculated based on default `fieldOfView` and `cameraDistance`, in meters. 
 Non-negative values accepted.
### minCameraRotation (min-camera-rotation)
Clamps minimum rotation angles for pitch, yaw, roll. Default value "90deg -Infinity 0deg" where `-Infinity`
 means unbounded. Each rotation angle has its own `domain` defining allowable values, however `roll` cannot be set and must be `0<units>`.
```
Accepted Values: [-90, 90] (-Infinity, Infinity) [0 0]
auto: -90deg -Infinity 0deg
```
### maxCameraRotation (max-camera-rotation)
Clamps maximum rotation angles for pitch, yaw, roll. Default value "90deg +Infinity 0deg" where `+Infinity` 
 means unbounded. Each rotation angle has its own `domain` defining allowable values, however `roll` cannot be set and must be `0<units>`.
```
Accepted Values: [-90, 90] (-Infinity, Infinity) [0 0]
auto: 90deg +Infinity 0deg
```
### cameraRotation (camera-rotation)
The initial Euler angles of the camera upon load. Value is a string representing the three rotations to make: rotation
 about the X axis (pitch), rotation about the Y axis (yaw), and rotation about the Z axis (roll). At this time, roll cannot be set to a custom
 value and must be set to `0deg` or `0rad`.
 Units are in degrees or radians. Default "-15deg 0deg 0deg". Each rotation angle has its own `domain` defining allowable values. 
 This is the rotation reset to when the center button is clicked.
```
Accepted Values: [-90, 90] (-Infinity, Infinity) [0 0]
auto: -15deg 0deg 0deg
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
Starting point around which the camera rotates. Default is center of model's bounding box.
```
auto: 0m 0m 0m
```
### cameraType (camera-type)
Indicates which type of camera to employ: `perspective` (default) or `orthographic`.
```
Accepted Values: perspective, orthographic
auto: perspective
```
### cameraAspect (camera-aspect)
Aspect ratio based on the current type of camera. Setting to `null` will calculate this value.
```
Accepted Values: [0, Infinity)
```
[Back to Top](#attributes-reference)
## Rendering
Attributes available to control the scene rendering. Exposes various post-processing effects such as anti-aliasing, 
 ssao, and tone mapping.

### exposure
Controls the level of exposure for tone mapping, affecting the perceived brightness of the scene. Default 1.
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
Sets the method for anti-aliasing from ssaa or msaa. Default is ssaa.
```
Accepted Values: ssaa, msaa
auto: ssaa
```
### msaaSamples (msaa-samples)
The number of samples used for MSAA. Default value is 8.
Property domain is an `Integer Interval`, passing non-integer values will result in their discarding and the defaults set.
```
Accepted Values: [1, 8]
auto: 8
```
### ssaaSamples (ssaa-samples)
The logarithm of SSAA samples. Default value is 0.
```
Accepted Values: (1, 16)
auto: 1
```
### sharpenStrength (sharpen-strength)
Sets the intensity of the sharpen pass. Default value is 0.
```
Accepted Values: [0, 1]
```
### bloomStrength (bloom-strength)
Sets the intensity of the Bloom pass. This setting produces the effect of bright light on a camera, 
 creating fringes of light extending beyond the borders of a bright area. Default value is 0.
```
Accepted Values: [0, Infinity)
```
### bloomRadius (bloom-radius)
The radius of the Bloom kernel. Larger values produce a wider, softer glow while smaller values will create
 a more concentrated, sharp glow. Default value is 0.
```
Accepted Values: [0, 5]
```
### bloomThreshold (bloom-threshold)
Indicates the brightness threshold a pixel must meet to contribute to the bloom effect. Default value is 0.85.
```
Accepted Values: [0, Infinity)
auto: 0.85
```
### ssaoStrength (ssao-strength)
Controls the intensity of the shadowing applied to occluded areas. Higher value results in darker occluded areas 
 which may look unnatural if overdone. Default 4.
```
Accepted Values: [0, 20]
auto: 4
```
### ssaoRadius (ssao-radius)
Determines how far the occlusion effect spreads. Default 1.
```
Accepted Values: [0, 3]
auto: 1
```
### enableSsr (enable-ssr)
Setting this flag will enable screen space reflections.
### hueShift (hue-shift)
Angle by which hue component of individual pixel colors is rotated. Accepts degrees or radians, default is 0.
```
Accepted Values: [0, 6.283185307179586]
auto: 0rad
```
### saturation
Amount by which pixel colors are super-saturated or desaturated. Default 1.
```
Accepted Values: [0, Infinity)
auto: 1
```
### brightness
Applies the linear multiplier to pixel colors. Default 0.
```
Accepted Values: [-1, 1]
```
### contrast
Sets the contrast factor of the rendered image. Default 1.
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
### environmentRotation (environment-rotation)
Euler angles specifying environment rotation around X, Y, and Z axes.
 Rotations are applied in YXZ order, meaning the model is first rotated around Z axis, then X, then Y.
```
Accepted Values: (-Infinity, Infinity)
auto: 0deg 0deg 0deg
```
### skybox
Indicates whether the environment map should be used as the scene's background.
### shadowIntensity (shadow-intensity)
Intensity of the ground shadow cast by the model. Default 0.
```
Accepted Values: [0, 1]
```
### shadowRadius (shadow-radius)
Radius of blur kernal used when rendering shadows. Default 2.
```
Accepted Values: [0, 20]
auto: 2
```
### shadowSamples (shadow-samples)
Number of samples used when blurring the shadow. Default 16.
Property domain is an `Integer Interval`, passing non-integer values will result in their discarding and the defaults set.
```
Accepted Values: [1, Infinity)
auto: 16
```
### shadowResolution (shadow-resolution)
The resolution of the shadow map. Default 512, accepts [1,Infinity). Recommended to use power of two values 
 such as 256, 512, 1024, etc.
Property domain is an `Integer Interval`, passing non-integer values will result in their discarding and the defaults set.
```
Accepted Values: [1, Infinity)
auto: 512
```
### shadowOffset (shadow-offset)
Vertical offset of the plane onto which the shadow is cast. Zero shadow offset renders the shadow
 in the horizontal plane passing through the base of the model's bounding box. Can be expressed as a strict distance in
 units `m, cm, mm` or a coefficient of `r, w, d, h`. The units need to be included in the passed value, i.e. `0h`.
```
auto: 0h
```
### lightRigIntensity (light-rig-intensity)
Number value scaling the intensity of all light rigs. Default 1.
```
Accepted Values: [0, Infinity)
auto: 1
```
### lightRigColor (light-rig-color)
Adds a color to light rigs. Accepts colors in hex format, default `null` meaning no color override.
### lightRig (light-rig)
Defines light rig configurations to be added to the scene. Unless hideModelLights is set, these will
 not be set in place of any model lights, but instead applied in conjunction with the model lights.
 There are three types of accepted lights: `directional`, `point`, and `spot`. `directional` and `point` use the same
 configuration, while `spot` expects additional values. All three types consist of the properties `intensity`, `color`,
 `position`, and `direction`, while `spot` lights also include `angle` and `penumbra`.
 
 The `lightRig` is passed as a ';' separated list of lights, in a single string such as:
 `directional intensity 1 color #ffffff position 0m 0m 0m direction 0m 1m 0m`
 where we see the structure `type property1 property1Value property2 property2Value...`
#### Example
```
const viewer = document.querySelector('vntana-viewer');
 viewer.lightRig = "directional intensity 1 color #ffffff position 0m 0m 0m direction -0.024428939559004506m 0.6049951951138368m 0.7958542836482022m; directional intensity 1 color #ffffff position 0m 0m 0m direction 0m 1m 0m;"
```
### hideModelLights (hide-model-lights)
'Disables' all lights within the model by setting their intensity to 0.
[Back to Top](#attributes-reference)
## Jewelry
Attributes for use when loading jewelry models.

### enableJewelry (enable-jewelry)
Enables jewelry rendering mode. Models need to be pre-processed in the VNTANA Platform in order
 for them to be augmented by jewelry-specific data structures.
### gemAntiAliasing (gem-anti-aliasing)
Enables anti-aliasing when rendering gems.
### gemRayTracingDepth (gem-ray-tracing-depth)
The number of ray tracing steps used when rendering gems. 
 Available values are integers between 1 and 6.
Property domain is an `Integer Interval`, passing non-integer values will result in their discarding and the defaults set.
```
Accepted Values: [1, 6]
auto: 4
```
[Back to Top](#attributes-reference)
## Loading
Attributes for the load behavior and whether to display a placeholder image during loading or not.

### loading
Indicates what type of loading type to employ when loading the model and setting up the scene. `lazy` is the default option. `hover` 
 is used on showroom viewers.
```
Accepted Values: lazy, eager, hover
auto: lazy
```
### poster
A URL to a poster/thumbnail image to be displayed while the model is loading.
#### Example
```
<!-- HTML -->
 <vntana-viewer poster='./DamagedHelmet.png'></vntana-viewer>
 
 // Script
 const viewer = document.querySelector('vntana-viewer');
 viewer.poster = './DamagedHelmet.png';
```
[Back to Top](#attributes-reference)
## Utility
Attributes related to the appearance of the viewer. Currently just allows the setting of the background
 color.

### background
Sets the background for the scene. Can be any valid CSS including an image, hex code, transparent, or a radial-gradient.
 Default is `transparent`.
```
auto: transparent
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
## Attributes Reference
