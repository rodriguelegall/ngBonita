'use strict';

/**
 * Resource used to access Bonita session information
 * When using getCurrent, be careful to check for session properties (if no session exists an object without properties is returned)
 */
angular.module('ngBonita').factory('BonitaSession', function ($resource, bonitaConfig) {
	return $resource(bonitaConfig.getBonitaUrl() + '/API/system/session/unused', {}, {
		getCurrent : {
			method : 'GET'
		}
	});
});
