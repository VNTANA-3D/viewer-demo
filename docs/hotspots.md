## Hotspots
Defines an interactive pin to be placed in the viewer. The pin has position and normal so that
 it can be placed 'on' the model and move according to camera changes. Pass the content you wish to see in each hotspot,
 as shown in the below example. This can be a clickable element that presents info in a pop-up or side bar, it doesn't
 need to be something that shows within the viewer.
```
<vntana-viewer>
 <vntana-hotspot model-index="0" position="0m 0m 0m" normal="0m 0m 0m">Sample Hotspot with text.</vntana-hotspot>
 <vntana-hotspot model-index="0" position="0.1m 0m 0m" normal="0m 0m 0m">Second Hotspot</vntana-hotspot>
 </vntana-viewer>
```
### position
The position in 3D space that the hotspot is placed. Default is '0m 0m 0m'.
### normal
The normal of the Hotspot. This allows the pin to show as 'behind' the model when the camera is rotated
 in such a manner as to hide the point the Hotspot was placed at. Default '0m 0m 0m'.
### path
Used for models with animations, provides necessary info to keep the hotspot aligned to the correct
 point on the mesh throughout the animation. Value is a string consisting of the intersection data for the model 
 where the pin should be placed. `mesh primitive vertices uvw instance`.
## Hotspots
Defines an interactive pin to be placed in the viewer. The pin has position and normal so that
 it can be placed 'on' the model and move according to camera changes. Pass the content you wish to see in each hotspot,
 as shown in the below example. This can be a clickable element that presents info in a pop-up or side bar, it doesn't
 need to be something that shows within the viewer.
```
<vntana-viewer>
 <vntana-hotspot model-index="0" position="0m 0m 0m" normal="0m 0m 0m">Sample Hotspot with text.</vntana-hotspot>
 <vntana-hotspot model-index="0" position="0.1m 0m 0m" normal="0m 0m 0m">Second Hotspot</vntana-hotspot>
 </vntana-viewer>
```
### position
The position in 3D space that the hotspot is placed. Default is '0m 0m 0m'.
### normal
The normal of the Hotspot. This allows the pin to show as 'behind' the model when the camera is rotated
 in such a manner as to hide the point the Hotspot was placed at. Default '0m 0m 0m'.
### path
Used for models with animations, provides necessary info to keep the hotspot aligned to the correct
 point on the mesh throughout the animation. Value is a string consisting of the intersection data for the model 
 where the pin should be placed. `mesh primitive vertices uvw instance`.
