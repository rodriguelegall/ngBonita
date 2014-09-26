'use strict';

/**
 * Resource used to access Bonita archived process instances (cases)
 */
angular.module('ngBonita').factory('ArchivedProcessInstance', function ($resource, bonitaConfig, bonitaUtils) {
	return $resource(bonitaConfig.getBonitaUrl() + '/API/bpm/archivedCase/:id', {
		id : '@id',
		p : 0,
		c : 10
	}, {
		getStartedByCurrentUser : {
			method : 'GET',
			params : {
				f : [ 'started_by=' + bonitaConfig.getUserId() ]
			},
			transformResponse : bonitaUtils.transformPaginateresponse()
		}
	});
});
