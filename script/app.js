let viewer;

const drawPano = async (setDate, latPos, lonPos) => {
    panorama = new PANOLENS.ImagePanorama('img/gray_pier.webp');
    const planetData = await getPlanetData(latPos, lonPos, setDate);

    for (const planet of planetData.data) {
        if (planet.aboveHorizon) {
            imgurl = 'img/objects/' + planet.name + '.png';
            spot = new PANOLENS.Infospot(350, imgurl);
            y = (planet.altitude / 90) * 5000;
            deg2rad = (Math.PI * 2) / 360;
            z = Math.sin(deg2rad * planet.azimuth) * 5000;
            x = Math.cos(deg2rad * planet.azimuth) * 5000;

            spot.position.set(x, y, z);
            spot.addHoverText(planet.name, -200);
            spot.addEventListener('click', function () {
                this.focus();
            });
            panorama.add(spot);
            if (planet.name == 'Sun') {
            }
        }
    }
    viewer.add(panorama);
};

const createViewer = () => {
    const panoContainer = document.querySelector('.js-panorama');
    viewer = new PANOLENS.Viewer({ output: 'console', container: panoContainer, autoHideInfospot: false });
};

function onFocus() {
    this.focus(parameters.duration, TWEEN.Easing[parameters.curve][parameters.easing]);
}

const planetsEndPoint = 'https://horizonviewapi.azurewebsites.net/?';
const customHeaders = new Headers();
customHeaders.append('Accept', 'application/json');

const getPlanetData = async (lat, lon, setDate) => {
    let endPoint = planetsEndPoint + 'latitude=' + lat + '&longitude=' + lon + '&time=' + setDate;
    console.log(endPoint);
    return await getData(endPoint);
};

const createDatePicker = () => {
    var test = flatpickr('.flatpickr', {
        enableTime: true,
        defaultDate: Date.now(),
        onChange: function (selectedDates, dateStr, instance) {
            viewer.dispose();
            drawPano(dateStr.replace(' ', 'T'));
        },
    });
    console.log();
};

const updatePano = () => {
    console.log('ready');
};

const getData = (endPoint) => fetch(endPoint, { headers: customHeaders }).then((r) => r.json());

function getPosition() {
    navigator.geolocation.getCurrentPosition(
        function (location) {
            currDate = document.querySelector('.flatpickr').value.replace(' ', 'T');
            latPos = location.coords.latitude;
            lonPos = location.coords.longitude;
            drawPano(currDate, latPos, lonPos);
        },
        function () {
            currDate = document.querySelector('.flatpickr').value.replace(' ', 'T');
            alert('No location data found, defaulting to: lat 5, lon 30');
            drawPano(currDate);
        }
    );
}

document.addEventListener('DOMContentLoaded', function () {
    createDatePicker();
    createViewer();
    getPosition();
});
