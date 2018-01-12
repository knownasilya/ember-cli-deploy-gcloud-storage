var path = require('path');
var storage = require('@google-cloud/storage');
var Promise = require('rsvp').Promise;

module.exports = function uploadToGCS(plugin, config) {
  var gcs = storage(config.gcloud);
  var bucket = gcs.bucket(config.bucket);

  return config.filePaths.reduce(function (previousPromise, filePath) {

    return previousPromise.then(function () {
      var basePath = path.join(config.fileBase, filePath);

      var isGzipped = config.gzippedFilePaths.indexOf(filePath) !== -1;

      return new Promise(function (resolve, reject) {
        var destinationFilePath = config.bucketFolder ? path.join(config.bucketFolder, filePath) : filePath;
        if (path.sep === "\\") {
          destinationFilePath = destinationFilePath.replace(/\\/g, "/")
        }
        var metadata = Object.assign({}, isGzipped ? {contentEncoding:"gzip"} : {}, config.metadata);
        return bucket.upload(basePath, {
          destination:destinationFilePath,
          metadata:metadata,
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
    })

  }, Promise.resolve());
};
