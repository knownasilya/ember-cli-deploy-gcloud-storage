'use strict';

var minimatch = require('minimatch');
var BasePlugin = require('ember-cli-deploy-plugin');
var Promise = require('rsvp').Promise;
var upload = require('./libs/upload');

module.exports = {
  name: require('./package').name,

  createDeployPlugin: function (options) {
    var Plugin = BasePlugin.extend({
      name: options.name,

      // eslint-disable-next-line ember/avoid-leaking-state-in-ember-objects
      defaultConfig: {
        bucket: 'ember',
        filePattern:
          '**/*.{js,css,png,gif,ico,jpg,map,xml,txt,svg,swf,eot,ttf,woff,woff2}',
        distFiles: function (context) {
          return context.distFiles || [];
        },
        gzippedFiles: function (context) {
          return context.gzippedFiles || []; // e.g. from ember-cli-deploy-gzip
        },
      },

      upload: function (context) {
        var self = this;
        var credentials = this.readConfig('credentials');
        var keyFilename = this.readConfig('keyFilename');
        var projectId = this.readConfig('projectId');
        var bucket = this.readConfig('bucket');
        var bucketFolder = this.readConfig('bucketFolder');
        var distFiles = this.readConfig('distFiles');
        var gzippedFiles = this.readConfig('gzippedFiles');
        var filePattern = this.readConfig('filePattern');
        var metadata = this.readConfig('metadata');
        var makePublic = this.readConfig('makePublic');
        var filesToUpload = distFiles.filter(
          minimatch.filter(filePattern, { matchBase: true })
        );

        this.log('uploading..');

        var config = {
          bucket,
          bucketFolder,
          fileBase: context.distDir,
          filePaths: filesToUpload,
          gzippedFilePaths: gzippedFiles,
          metadata,
          makePublic,
          gcloud: {},
        };

        if (projectId) {
          config.gcloud.projectId = projectId;
        }

        if (keyFilename) {
          config.gcloud.keyFilename = keyFilename;
        } else if (credentials) {
          config.gcloud.credentials = credentials;
        }

        return upload(this, config)
          .then(function (filesUploaded) {
            self.log('uploaded ' + filesUploaded.length + ' files ok', {
              verbose: true,
            });
            return { filesUploaded };
          })
          .catch(this._errorMessage.bind(this));
      },

      _errorMessage: function (error) {
        this.log(error, { color: 'red' });

        if (error) {
          this.log(error.stack, { color: 'red' });
        }

        return Promise.reject(error);
      },
    });

    return new Plugin();
  },
};
