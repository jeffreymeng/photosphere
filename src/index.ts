import {Viewer, GyroscopePlugin} from 'photo-sphere-viewer';
import {parse, stringify as stringifyQueryString} from "query-string";

// @ts-ignore
import demoImage from './img/demo.png';


let queryStringParams = parse(location.search);
const getQuery = (name: string): string => (typeof queryStringParams[name] === "object" ? queryStringParams[name][0] : queryStringParams[name] || "") as string


const idMap = {demo: demoImage};
const imageToRender = idMap[getQuery("id")] || getQuery("url");
if (imageToRender) {
    let viewer;
    viewer = new Viewer({
        container: document.querySelector('#viewer'),
        panorama: imageToRender,
        plugins: [
            // GyroscopePlugin,
        ],
        minFov: getQuery("maxZoom") || 30, // maxZoom (degrees)
        maxFov: getQuery("minZoom") || 90, // minZoom (degrees)
        defaultZoomLvl: parseFloat(getQuery("zoom")) || 50, // (percent)
        defaultLong: getQuery("long") || 0,
        defaultLat: getQuery("lat") || 0,
        caption: getQuery("caption"),
        navbar: [
            'autorotate',
            'zoom',
            "download",
            'fullscreen',
            {
                id: 'permalink-current-view',
                content: 'Permalink Current View',
                title: 'Permalink Current View',
                className: 'permalink-current-view-button',
                onClick: () => {
                    const pos = viewer.getPosition();
                    const zoom = viewer.getZoomLevel();
                    queryStringParams = {
                        ...queryStringParams,
                        long: pos.longitude,
                        lat: pos.latitude,
                        zoom: zoom,
                    };
                    const newQueryString = stringifyQueryString(queryStringParams);
                    const newUrl = window.location.protocol + "//" + window.location.host + window.location.pathname + '?' + newQueryString;

                    if (history.pushState) {
                        window.history.pushState({path: newUrl}, '', newUrl);
                    } else {
                        window.location.href = newUrl;
                    }
                }
            },
            'caption',

        ]
    });
} else {
    (document.querySelector('#viewer') as HTMLElement).style.display = 'none';
    [...(document.querySelectorAll('.main') as unknown as HTMLElement[])].forEach(el => {
        el.style.display = 'block'
    });
    const imageUrlEl = document.getElementById("image-url") as HTMLInputElement;

    imageUrlEl.addEventListener("input", () => {
        (document.getElementById("viewer-url") as HTMLInputElement).value = `https://photosphere.jeffkmeng.com/?url=${encodeURIComponent(imageUrlEl.value)}`
    });

    document.getElementById("viewer-url-clip").addEventListener("click", () => {
        navigator.clipboard.writeText((document.getElementById("viewer-url") as HTMLInputElement).value)
    });
}
