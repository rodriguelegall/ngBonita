'use strict';

/**
 * Resource used to access Bonita users
 */
angular.module('ngBonita').factory('User', function ($resource, bonitaConfig) {
	return $resource(bonitaConfig.getBonitaUrl() + '/API/identity/user/:id', {
		id : '@id'
	});
});
