# ember-cli-deploy-gcloud-storage

An Ember-CLI-Deploy plugin to upload assets to Google Cloud Storage.

[![NPM][npm-badge-img]][npm-badge-link]
[![Build Status][travis-badge]][travis-badge-url]
[![Ember Observer Score][ember-observer-badge]][ember-observer-url]

## Quick Start

To get up and running quickly, do the following:

- Install [ember-cli-deploy] first.
- Ensure [ember-cli-deploy-build] is installed and configured.
- Install this plugin

```bash
ember install ember-cli-deploy-gcloud-storage
```

- Place the following configuration into `config/deploy.js`

```javascript
ENV['gcloud-storage'] = {
  credentials: {
    'private_key': '<your-private-key>',
    'client_email': '<your-client-email>',
  },
  projectId: '<your-gcloud-project-id>',
  bucket: '<your-storage-bucket>'
};
```

- Run the pipeline

```bash
ember deploy production
```

## TODO

- [ ] Create bucket if it doesn't exist
- [ ] Support a manifest file
- [ ] Add more of the options that the s3 plugin has
- [ ] Tests

## Contributing

See [CONTRIBUTING.md].


[npm-badge-img]: https://badge.fury.io/js/ember-cli-deploy-gcloud-storage.svg
[npm-badge-link]: http://badge.fury.io/js/ember-cli-deploy-gcloud-storage
[travis-badge]: https://travis-ci.org/knownasilya/ember-cli-deploy-gcloud-storage.svg
[travis-badge-url]: https://travis-ci.org/knownasilya/ember-cli-deploy-gcloud-storage
[ember-observer-badge]: http://emberobserver.com/badges/ember-cli-deploy-gcloud-storage.svg
[ember-observer-url]: http://emberobserver.com/addons/ember-cli-deploy-gcloud-storage
[ember-cli-deploy]: https://github.com/ember-cli-deploy/ember-cli-deploy
[ember-cli-deploy-build]: https://github.com/ember-cli-deploy/ember-cli-deploy-build
[CONTRIBUTING.md]: CONTRIBUTING.md
