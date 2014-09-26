'use strict';

/**
 * Resource used to access Bonita archived human tasks instances
 */
angular.module('ngBonita').factory('ArchivedHumanTask', function ($resource, $cookies, bonitaUtils) {
	return $resource($cookies.bonitaUrl + '/API/bpm/archivedHumanTask/:id', {
		id : '@id',
		p : 0,
		c : 10,
		o : 'reached_state_date ASC'
	}, {
		getCompletedByCurrentUser : {
			method : 'GET',
			params : {
				f : [ 'assigned_id=' + $cookies.bonitaUserId ]
			},
			transformResponse : bonitaUtils.transformPaginateresponse()
		}
	});
});
