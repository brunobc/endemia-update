const featuteRepo = require('../../lib/featuresRepository'),
  util = require('util');

class FeaturesController {
  constructor(router) {
    router.get('/features', this.getFeatures);
    router.post('/features/list', this.insertFeature);
    router.put('/:id', this.updateFeature.bind(this));
    router.delete('/:id', this.deleteFeature.bind(this));
  }

  getFeatures(req, res) {
    console.log('*** getFeatures');

    featuteRepo.getFeatures((err, data) => {
      if (err) {
        console.log('*** getFeatures error: ' + util.inspect(err));
        res.json(null);
      } else {
        console.log('*** getFeatures ok');
        res.json(data.features);
      }
    });
  }

  insertFeature(req, res) {
    console.log('*** insertFeature');

    // console.log(req.body);
    // res.json([]);

    featuteRepo.insertFeature(req.body, (err, feature) => {
      if (err) {
        console.log(
          '*** featuteRepo.insertFeature error: ' + util.inspect(err)
        );
        res.json({ status: false, error: 'Insert failed', feature: null });
      } else {
        console.log('*** insertFeature ok');
        res.json({ status: true, error: null, feature: feature });
      }
    });
  }

  updateFeature(req, res) {
    console.log('*** updateFeature');
    console.log('*** req.body');
    console.log(req.body);

    featuteRepo.updateFeature(req.params.id, req.body, (err, feature) => {
      if (err) {
        console.log('*** updateFeature error: ' + util.inspect(err));
        res.json({ status: false, error: 'Update failed', feature: null });
      } else {
        console.log('*** updateFeature ok');
        res.json({ status: true, error: null, feature: feature });
      }
    });
  }

  deleteFeature(req, res) {
    console.log('*** deleteFeature');

    featuteRepo.deleteFeature(req.params.id, (err) => {
      if (err) {
        console.log('*** deleteFeature error: ' + util.inspect(err));
        res.json({ status: false });
      } else {
        console.log('*** deleteFeature ok');
        res.json({ status: true });
      }
    });
  }
}

module.exports = FeaturesController;
