const Astronomy = require('./utils/astronomy.js');
const DateTime = require('./utils/datetime');

const Bodies = ['Sun', 'Moon', 'Mercury', 'Venus', 'Mars', 'Jupiter', 'Saturn', 'Uranus', 'Neptune', 'Pluto'];

function ParseDate(text) {
    const d = new Date(text);
    if (!Number.isFinite(d.getTime())) {
        return new Date();
    }
    return d;
}

class Sky {
    constructor(opts = {}) {
        const defaults = {
            elevation: 0,
            time: new Date(),
        };

        let options = Object.assign({}, defaults, opts);

        this.latitude = options.latitude;
        this.longitude = options.longitude;
        this.observer = new Astronomy.Observer(options.latitude, options.longitude, 0);
        this.date = ParseDate(options.time);
    }

    get(options = {}) {
        let output = [];
        for (let body of Bodies) {
            let item = {
                name: body,
            };

            const date = new Date();

            let equ_2000 = Astronomy.Equator(body, this.date, this.observer, false, true);
            let equ_ofdate = Astronomy.Equator(body, this.date, this.observer, true, true);
            let hor = Astronomy.Horizon(this.date, this.observer, equ_ofdate.ra, equ_ofdate.dec, 'normal');

            item.aboveHorizon = hor.altitude > 0;
            item.altitude = hor.altitude;
            item.azimuth = hor.azimuth;
            item.rightAscension = equ_2000.ra;
            item.declination = equ_2000.dec;

            output.push(item);
        }

        if (options.onlyAboveHorizon) {
            output = output.filter((item) => item.aboveHorizon === true);
        }

        return output;
    }
}

module.exports = Sky;
