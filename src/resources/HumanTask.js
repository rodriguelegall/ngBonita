'use strict';

/**
 * Resource used to access Bonita human tasks instances
 */
angular.module('ngBonita').factory('HumanTask', function ($resource, bonitaConfig, bonitaUtils) {
	return $resource(bonitaConfig.getBonitaUrl() + '/API/bpm/humanTask/:id', {
		id : '@id',
		p : 0,
		c : 10,
		o : 'priority ASC'
	}, {
		getFromCurrentUser : {
			method : 'GET',
			params : {
				f : [ 'state=ready', 'user_id=' + bonitaConfig.getUserId() ]
			},
			transformResponse : bonitaUtils.transformPaginateresponse()
		}
	});
});
