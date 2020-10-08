var path = require('path');
var { Storage } = require('@google-cloud/storage');
var Promise = require('rsvp').Promise;
var chunk = require('lodash.chunk');

module.exports = function uploadToGCS(plugin, config) {
  const storage = new Storage(config.gcloud);
  const bucket = storage.bucket(config.bucket);

  const chunkedFilePaths = chunk(config.filePaths, 50);

  return chunkedFilePaths.reduce(function (previous, chunk) {
    return previous.then(function () {
      return Promise.all(
        chunk.map(function (filePath) {
          var basePath = path.join(config.fileBase, filePath);

          var isGzipped = config.gzippedFilePaths.indexOf(filePath) !== -1;

          return new Promise(function (resolve, reject) {
            var destinationFilePath = config.bucketFolder
              ? path.join(config.bucketFolder, filePath)
              : filePath;
            if (path.sep === '\\') {
              destinationFilePath = destinationFilePath.replace(/\\/g, '/');
            }
            var metadata = Object.assign(
              {},
              isGzipped ? { contentEncoding: 'gzip' } : {},
              config.metadata
            );

            return bucket.upload(
              basePath,
              {
                destination: destinationFilePath,
                metadata: metadata,
                gzip: !isGzipped,
              },
              function (err, file) {
                if (err) {
                  return reject(err);
                }

                // for uniform permission buckets this fails because it tries to get/set an ACL on the object
                if (config.makePublic) {
                  file.makePublic(function (err, res) {
                    if (err) {
                      return reject(err);
                    }
                  });
                }

                // verify the uploaded file
                file.download({ validation: false }, function (err, contents) {
                  if (err) {
                    return reject(err);
                  }

                  plugin.log('✔  ' + filePath, { verbose: true });
                  resolve(contents.toString('utf8'));
                });
              }
            );
          });
        })
      );
    });
  }, Promise.resolve());
};
