const Sky = require('./sky');
const DateTime = require('./utils/datetime');

module.exports = (req, res, next) => {
    const latitude = Number(req.query.latitude) || 32.78;
    const longitude = Number(req.query.longitude) || -96.84;
    const elevation = Number(req.query.elevation) || null;
    let time = DateTime.root.utc(req.query.time);

    if (isNaN(Date.parse(time))) {
        time = DateTime.root.utc(Date.now());
    }

    const sky = new Sky({
        time: time.toDate(),
        latitude,
        longitude,
        elevation,
    });

    const data = sky.get({ showCoords: req.query.showCoords });
    const links = { self: req.protocol + '://' + req.get('host') + req.originalUrl };

    return res.json({
        meta: {
            time: time.format(),
            latitude,
            longitude,
            elevation,
        },
        data,
        links,
    });
};
