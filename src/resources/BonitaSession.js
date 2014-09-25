'use strict';

/**
 * Resource used to access Bonita session information
 */
angular.module('ngBonita').factory('BonitaSession', function ($resource, $cookies) {
	return $resource($cookies.bonitaUrl + '/API/system/session/unused', {}, {
		getCurrent : {
			method : 'GET'
		}
	});
});
