const Sky = require('./sky');
const DateTime = require('./utils/datetime');

module.exports = (req, res, next) => {
    const latitude = Number(req.query.latitude) || 5;
    const longitude = Number(req.query.longitude) || 30;
    const time = req.query.time || new Date();

    const sky = new Sky({
        time,
        latitude,
        longitude,
    });

    const data = sky.get();
    const links = { self: req.protocol + '://' + req.get('host') + req.originalUrl };

    return res.json({
        meta: {
            time,
            latitude,
            longitude,
        },
        data,
        links,
    });
};
