'use strict';

let angular = require('angular');

import { CLOUD_PROVIDER_REGISTRY, DeploymentStrategyRegistry } from '@spinnaker/core';

import './logo/helm.logo.less';

var templates = require.context('./', true, /\.html$/);
templates.keys().forEach(function(key) {
  templates(key);
});

module.exports = angular.module('spinnaker.helm', [
  CLOUD_PROVIDER_REGISTRY,
  require('./cluster/cluster.helm.module.js'),
  require('./serverGroup/configure/CommandBuilder.js'),
  require('./serverGroup/configure/configure.helm.module.js'),
  require('./serverGroup/details/details.helm.module.js'),
  require('./serverGroup/paramsMixin.js'),
  require('./serverGroup/transformer.js'),
])
  .config(function(cloudProviderRegistryProvider) {
    cloudProviderRegistryProvider.registerProvider('helm', {
      name: 'Helm',
      logo: {
        path: require('./logo/helm.logo.png'),
      },
      serverGroup: {
        transformer: 'helmServerGroupTransformer',
        cloneServerGroupController: 'helmCloneServerGroupController',
        cloneServerGroupTemplateUrl: require('./serverGroup/configure/wizard/wizard.html'),
        commandBuilder: 'helmServerGroupCommandBuilder',
        configurationService: 'helmServerGroupConfigurationService',
        detailsTemplateUrl: require('./serverGroup/details/details.html'),
        detailsController: 'helmServerGroupDetailsController',
        paramsMixin: 'helmServerGroupParamsMixin',
      },
    });
  });

DeploymentStrategyRegistry.registerProvider('helm', ['custom', 'redblack']);
