'use strict';

/**
 * Resource used to access Bonita session information
 */
angular.module('ngBonita').factory('BonitaSession', function ($resource, bonitaConfig) {
	return $resource(bonitaConfig.getBonitaUrl() + '/API/system/session/unused', {}, {
		getCurrent : {
			method : 'GET'
		}
	});
});
