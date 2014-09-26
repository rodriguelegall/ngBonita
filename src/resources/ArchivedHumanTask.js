'use strict';

/**
 * Resource used to access Bonita archived human tasks instances
 */
angular.module('ngBonita').factory('ArchivedHumanTask', function ($resource, bonitaConfig, bonitaUtils) {
	return $resource(bonitaConfig.getBonitaUrl() + '/API/bpm/archivedHumanTask/:id', {
		id : '@id',
		p : 0,
		c : 10,
		o : 'reached_state_date ASC'
	}, {
		getCompletedByCurrentUser : {
			method : 'GET',
			params : {
				f : [ 'assigned_id=' + bonitaConfig.getUserId() ]
			},
			transformResponse : bonitaUtils.transformPaginateresponse()
		}
	});
});
