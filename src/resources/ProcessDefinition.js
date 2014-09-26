'use strict';

/**
 * Resource used to access Bonita process definition (apps)
 */
angular.module('ngBonita').factory('ProcessDefinition', function ($resource, $cookies, bonitaUtils) {
	return $resource($cookies.bonitaUrl + '/API/bpm/process/:id', {
		id : '@id',
		p : 0,
		c : 10,
		o : 'displayName ASC'
	}, {
		getStartableByCurrentUser : {
			method : 'GET',
			params : {
				f : [ 'user_id=' + $cookies.bonitaUserId ]
			},
			transformResponse : bonitaUtils.transformPaginateresponse()
		}
	});
});
