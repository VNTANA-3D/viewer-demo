import {createHotspot, requestHotspotData} from "./hotspots.js";

const viewer = document.querySelector("vntana-viewer")
viewer.src = "../shared/assets/chair.glb";
viewer.environmentSrc = "../shared/Neutral.hdr";
viewer.toneMapping = "neutral";

const hotspots = await requestHotspotData();

for (const hs of hotspots) {
  let hotspot = createHotspot(hs)
  viewer.appendChild(hotspot)
}
