'use strict';

/**
 * Resource used to access Bonita archived process instances (cases)
 */
angular.module('ngBonita').factory('ArchivedProcessInstance', function ($resource, $cookies, bonitaUtils) {
	return $resource($cookies.bonitaUrl + '/API/bpm/archivedCase/:id', {
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
