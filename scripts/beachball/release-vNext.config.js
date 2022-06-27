// @ts-check

require('../ts-node-register');
const fs = require('fs').promises;
const path = require('path');

const { getConfig } = require('./utils');
const { config: sharedConfig } = require('./shared.config');

const { scope, groupConfig } = getConfig({ version: 'vNext' });

/**
 * @type {typeof sharedConfig}
 */
const config = {
  registry:
    'https://uifabric.pkgs.visualstudio.com/4ed167b9-ac3a-405b-b967-443af8db8961/_packaging/release-test/npm/registry/',
  hooks: {
    prepublish: async packagePath => {
      console.log('write .npm file', packagePath);
      const npmrc = `
        ; begin auth token
//uifabric.pkgs.visualstudio.com/4ed167b9-ac3a-405b-b967-443af8db8961/_packaging/release-test/npm/registry/:username=uifabric
//uifabric.pkgs.visualstudio.com/4ed167b9-ac3a-405b-b967-443af8db8961/_packaging/release-test/npm/registry/:_password=${process.env.ADO_TOKEN}
//uifabric.pkgs.visualstudio.com/4ed167b9-ac3a-405b-b967-443af8db8961/_packaging/release-test/npm/registry/:email=npm requires email to be set but doesn't use the value
//uifabric.pkgs.visualstudio.com/4ed167b9-ac3a-405b-b967-443af8db8961/_packaging/release-test/npm/:username=uifabric
//uifabric.pkgs.visualstudio.com/4ed167b9-ac3a-405b-b967-443af8db8961/_packaging/release-test/npm/:_password=${process.env.ADO_TOKEN}
//uifabric.pkgs.visualstudio.com/4ed167b9-ac3a-405b-b967-443af8db8961/_packaging/release-test/npm/:email=npm requires email to be set but doesn't use the value
; end auth token
      `;
      await fs.writeFile(path.resolve(packagePath, '.npmrc'), npmrc);
    },
  },
  ...sharedConfig,
  branch: 'origin/experiment/9-release',
  scope: [...sharedConfig.scope, ...scope],
  changelog: {
    ...sharedConfig.changelog,
    groups: [groupConfig],
    customRenderers: {},
  },
};

module.exports = config;
