const moongose = require('mongoose'),
  Schema = moongose.Schema,
  Feature = require('../models/feature');

class FeaturesRepository {
  // get all the features
  getFeatures(callback) {
    Feature.count((err, featuresCount) => {
      var count = featuresCount;
      console.log(`Features count: ${count}`);

      Feature.find({}, (err, features) => {
        if (err) {
          console.log(`*** FeaturesRepository.getFeatures error: ${err}`);
          return callback(err);
        }
        callback(null, {
          count: count,
          features: features,
        });
      });
    });
  }

  // insert a  feature
  insertFeature(body, callback) {
    console.log('*** FeaturesRepository.insertFeature');
    var feature = new Feature();
    console.log(body);

    feature.type = body.type;
    feature.features = body.features;
    feature.week = body.week;
    feature.year = body.year;

    feature.save((err, feature) => {
      if (err) {
        console.log(`*** FeaturesRepository insertFeature error: ${err}`);
        return callback(err, null);
      }

      callback(null, feature);
    });
  }

  updateFeature(id, body, callback) {
    console.log('*** FeaturesRepository.editFeature');

    Feature.findById(id, (err, feature) => {
      if (err) {
        console.log(`*** FeaturesRepository.editFeature error: ${err}`);
        return callback(err);
      }

      feature.type = body.type || feature.type;
      feature.geometry = body.geometry || feature.geometry;
      feature.properties = body.properties || feature.properties;

      feature.save((err, feature) => {
        if (err) {
          console.log(`*** FeaturesRepository.updateFeature error: ${err}`);
          return callback(err, null);
        }

        callback(null, feature);
      });
    });
  }

  // delete a feature
  deleteFeature(id, callback) {
    console.log('*** FeaturesRepository.deleteFeature');
    Feature.remove({ _id: id }, (err, feature) => {
      if (err) {
        console.log(`*** FeaturesRepository.deleteFeature error: ${err}`);
        return callback(err, null);
      }
      callback(null, feature);
    });
  }
}

module.exports = new FeaturesRepository();
