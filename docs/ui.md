## UI Buttons
## vntana-ar-button
Creates a button element to allow opening of AR when `ARMode` is `native` or open
 the WebXR modal if the `ARMode` is `webxr`. Styling does need to be applied to ensure the button appears in 
 frame. See example below.
```
<style>
  vntana-ar-button {
    position: absolute;
    top: 19px;
    left: 19px;
    z-index: 4;
  }
 </style>
 <vntana-viewer>
  <vntana-ar-button></vntana-ar-button>
 </vntana-viewer>
```
## vntana-center-button
Creates a button to re-center the scene to the initial settings. This entails
 resetting `cameraTarget`, `cameraDistance`, `cameraRotation`, `filedOfView` and `orthographicSize`. Styling
 does need to be applied to ensure the button appears in frame. See example below.
```
<style>
  vntana-center-button {
    position: absolute;
    top: 19px;
    right: 19px;
    z-index: 1;
  }
 </style>
 <vntana-viewer>
  <vntana-center-button></vntana-center-button>
 </vntana-viewer>
```
## vntana-fs-button
Creates a button element to trigger fullscreen for the viewer. Styling 
 does need to be applied to ensure the button appears in frame. See example below.
```
<style>
  vntana-fs-button {
    position: absolute;
    right: 19px;
    bottom: 25px;
    z-index: 2;
  }
 </style>
 <vntana-viewer>
  <vntana-fs-button></vntana-fs-button>
 </vntana-viewer>
```
## vntana-qr-button
Creates a button element to trigger the QR modal to pop-up. This button
 is shown in the case that `ARMode` is `none`. The modal generates a QR code a user can scan
 to open the same viewer on an ideally AR compatible device. Styling does need to be applied to ensure
 the button appears in frame. See example below.
```
<style>
  vntana-qr-button {
    position: absolute;
    top: 19px;
    left: 19px;
    z-index: 4;
  }
 </style>
 <vntana-viewer>
  <vntana-qr-button url=''></vntana-qr-button>
 </vntana-viewer>
```
#### url
The URL to be embedded within the QR code. This URL should be a the same URL of the page
 currently hosting the viewer. The format of the QR code's content is just a URL, if a device requires 
 any other format the QR code will have to be generated manually.
## vntana-zoom-in-button
Creates a button element to trigger a consistent zoom in of the camera. Each click of the button
 will zoom by the same factor, allowing for a more controlled zoom experience. For both the zoom buttons, we recommend adding to
 a div and styling just that.
This factor value is multipled by the `zoomSensitivity` before being used to calculate the new fov/top and radius, 
 depending on `cameraType`. This is not exposed to users.
```
<style>
  .zoom-buttons {
    position: absolute;
    right: 19px;
    bottom: 85px;
    z-index: 3;
    flex-direction: column;
  }
 </style>
 <vntana-viewer>
  <div class="zoom-buttons">
    <vntana-zoom-in-button></vntana-zoom-in-button>
    <vntana-zoom-out-button></vntana-zoom-out-button>
  </div>
 </vntana-viewer>
```
## vntana-zoom-out-button
Creates a button element to trigger a consistent zoom out of the camera. Each click of the button
 will zoom by the same factor, allowing for a more controlled zoom experience.
This factor value is multipled by the `zoomSensitivity` before being used to calculate the new fov/top and radius, 
 depending on `cameraType`. This is not exposed to users.
```
<style>
  .zoom-buttons {
    position: absolute;
    right: 19px;
    bottom: 85px;
    z-index: 3;
    flex-direction: column;
  }
 </style>
 <vntana-viewer>
  <div class="zoom-buttons">
    <vntana-zoom-in-button></vntana-zoom-in-button>
    <vntana-zoom-out-button></vntana-zoom-out-button>
  </div>
 </vntana-viewer>
```
## UI Buttons
## vntana-ar-button
Creates a button element to allow opening of AR when `ARMode` is `native` or open
 the WebXR modal if the `ARMode` is `webxr`. Styling does need to be applied to ensure the button appears in 
 frame. See example below.
```
<style>
  vntana-ar-button {
    position: absolute;
    top: 19px;
    left: 19px;
    z-index: 4;
  }
 </style>
 <vntana-viewer>
  <vntana-ar-button></vntana-ar-button>
 </vntana-viewer>
```
## vntana-center-button
Creates a button to re-center the scene to the initial settings. This entails
 resetting `cameraTarget`, `cameraDistance`, `cameraRotation`, `filedOfView` and `orthographicSize`. Styling
 does need to be applied to ensure the button appears in frame. See example below.
```
<style>
  vntana-center-button {
    position: absolute;
    top: 19px;
    right: 19px;
    z-index: 1;
  }
 </style>
 <vntana-viewer>
  <vntana-center-button></vntana-center-button>
 </vntana-viewer>
```
## vntana-fs-button
Creates a button element to trigger fullscreen for the viewer. Styling 
 does need to be applied to ensure the button appears in frame. See example below.
```
<style>
  vntana-fs-button {
    position: absolute;
    right: 19px;
    bottom: 25px;
    z-index: 2;
  }
 </style>
 <vntana-viewer>
  <vntana-fs-button></vntana-fs-button>
 </vntana-viewer>
```
## vntana-qr-button
Creates a button element to trigger the QR modal to pop-up. This button
 is shown in the case that `ARMode` is `none`. The modal generates a QR code a user can scan
 to open the same viewer on an ideally AR compatible device. Styling does need to be applied to ensure
 the button appears in frame. See example below.
```
<style>
  vntana-qr-button {
    position: absolute;
    top: 19px;
    left: 19px;
    z-index: 4;
  }
 </style>
 <vntana-viewer>
  <vntana-qr-button url=''></vntana-qr-button>
 </vntana-viewer>
```
#### url
The URL to be embedded within the QR code. This URL should be a the same URL of the page
 currently hosting the viewer. The format of the QR code's content is just a URL, if a device requires 
 any other format the QR code will have to be generated manually.
## vntana-zoom-in-button
Creates a button element to trigger a consistent zoom in of the camera. Each click of the button
 will zoom by the same factor, allowing for a more controlled zoom experience. For both the zoom buttons, we recommend adding to
 a div and styling just that.
This factor value is multipled by the `zoomSensitivity` before being used to calculate the new fov/top and radius, 
 depending on `cameraType`. This is not exposed to users.
```
<style>
  .zoom-buttons {
    position: absolute;
    right: 19px;
    bottom: 85px;
    z-index: 3;
    flex-direction: column;
  }
 </style>
 <vntana-viewer>
  <div class="zoom-buttons">
    <vntana-zoom-in-button></vntana-zoom-in-button>
    <vntana-zoom-out-button></vntana-zoom-out-button>
  </div>
 </vntana-viewer>
```
## vntana-zoom-out-button
Creates a button element to trigger a consistent zoom out of the camera. Each click of the button
 will zoom by the same factor, allowing for a more controlled zoom experience.
This factor value is multipled by the `zoomSensitivity` before being used to calculate the new fov/top and radius, 
 depending on `cameraType`. This is not exposed to users.
```
<style>
  .zoom-buttons {
    position: absolute;
    right: 19px;
    bottom: 85px;
    z-index: 3;
    flex-direction: column;
  }
 </style>
 <vntana-viewer>
  <div class="zoom-buttons">
    <vntana-zoom-in-button></vntana-zoom-in-button>
    <vntana-zoom-out-button></vntana-zoom-out-button>
  </div>
 </vntana-viewer>
```
