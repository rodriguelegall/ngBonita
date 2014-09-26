'use strict';

/**
 * Resource used to access Bonita process instances (cases)
 */
angular.module('ngBonita').factory('ProcessInstance', function ($resource, $cookies, bonitaUtils) {
	return $resource($cookies.bonitaUrl + '/API/bpm/case/:id', {
		id : '@id',
		p : 0,
		c : 10
	}, {
		getStartedByCurrentUser : {
			method : 'GET',
			params : {
				f : [ 'started_by=' + $cookies.bonitaUserId ]
			},
			transformResponse : bonitaUtils.transformPaginateresponse()
		}
	});
});