require('dotenv').config();
const cloudinary = require('cloudinary').v2;
cloudinary.config({
    cloud_name: "dpgncpd4i",
    api_key: "729568674526815",
    api_secret: "oaStYHEt6a0sfV4xwm_38qDwNIg"
});

module.exports = { cloudinary };
