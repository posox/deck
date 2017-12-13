import { module } from 'angular';

import { CLOUD_PROVIDER_REGISTRY, DeploymentStrategyRegistry, CloudProviderRegistry } from '@spinnaker/core';

import './logo/helm.logo.less';

// load all templates into the $templateCache
const templates = require.context('./', true, /\.html$/);
templates.keys().forEach(function(key) {
  templates(key);
});

export const HELM_MODULE = 'spinnaker.helm';
module(HELM_MODULE, [
  CLOUD_PROVIDER_REGISTRY,
  require('./cluster/cluster.helm.module.js').name,
  require('./serverGroup/configure/CommandBuilder.js').name,
  require('./serverGroup/configure/configure.helm.module.js').name,
  require('./serverGroup/details/details.helm.module.js').name,
  require('./serverGroup/paramsMixin.js').name,
  require('./serverGroup/transformer.js').name,
])
  .config((cloudProviderRegistryProvider: CloudProviderRegistry) => {
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
