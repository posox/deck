'use strict';

const angular = require('angular');
import _ from 'lodash';

import { ACCOUNT_SERVICE } from '@spinnaker/core';
import {HelmProviderSettings} from '../../helm.settings';

module.exports = angular.module('spinnaker.helm.clusterCommandBuilder.service', [
  ACCOUNT_SERVICE
])
  .factory('helmClusterCommandBuilder', function (accountService) {
    function attemptToSetValidCredentials(application, defaultAccount, command) {
      return accountService.listAccounts('helm').then(function(helmAccounts) {
        var helmAccountNames = _.map(helmAccounts, 'name');
        var firstHelmAccount = null;

        if (application.accounts.length) {
          firstHelmAccount = _.find(application.accounts, function(applicationAccount) {
            return helmAccountNames.includes(applicationAccount);
          });
        } else if (helmAccountNames.length) {
          firstHelmAccount = helmAccountNames[0];
        }

        var defaultAccountIsValid = defaultAccount && helmAccountNames.includes(defaultAccount);

        command.account =
          defaultAccountIsValid ? defaultAccount : (firstHelmAccount ? firstHelmAccount : 'my-account-name');
      });
    }

    function buildNewClusterCommand(application, defaults = {}) {
      const defaultAccount = defaults.account || HelmProviderSettings.defaults.account;

      var command = {
        credentials: defaultAccount,
        application: application.name,
        targetSize: 1,
        cloudProvider: 'helm',
        selectedProvider: 'helm',
        viewState: {
          mode: defaults.mode || 'create',
          disableStrategySelection: true,
          useAutoscaler: false,
        },
        capacity: {
          min: 0,
          desired: 0,
          max: 1,
        },
<<<<<<< HEAD
        namespace: application.namespace,
        region: application.namespace,
=======
        namespace: 'sr',
        region: 'sr',
>>>>>>> 0d3d9c793... Base UI implementation for Helm clouddriver
      };

      // if (application && application.attributes) {
      //   command.interestingHealthProviderNames = [];
      // }

      attemptToSetValidCredentials(application, defaultAccount, command);

      return command;

    }

    function buildClusterCommandFromExisting(application, existing, mode) {

    }

    return {
      buildNewClusterCommand: buildNewClusterCommand,
      buildClusterCommandFromExisting: buildClusterCommandFromExisting,
    };
  });
