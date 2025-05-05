const HOTSPOTS = [
    {
        uuid: "1234",
        position: "-0.1367755660251938m 0.14091226533415163m -0.17081878268826056m",
        normal: "0.011286838677453451m 0.2210472277310288m 0.975197790391824m",
        text: "Small wooden chair. Assembly required.",
        camera: {
            "cameraTarget": "-0.1454469091251151r 0.28785415994673513r -0.3266632037766982r",
            "cameraDistance": "2.053222072680714r",
            "cameraRotation": "-0.34235289193959395rad -0.86091721757028rad 0rad",
            "fieldOfView": "0.3370957926012502rad",
            "orthographicSize": "0.3493809947499236r"
        }
    },
    {
        uuid: "4321",
        position: "0.08575423080059036m -0.26943821079189845m 0.32541498600589813m",
        normal: "0.8381646016900038m 0.16072632456524075m 0.5211978022455448m",
        text: "Capacity 300lbs.",
        camera: {
            "cameraTarget": "0.004832226101951511r -0.1976785682937156r -0.2890812516001159r",
            "cameraDistance": "2.743782226240391r",
            "cameraRotation": "-0.09565746861892066rad 0.0604152433382652rad 0rad",
            "fieldOfView": "0.7853981633974483rad",
            "orthographicSize": "1.1365118103070138r"
        }
    }
];

const requestHotspotData = async () => {
    return HOTSPOTS
}

function createHotspot( data ) {
    // Create Hotspot
    let hotspot = document.createElement("vntana-hotspot")
    hotspot.position = data.position
    hotspot.normal = data.normal
    
    // Create Hotspot Details Display
    let hotspotDetails = document.createElement("div")
    hotspotDetails.classList.add("hidden")
    hotspotDetails.classList.add("hotspot-details")

    // If the information to display isn't stored with the hotspot position data, you should retrieve it first
    let hotspotText = document.createElement("p")
    hotspotText.textContent = data.text
    hotspotDetails.append(hotspotText)
    hotspot.appendChild(hotspotDetails)

    hotspot.addEventListener("click", (e) => {
        hotspot.getElementsByClassName("hotspot-details")[0].classList.toggle("hidden")
        if (!!data.camera)
            moveCamera(data.camera)
    })

    document.addEventListener("mousedown", (event) => {
        hotspot._mouseDownInside = hotspot.contains(event.target)
    })

    document.addEventListener("mouseup", (event) => {
        const mouseUpInside = hotspot.contains(event.target);

        if (!hotspot._mouseDownInside && !mouseUpInside) {
            hotspot.getElementsByClassName("hotspot-details")[0].classList.add("hidden")
        }
    })

    return hotspot
}

function moveCamera(camera) {
    const viewer = document.querySelector("vntana-viewer");

    viewer.setCameraRotation(camera.cameraRotation)
    viewer.setCameraDistance(camera.cameraDistance)
    viewer.setCameraTarget(camera.cameraTarget)
    viewer.setCameraFoV(camera.fieldOfView)
    viewer.setOrthographicSize(camera.orthographicSize)
}