'use strict';

/**
 * Resource used to access Bonita users
 */
angular.module('ngBonita').factory('User', function ($resource, $cookies) {
	return $resource($cookies.bonitaUrl + '/API/identity/user/:id', {
		id : '@id'
	});
});
