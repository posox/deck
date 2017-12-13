'use strict';
const angular = require('angular');
import _ from 'lodash';

import { ACCOUNT_SERVICE } from '@spinnaker/core';

module.exports = angular.module('spinnaker.serverGroup.configure.helm.configuration.service', [
  ACCOUNT_SERVICE,
])
  .factory('helmServerGroupConfigurationService', function($q, accountService) {
    function configureCommand(application, command) {
      return $q.all({
        accounts: accountService.listAccounts('helm'),
      }).then(function (backingData) {
        backingData.filtered = {};
        command.backingData = backingData;
        var accountMap = _.fromPairs(_.map(backingData.accounts, function(account) {
          return [account.name, accountService.getAccountDetails(account.name)];
        }));

        return $q.all(accountMap).then(function(accountMap) {
          command.backingData.accountMap = accountMap;
          configureAccount(command);
        });
      });
    }

    function configureAccount(command) {
      var result = { dirty: {} };
      command.backingData.account = command.backingData.accountMap[command.account];
      if (command.backingData.account) {
        angular.extend(result.dirty, configureNamespaces(command).dirty);
      }
      return result;
    }

    function configureNamespaces(command) {
      var result = { dirty: {} };
      command.backingData.filtered.namespaces = command.backingData.account.namespaces;
      if (!_.includes(command.backingData.filtered.namespaces, command.namespace)) {
        command.namespace = null;
        result.dirty.namespace = null;
      }
      return result;
    }

    return {
      configureCommand: configureCommand,
      configureAccount: configureAccount,
      configureNamespaces: configureNamespaces,
    };
  });
