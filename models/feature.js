const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const listFeaturesSchema = new Schema({
    latitude: { type: String, required: true },
    longitude: { type: String, required: true }
});

const FeatureSchema = new Schema({
    type: { type: String, required: true },
    features: [listFeaturesSchema],
    week: { type: String, required: true },
    year: { type: String, required: true },
});

module.exports = mongoose.model('Feature', FeatureSchema, 'features');