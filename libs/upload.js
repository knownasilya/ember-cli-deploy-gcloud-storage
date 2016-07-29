var path = require('path');
var gcloud = require('gcloud');
var Promise = require('ember-cli/lib/ext/promise');

module.exports = function uploadToGCS(plugin, config) {
  var cloud = gcloud(config.gcloud);
  var gcs = cloud.storage();
  var bucket = gcs.bucket(config.bucket);

  return Promise.all(config.filePaths.map(function (filePath) {
    var basePath = path.join(config.fileBase, filePath);
    var isGzipped = config.gzippedFilePaths.indexOf(filePath) !== -1;

    return new Promise(function (resolve, reject) {
      var destinationFilePath = config.bucketFolder ? path.join(config.bucketFolder, filePath) : filePath;

      return bucket.upload(basePath, {
        destination: destinationFilePath,
        gzip: !isGzipped
      }, function (err, file) {
        if (err) {
          return reject(err);
        }

        file.makePublic(function (err, res) {
          if (err) {
            return reject(err);
          }

          file.download({ validation: false }, function(err, contents) {
            if (err) {
              return reject(err);
            }

            plugin.log('✔  ' + filePath, { verbose: true });
            resolve(contents.toString('utf8'));
          });
        });
      });
    });
  }));
};
